import { Prisma, type Booking, type BookingStatus, type Lead } from "@prisma/client";
import prisma from "@/lib/db";
import {
  getBookingWindowDays,
  getBusinessTimezone,
  getMeetingDurationMinutes,
  isSlotAlignedWithSchedule,
  type AvailabilityRuleRecord,
  type BlockedDateRecord,
} from "@/lib/booking/availability";

export type BookingWithLead = Booking & {
  lead: Lead & {
    conversations?: Array<{ id: string; language: string | null }>;
  };
};

export class SlotUnavailableError extends Error {
  public readonly code = "SLOT_UNAVAILABLE";

  constructor(message = "The requested consultation time slot is no longer available.") {
    super(message);
    this.name = "SlotUnavailableError";
  }
}

export class BookingNotFoundError extends Error {
  public readonly code = "BOOKING_NOT_FOUND";

  constructor(bookingId: string) {
    super(`Booking not found: ${bookingId}`);
    this.name = "BookingNotFoundError";
  }
}

export interface BookingTxClient {
  availabilityRule: {
    findMany(args: { where: { active: boolean } }): Promise<AvailabilityRuleRecord[]>;
  };
  blockedDate: {
    findMany(args?: object): Promise<BlockedDateRecord[]>;
  };
  booking: {
    findFirst(args: {
      where: {
        status: { in: Array<"PENDING" | "CONFIRMED"> };
        startsAt: { lt: Date };
        endsAt: { gt: Date };
      };
      select: { id: true };
    }): Promise<{ id: string } | null>;
    create(args: {
      data: {
        leadId: string;
        startsAt: Date;
        endsAt: Date;
        status: "PENDING";
        customerNote: string | null;
      };
      include: {
        lead: {
          include: {
            conversations: {
              select: { id: true; language: true };
              orderBy: { updatedAt: "desc" };
              take: 1;
            };
          };
        };
      };
    }): Promise<BookingWithLead>;
    findUnique(args: {
      where: { id: string };
      include?: {
        lead: {
          include: {
            conversations: {
              select: { id: true; language: true };
              orderBy: { updatedAt: "desc" };
              take: 1;
            };
          };
        };
      };
    }): Promise<BookingWithLead | null>;
    update(args: {
      where: { id: string };
      data: {
        status: BookingStatus;
        decidedAt: Date;
        alternativeProposal?: string | null;
      };
      include: {
        lead: {
          include: {
            conversations: {
              select: { id: true; language: true };
              orderBy: { updatedAt: "desc" };
              take: 1;
            };
          };
        };
      };
    }): Promise<BookingWithLead>;
  };
}

export interface BookingDbClient extends BookingTxClient {
  $transaction<T>(
    fn: (tx: BookingTxClient) => Promise<T>,
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
  ): Promise<T>;
}

export interface CreatePendingBookingInput {
  leadId: string;
  startsAt: string | Date;
  note?: string;
}

export interface CreatePendingBookingOptions {
  now?: Date;
  timeZone?: string;
  durationMinutes?: number;
  windowDays?: number;
}

function isPrismaConflictError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = unique constraint violation (partial unique index on startsAt),
    // P2034 = serializable transaction write conflict / deadlock
    return error.code === "P2002" || error.code === "P2034";
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (((error as { code?: string }).code === "P2002") ||
      (error as { code?: string }).code === "P2034")
  ) {
    return true;
  }
  return false;
}

/**
 * Atomically validates and creates a PENDING consultation booking inside a
 * Serializable database transaction. Converts any overlap, schedule mismatch,
 * or unique-index race into `SlotUnavailableError`.
 */
