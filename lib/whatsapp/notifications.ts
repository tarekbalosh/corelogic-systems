import type { Booking, Lead } from "@prisma/client";
import { maskPhone, safeLogInfo } from "@/lib/security/mask";
import type {
  AgentNotificationAdapter,
  EscalationNoticePayload,
} from "@/lib/whatsapp/types";

/**
 * Default server-side notification adapter (wired to full WhatsApp Cloud API templates in Step 7).
 */
export async function notifyNewLead(lead: Lead): Promise<void> {
  safeLogInfo("whatsapp.notify_new_lead.pending_config", {
    leadId: lead.id,
    requestType: lead.requestType,
    phone: maskPhone(lead.whatsappNumber),
  });
}

export async function notifyBookingRequest(
  booking: Booking & { lead: Lead }
): Promise<void> {
  safeLogInfo("whatsapp.notify_booking_request.pending_config", {
    bookingId: booking.id,
    leadId: booking.leadId,
    startsAt: booking.startsAt.toISOString(),
    phone: maskPhone(booking.lead.whatsappNumber),
  });
}

export async function notifyEscalation(
  payload: EscalationNoticePayload
): Promise<void> {
  safeLogInfo("whatsapp.notify_escalation.pending_config", {
    conversationId: payload.conversationId,
    urgency: payload.urgency,
    leadId: payload.lead?.id ?? null,
  });
}

export const defaultNotificationAdapter: AgentNotificationAdapter = {
  notifyNewLead,
  notifyBookingRequest,
  notifyEscalation,
};
