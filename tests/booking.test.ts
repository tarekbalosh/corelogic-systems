import { describe, expect, it } from "vitest";
import type { BookingStatus, Lead } from "@prisma/client";
import {
  getAvailableSlots,
  type AvailabilityRuleRecord,
  type BlockedDateRecord,
} from "@/lib/booking/availability";
import {
  createPendingBooking,
  decideBooking,
  getBookingStatus,
  SlotUnavailableError,
  type BookingDbClient,
  type BookingTxClient,
  type BookingWithLead,
} from "@/lib/booking/booking";

interface InMemoryBookingRow {
  id: string;
  leadId: string;
  startsAt: Date;
  endsAt: Date;
  status: BookingStatus;
  customerNote: string | null;
  decidedAt: Date | null;
  alternativeProposal: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function createFakeLead(leadId: string): Lead & {
  conversations: Array<{ id: string; language: string | null }>;
} {
  const now = new Date("2026-11-24T00:00:00.000Z");
  return {
    id: leadId,
    name: "Ahmad Test",
    whatsappNumber: "+60123456789",
    email: null,
    companyName: "Test Co",
    requestType: "CONSULTATION",
    projectType: "ERP",
    projectDescription: "Custom ERP system",
    requirements: null,
    existingSystem: null,
    budgetRange: null,
    expectedStart: null,
    consentGiven: true,
    consentAt: now,
    status: "NEW",
    notifiedAt: now,
    createdAt: now,
    updatedAt: now,
    conversations: [{ id: "conv_1", language: "en" }],
  };
}

/**
 * In-memory database harness supporting both non-serialized concurrent race simulation
 * (to trigger the PostgreSQL partial unique index P2002 error path) and serialized execution.
 */
function createMockBookingDb(seed?: {
  rules?: AvailabilityRuleRecord[];
  blockedDates?: BlockedDateRecord[];
  bookings?: InMemoryBookingRow[];
  simulateConcurrentSnapshots?: boolean;
}) {
  const defaultRules: AvailabilityRuleRecord[] = [1, 2, 3, 4, 5].flatMap(
    (dayOfWeek) => [
      { dayOfWeek, startTime: "10:00", endTime: "12:30", active: true },
      { dayOfWeek, startTime: "14:00", endTime: "18:00", active: true },
    ]
  );

  const rules = seed?.rules ?? defaultRules;
  const blockedDates = seed?.blockedDates ?? [];
  const bookings: InMemoryBookingRow[] = [...(seed?.bookings ?? [])];
  let seq = 1;
  let mutex = Promise.resolve();

  const txClient: BookingTxClient = {
    availabilityRule: {
      async findMany({ where }) {
        return rules.filter((r) => r.active === where.active);
      },
    },
    blockedDate: {
      async findMany() {
        return blockedDates;
      },
    },
    booking: {
      async findFirst({ where }) {
        // Yield a microtask so two concurrent callers both pass the read check when
        // simulateConcurrentSnapshots=true, hitting the partial unique index on create()!
        await Promise.resolve();
        const found = bookings.find(
          (b) =>
            where.status.in.includes(b.status as "PENDING" | "CONFIRMED") &&
            b.startsAt < where.startsAt.lt &&
            b.endsAt > where.endsAt.gt
        );
        return found ? { id: found.id } : null;
      },
      async create({ data }) {
        // Enforce partial unique index: unique(startsAt) WHERE status IN ('PENDING', 'CONFIRMED')
        const duplicateActive = bookings.find(
          (b) =>
            (b.status === "PENDING" || b.status === "CONFIRMED") &&
            b.startsAt.getTime() === data.startsAt.getTime()
        );
        if (duplicateActive) {
          const err = new Error(
            "Unique constraint failed on the fields: (`startsAt`)"
          ) as Error & { code: string };
          err.code = "P2002";
          throw err;
        }

        const now = new Date();
        const row: InMemoryBookingRow = {
          id: `bk_${seq++}`,
          leadId: data.leadId,
          startsAt: data.startsAt,
          endsAt: data.endsAt,
          status: data.status,
          customerNote: data.customerNote,
          decidedAt: null,
          alternativeProposal: null,
          createdAt: now,
          updatedAt: now,
        };
        bookings.push(row);
        return {
          ...row,
          lead: createFakeLead(data.leadId),
        } satisfies BookingWithLead;
      },
      async findUnique({ where }) {
        const found = bookings.find((b) => b.id === where.id);
        if (!found) return null;
        return {
          ...found,
          lead: createFakeLead(found.leadId),
        };
      },
      async update({ where, data }) {
        const idx = bookings.findIndex((b) => b.id === where.id);
        if (idx === -1) {
          throw new Error("Record to update not found");
        }
        const updated: InMemoryBookingRow = {
          ...bookings[idx],
          status: data.status,
          decidedAt: data.decidedAt,
          alternativeProposal:
            data.alternativeProposal !== undefined
              ? data.alternativeProposal
              : bookings[idx].alternativeProposal,
          updatedAt: new Date(),
        };
        bookings[idx] = updated;
        return {
          ...updated,
          lead: createFakeLead(updated.leadId),
        };
      },
    },
  };

  const dbClient: BookingDbClient & {
    booking: BookingTxClient["booking"] & {
      findMany: (args: {
        where: {
          status: { in: Array<"PENDING" | "CONFIRMED"> };
          endsAt: { gt: Date };
          startsAt: { lt: Date };
        };
      }) => Promise<Array<{ startsAt: Date; endsAt: Date }>>;
    };
  } = {
    ...txClient,
    booking: {
      ...txClient.booking,
      async findMany({ where }) {
        return bookings
          .filter(
            (b) =>
              where.status.in.includes(b.status as "PENDING" | "CONFIRMED") &&
              b.endsAt > where.endsAt.gt &&
              b.startsAt < where.startsAt.lt
          )
          .map((b) => ({ startsAt: b.startsAt, endsAt: b.endsAt }));
      },
    },
    async $transaction<T>(fn: (tx: BookingTxClient) => Promise<T>): Promise<T> {
      if (seed?.simulateConcurrentSnapshots) {
        return fn(txClient);
      }
      const prev = mutex;
      let release!: () => void;
      mutex = new Promise<void>((resolve) => {
        release = resolve;
      });
      await prev;
      try {
        return await fn(txClient);
      } finally {
        release();
      }
    },
  };

  return { dbClient, bookings };
}

describe("booking & availability business logic (Step 4)", () => {
  it("excludes past slots and slots less than 2 hours from now", async () => {
    // Tuesday 2026-11-24 09:15 MYT = 2026-11-24T01:15:00.000Z
    // +2 hours cutoff = 11:15 MYT -> 10:00, 10:30, 11:00 MYT must be excluded; first valid is 11:30 MYT (03:30 UTC)
    const now = new Date("2026-11-24T01:15:00.000Z");
    const { dbClient } = createMockBookingDb();

    const result = await getAvailableSlots(
      { now, timeZone: "Asia/Kuala_Lumpur", maxPerDay: 20, maxDays: 1 },
      dbClient
    );

    expect(result.slots.length).toBeGreaterThan(0);
    expect(result.slots[0].startsAt).toBe("2026-11-24T03:30:00.000Z");
    expect(result.slots[0].label_en).toContain("Tuesday, Nov 24, 2026");
    expect(result.slots[0].label_en).toContain("11:30 AM – 12:00 PM");
    expect(result.slots[0].label_en).toContain("MYT (Malaysia time)");
    expect(result.slots[0].label_ar).toContain("الثلاثاء");
    expect(result.slots[0].label_ar).toContain("نوفمبر");
    expect(result.slots[0].label_ar).toContain("MYT (Malaysia time)");
  });

  it("excludes PENDING and CONFIRMED bookings while allowing REJECTED/CANCELLED slots", async () => {
    const now = new Date("2026-11-24T00:00:00.000Z"); // 08:00 MYT Tuesday
    // 10:00 MYT = 02:00 UTC (PENDING -> excluded)
    // 10:30 MYT = 02:30 UTC (CONFIRMED -> excluded)
    // 11:00 MYT = 03:00 UTC (REJECTED -> still available!)
    const { dbClient } = createMockBookingDb({
      bookings: [
        {
          id: "b1",
          leadId: "l1",
          startsAt: new Date("2026-11-24T02:00:00.000Z"),
          endsAt: new Date("2026-11-24T02:30:00.000Z"),
          status: "PENDING",
          customerNote: null,
          decidedAt: null,
          alternativeProposal: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "b2",
          leadId: "l2",
          startsAt: new Date("2026-11-24T02:30:00.000Z"),
          endsAt: new Date("2026-11-24T03:00:00.000Z"),
          status: "CONFIRMED",
          customerNote: null,
          decidedAt: now,
          alternativeProposal: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "b3",
          leadId: "l3",
          startsAt: new Date("2026-11-24T03:00:00.000Z"),
          endsAt: new Date("2026-11-24T03:30:00.000Z"),
          status: "REJECTED",
          customerNote: null,
          decidedAt: now,
          alternativeProposal: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
    });

    const result = await getAvailableSlots(
      { now, timeZone: "Asia/Kuala_Lumpur", maxPerDay: 20, maxDays: 1 },
      dbClient
    );

    const startTimes = result.slots.map((s) => s.startsAt);
    expect(startTimes).not.toContain("2026-11-24T02:00:00.000Z");
    expect(startTimes).not.toContain("2026-11-24T02:30:00.000Z");
    expect(startTimes).toContain("2026-11-24T03:00:00.000Z");
  });

  it("excludes BlockedDate dates and sets moreAvailable when capped", async () => {
    const now = new Date("2026-11-24T00:00:00.000Z"); // Tuesday 2026-11-24 08:00 MYT
    const { dbClient } = createMockBookingDb({
      blockedDates: [{ date: new Date("2026-11-24T00:00:00.000Z") }], // Block Tuesday
    });

    const result = await getAvailableSlots(
      { now, timeZone: "Asia/Kuala_Lumpur", maxPerDay: 6, maxDays: 3 },
      dbClient
    );

    expect(result.slots.every((s) => s.dayKey !== "2026-11-24")).toBe(true);
    expect(result.slots[0].dayKey).toBe("2026-11-25"); // Starts on Wednesday
    expect(result.moreAvailable).toBe(true);
  });

  it("handles timezone boundaries accurately around midnight UTC vs MYT (+08:00)", async () => {
    // 2026-11-24T17:30:00.000Z is still Nov 24 in UTC, NOT Nov 24 in Malaysia — it is
    // Wednesday 2026-11-25 01:30 AM MYT!
    // Blocking 2026-11-25 in MYT must block Wednesday's 10:00 MYT (02:00 UTC) slot,
    // and first available day must be Thursday 2026-11-26 10:00 MYT (2026-11-26T02:00:00.000Z).
    const nowAroundMidnightMyt = new Date("2026-11-24T17:30:00.000Z");
    const { dbClient } = createMockBookingDb({
      blockedDates: [{ date: new Date("2026-11-25T00:00:00.000Z") }],
    });

    const result = await getAvailableSlots(
      { now: nowAroundMidnightMyt, timeZone: "Asia/Kuala_Lumpur" },
      dbClient
    );

    expect(result.slots[0].dayKey).toBe("2026-11-26");
    expect(result.slots[0].startsAt).toBe("2026-11-26T02:00:00.000Z");
    expect(result.slots[0].label_en).toContain("Thursday, Nov 26, 2026");
    expect(result.slots[0].label_ar).toContain("الخميس");
  });

  it("prevents double-booking in a parallel race: exactly one succeeds and the second throws SlotUnavailableError", async () => {
    const now = new Date("2026-11-24T00:00:00.000Z");
    const targetSlot = "2026-11-25T02:00:00.000Z"; // Wed 10:00 MYT

    // Test both concurrent snapshot race (unique index P2002 path) and serialized lock path
    for (const simulateConcurrentSnapshots of [true, false]) {
      const { dbClient, bookings } = createMockBookingDb({
        simulateConcurrentSnapshots,
      });

      const outcomes = await Promise.allSettled([
        createPendingBooking(
          { leadId: "lead_A", startsAt: targetSlot, note: "Visitor A" },
          { now, timeZone: "Asia/Kuala_Lumpur" },
          dbClient
        ),
        createPendingBooking(
          { leadId: "lead_B", startsAt: targetSlot, note: "Visitor B" },
          { now, timeZone: "Asia/Kuala_Lumpur" },
          dbClient
        ),
      ]);

      const fulfilled = outcomes.filter((o) => o.status === "fulfilled");
      const rejected = outcomes.filter(
        (o): o is PromiseRejectedResult => o.status === "rejected"
      );

      expect(fulfilled).toHaveLength(1);
      expect(rejected).toHaveLength(1);
      expect(rejected[0].reason).toBeInstanceOf(SlotUnavailableError);
      expect(bookings).toHaveLength(1);
      expect(bookings[0].status).toBe("PENDING");
    }
  });

  it("makes decideBooking idempotent when called multiple times", async () => {
    const now = new Date("2026-11-24T00:00:00.000Z");
    const { dbClient } = createMockBookingDb();

    const created = await createPendingBooking(
      { leadId: "lead_1", startsAt: "2026-11-25T02:00:00.000Z" },
      { now, timeZone: "Asia/Kuala_Lumpur" },
      dbClient
    );

    const decisionTime = new Date("2026-11-24T04:00:00.000Z");
    const first = await decideBooking(
      { bookingId: created.id, decision: "CONFIRM", now: decisionTime },
      dbClient
    );
    expect(first.alreadyDecided).toBe(false);
    expect(first.booking.status).toBe("CONFIRMED");
    expect(first.booking.decidedAt?.toISOString()).toBe(
      "2026-11-24T04:00:00.000Z"
    );

    // Second call (even with a later timestamp or opposite button tap) returns existing state cleanly
    const second = await decideBooking(
      {
        bookingId: created.id,
        decision: "CONFIRM",
        now: new Date("2026-11-24T05:00:00.000Z"),
      },
      dbClient
    );
    expect(second.alreadyDecided).toBe(true);
    expect(second.booking.status).toBe("CONFIRMED");
    expect(second.booking.decidedAt?.toISOString()).toBe(
      "2026-11-24T04:00:00.000Z"
    );

    const status = await getBookingStatus(created.id, dbClient);
    expect(status?.status).toBe("CONFIRMED");
  });
});