export async function createPendingBooking(
  input: CreatePendingBookingInput,
  options: CreatePendingBookingOptions = {},
  dbClient: BookingDbClient = prisma as unknown as BookingDbClient
): Promise<BookingWithLead> {
  const startsAtDate =
    input.startsAt instanceof Date ? input.startsAt : new Date(input.startsAt);

  if (Number.isNaN(startsAtDate.getTime())) {
    throw new SlotUnavailableError("Invalid slot timestamp.");
  }

  const timeZone = options.timeZone ?? getBusinessTimezone();
  const durationMinutes = options.durationMinutes ?? getMeetingDurationMinutes();
  const windowDays = options.windowDays ?? getBookingWindowDays();
  const now = options.now ?? new Date();
  const endsAtDate = new Date(
    startsAtDate.getTime() + durationMinutes * 60 * 1000
  );

  try {
    return await dbClient.$transaction(
      async (tx) => {
        const [rules, blockedDates, conflictingBooking] = await Promise.all([
          tx.availabilityRule.findMany({ where: { active: true } }),
          tx.blockedDate.findMany(),
          tx.booking.findFirst({
            where: {
              status: { in: ["PENDING", "CONFIRMED"] },
              startsAt: { lt: endsAtDate },
              endsAt: { gt: startsAtDate },
            },
            select: { id: true },
          }),
        ]);

        if (conflictingBooking) {
          throw new SlotUnavailableError(
            "This consultation time slot has already been reserved."
          );
        }

        const aligned = isSlotAlignedWithSchedule({
          startsAtUtc: startsAtDate,
          endsAtUtc: endsAtDate,
          rules,
          blockedDates,
          now,
          timeZone,
          durationMinutes,
          windowDays,
        });

        if (!aligned) {
          throw new SlotUnavailableError(
            "Requested slot is outside available consultation hours or booking window."
          );
        }

        return tx.booking.create({
          data: {
            leadId: input.leadId,
            startsAt: startsAtDate,
            endsAt: endsAtDate,
            status: "PENDING",
            customerNote: input.note?.trim() ? input.note.trim() : null,
          },
          include: {
            lead: {
              include: {
                conversations: {
                  select: { id: true, language: true },
                  orderBy: { updatedAt: "desc" },
                  take: 1,
                },
              },
            },
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      throw error;
    }
    if (isPrismaConflictError(error)) {
      throw new SlotUnavailableError(
        "Slot was just taken by another request. Please pick a different slot."
      );
    }
    throw error;
  }
}

export interface DecideBookingInput {
  bookingId: string;
  decision: "CONFIRM" | "REJECT";
  alternativeProposal?: string;
  now?: Date;
}

export interface DecideBookingResult {
  booking: BookingWithLead;
  alreadyDecided: boolean;
}

/**
 * Transitions a PENDING booking to CONFIRMED or REJECTED.
 * Idempotent: if the booking has already been decided (CONFIRMED, REJECTED, or CANCELLED),
 * returns `{ booking, alreadyDecided: true }` without throwing or overwriting `decidedAt`.
 */
export async function decideBooking(
  input: DecideBookingInput,
  dbClient: BookingDbClient = prisma as unknown as BookingDbClient
): Promise<DecideBookingResult> {
  const targetStatus: BookingStatus =
    input.decision === "CONFIRM" ? "CONFIRMED" : "REJECTED";
  const now = input.now ?? new Date();

  return dbClient.$transaction(
    async (tx) => {
      const existing = await tx.booking.findUnique({
        where: { id: input.bookingId },
        include: {
          lead: {
            include: {
              conversations: {
                select: { id: true, language: true },
                orderBy: { updatedAt: "desc" },
                take: 1,
              },
            },
          },
        },
      });

      if (!existing) {
        throw new BookingNotFoundError(input.bookingId);
      }

      if (existing.status !== "PENDING") {
        return {
          booking: existing,
          alreadyDecided: true,
        };
      }

      const updated = await tx.booking.update({
        where: { id: input.bookingId },
        data: {
          status: targetStatus,
          decidedAt: now,
          ...(input.alternativeProposal !== undefined
            ? {
                alternativeProposal: input.alternativeProposal.trim() || null,
              }
            : {}),
        },
        include: {
          lead: {
            include: {
              conversations: {
                select: { id: true, language: true },
                orderBy: { updatedAt: "desc" },
                take: 1,
              },
            },
          },
        },
      });

      return {
        booking: updated,
        alreadyDecided: false,
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    }
  );
}

/**
 * Returns the current status of a booking, or `null` if no booking exists for `bookingId`.
 */
export async function getBookingStatus(
  bookingId: string,
  dbClient: Pick<BookingTxClient, "booking"> = prisma as unknown as Pick<
    BookingTxClient,
    "booking"
  >
): Promise<{ id: string; status: BookingStatus; decidedAt: Date | null } | null> {
  const row = await dbClient.booking.findUnique({
    where: { id: bookingId },
  });
  if (!row) return null;
  return {
    id: row.id,
    status: row.status,
    decidedAt: row.decidedAt,
  };
}
