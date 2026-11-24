import type { BookingStatus } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/db";

const SessionIdSchema = z.string().uuid();
const BookingIdSchema = z.string().trim().min(2).max(64);

export interface SessionScopedBookingStore {
  findBookingStatusForSession(
    bookingId: string,
    sessionId: string
  ): Promise<BookingStatus | null>;
}

const prismaSessionBookingStore: SessionScopedBookingStore = {
  async findBookingStatusForSession(bookingId, sessionId) {
    const row = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        lead: {
          conversations: {
            some: { sessionId },
          },
        },
      },
      select: { status: true },
    });
    return row?.status ?? null;
  },
};

/**
 * Verifies `sessionId` (UUID) owns the conversation linked to `bookingId`'s lead,
 * returning `{ status }` only (no PII) or `null` (which maps to HTTP 404).
 */
export async function getSessionAuthorizedBookingStatus(
  bookingId: string | undefined,
  sessionId: string | null,
  store: SessionScopedBookingStore = prismaSessionBookingStore
): Promise<{ status: BookingStatus } | null> {
  const parsedBookingId = BookingIdSchema.safeParse(bookingId);
  const parsedSessionId = SessionIdSchema.safeParse(sessionId);

  if (!parsedBookingId.success || !parsedSessionId.success) {
    return null;
  }

  const status = await store.findBookingStatusForSession(
    parsedBookingId.data,
    parsedSessionId.data
  );
  if (!status) {
    return null;
  }

  return { status };
}
