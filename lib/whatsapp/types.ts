import type { Booking, Lead } from "@prisma/client";

export interface EscalationNoticePayload {
  conversationId: string;
  sessionId: string;
  reason: string;
  urgency: "normal" | "high";
  lead?: Pick<Lead, "id" | "name" | "whatsappNumber" | "requestType"> | null;
}

export interface AgentNotificationAdapter {
  notifyNewLead(lead: Lead): Promise<void>;
  notifyBookingRequest(
    booking: Booking & { lead: Lead }
  ): Promise<void>;
  notifyEscalation(payload: EscalationNoticePayload): Promise<void>;
}
