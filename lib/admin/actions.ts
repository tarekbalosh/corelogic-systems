"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/db";
import { setWidgetRuntimePaused } from "@/lib/agent/runtime-flags";
import { parseTimeToMinutes } from "@/lib/booking/availability";
import { decideBooking } from "@/lib/booking/booking";
import {
  clearAdminSessionCookie,
  requireAdminSession,
  setAdminSessionCookie,
  verifyAdminTokenConstantTime,
} from "@/lib/security/admin-auth";
import { safeLogError, safeLogInfo } from "@/lib/security/mask";
import { checkAdminLoginRateLimit } from "@/lib/security/rate-limit";
import { notifyCustomerBookingDecision } from "@/lib/whatsapp/notifications";

const UpdateLeadStatusSchema = z.object({
  leadId: z.string().trim().min(2).max(64),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CLOSED"]),
});

const DecideBookingAdminSchema = z.object({
  bookingId: z.string().trim().min(2).max(64),
  decision: z.enum(["CONFIRM", "REJECT"]),
  alternativeProposal: z.string().trim().max(1000).optional(),
});

const CreateRuleSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
});

const CreateBlockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().trim().max(240).optional(),
});

async function getActionClientIp(): Promise<string> {
  const hdrs = await headers();
  const xff = hdrs.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return hdrs.get("x-real-ip")?.trim() || "127.0.0.1";
}

export async function loginAdminAction(formData: FormData): Promise<void> {
  const configuredSecret = process.env.ADMIN_TOKEN?.trim();
  const minLength = process.env.NODE_ENV === "production" ? 12 : 4;
  if (!configuredSecret || configuredSecret.length < minLength) {
    redirect("/admin/login?error=not_configured");
  }

  const clientIp = await getActionClientIp();
  const rateCheck = await checkAdminLoginRateLimit({ clientIp });
  if (!rateCheck.allowed) {
    redirect("/admin/login?error=rate_limited");
  }

  const rawToken = String(formData.get("token") ?? "");
  if (!verifyAdminTokenConstantTime(rawToken, configuredSecret)) {
    redirect("/admin/login?error=invalid_token");
  }

  await setAdminSessionCookie();
  safeLogInfo("admin.login.success", {});
  redirect("/admin/leads");
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

export async function updateLeadStatusAction(formData: FormData): Promise<void> {
  await requireAdminSession();

  const parsed = UpdateLeadStatusSchema.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await prisma.lead.update({
    where: { id: parsed.data.leadId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin/leads");
}

export interface DeleteLeadAdminResult {
  ok: boolean;
  blockedByInvoices?: boolean;
  invoiceNumbers?: string[];
  message?: string;
}

export async function deleteLeadAdminAction(
  formData: FormData
): Promise<DeleteLeadAdminResult> {
  await requireAdminSession();

  const leadId = String(formData.get("leadId") ?? "").trim();
  if (!leadId) {
    return { ok: false, message: "Lead ID is required." };
  }

  // GoBD / § 147 AO retention guard: NEVER delete a lead linked to issued invoices.
  const linkedIssuedInvoices = await prisma.invoice
    .findMany({
      where: {
        status: { not: "DRAFT" },
        customer: { leadId },
      },
      select: { id: true, invoiceNumber: true },
    })
    .catch(() => []);

  if (linkedIssuedInvoices.length > 0) {
    const invoiceNumbers = linkedIssuedInvoices
      .map((inv) => inv.invoiceNumber)
      .filter((num): num is string => Boolean(num));

    await prisma.invoiceAuditLog
      .createMany({
        data: linkedIssuedInvoices.map((inv) => ({
          invoiceId: inv.id,
          action: "LEAD_DELETION_BLOCKED" as const,
          actor: "admin",
          metadata: {
            leadId,
            reason:
              "Statutory tax retention obligation (§ 147 AO / GoBD): Lead deletion blocked while linked to issued invoices.",
          },
        })),
      })
      .catch(() => undefined);

    safeLogInfo("admin.lead.delete_blocked_gobd", {
      leadId,
      invoiceCount: linkedIssuedInvoices.length,
    });

    return {
      ok: false,
      blockedByInvoices: true,
      invoiceNumbers,
      message: `Deletion blocked (GoBD / § 147 AO retention): This lead is linked to issued invoice(s) ${invoiceNumbers.join(", ")}. Issued invoice records must be retained and cannot be deleted.`,
    };
  }

  await prisma.$transaction([
    prisma.billingCustomer.updateMany({
      where: { leadId },
      data: { leadId: null },
    }),
    prisma.conversation.deleteMany({ where: { leadId } }),
    prisma.booking.deleteMany({ where: { leadId } }),
    prisma.lead.deleteMany({ where: { id: leadId } }),
  ]);

  safeLogInfo("admin.lead.deleted", { leadId });
  revalidatePath("/admin/leads");
  revalidatePath("/admin/bookings");
  redirect("/admin/leads");
}

export async function decideBookingAdminAction(formData: FormData): Promise<void> {
  await requireAdminSession();

  const parsed = DecideBookingAdminSchema.safeParse({
    bookingId: formData.get("bookingId"),
    decision: formData.get("decision"),
    alternativeProposal: formData.get("alternativeProposal") || undefined,
  });
  if (!parsed.success) return;

  const result = await decideBooking({
    bookingId: parsed.data.bookingId,
    decision: parsed.data.decision,
    alternativeProposal: parsed.data.alternativeProposal,
  });

  if (!result.alreadyDecided) {
    try {
      await notifyCustomerBookingDecision(result.booking, parsed.data.decision);
    } catch (err) {
      safeLogError("admin.booking.customer_notify_failed", err, {
        bookingId: result.booking.id,
        decision: parsed.data.decision,
      });
    }
  } else if (parsed.data.alternativeProposal !== undefined) {
    // Allow saving/updating alternative proposal note on already-decided booking
    await prisma.booking.update({
      where: { id: parsed.data.bookingId },
      data: {
        alternativeProposal: parsed.data.alternativeProposal.trim() || null,
      },
    });
  }

  revalidatePath("/admin/bookings");
}

export async function saveAlternativeProposalAction(
  formData: FormData
): Promise<void> {
  await requireAdminSession();

  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const alternativeProposal = String(
    formData.get("alternativeProposal") ?? ""
  ).trim();
  if (!bookingId) return;

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      alternativeProposal: alternativeProposal.slice(0, 1000) || null,
    },
  });

  revalidatePath("/admin/bookings");
}

export async function createAvailabilityRuleAction(
  formData: FormData
): Promise<void> {
  await requireAdminSession();

  const parsed = CreateRuleSchema.safeParse({
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  });
  if (!parsed.success) return;

  const startMins = parseTimeToMinutes(parsed.data.startTime);
  const endMins = parseTimeToMinutes(parsed.data.endTime);
  if (startMins === null || endMins === null || endMins <= startMins) {
    return;
  }

  await prisma.availabilityRule.upsert({
    where: {
      dayOfWeek_startTime_endTime: {
        dayOfWeek: parsed.data.dayOfWeek,
        startTime: parsed.data.startTime,
        endTime: parsed.data.endTime,
      },
    },
    update: { active: true },
    create: {
      dayOfWeek: parsed.data.dayOfWeek,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      active: true,
    },
  });

  revalidatePath("/admin/availability");
}

export async function toggleAvailabilityRuleAction(
  formData: FormData
): Promise<void> {
  await requireAdminSession();

  const ruleId = String(formData.get("ruleId") ?? "").trim();
  const nextActive = formData.get("nextActive") === "true";
  if (!ruleId) return;

  await prisma.availabilityRule.update({
    where: { id: ruleId },
    data: { active: nextActive },
  });

  revalidatePath("/admin/availability");
}

export async function deleteAvailabilityRuleAction(
  formData: FormData
): Promise<void> {
  await requireAdminSession();

  const ruleId = String(formData.get("ruleId") ?? "").trim();
  if (!ruleId) return;

  await prisma.availabilityRule.deleteMany({ where: { id: ruleId } });
  revalidatePath("/admin/availability");
}

export async function createBlockedDateAction(
  formData: FormData
): Promise<void> {
  await requireAdminSession();

  const parsed = CreateBlockedDateSchema.safeParse({
    date: formData.get("date"),
    reason: formData.get("reason") || undefined,
  });
  if (!parsed.success) return;

  const dateUtc = new Date(`${parsed.data.date}T00:00:00.000Z`);
  if (Number.isNaN(dateUtc.getTime())) return;

  await prisma.blockedDate.upsert({
    where: { date: dateUtc },
    update: { reason: parsed.data.reason ?? null },
    create: {
      date: dateUtc,
      reason: parsed.data.reason ?? null,
    },
  });

  revalidatePath("/admin/availability");
}

export async function deleteBlockedDateAction(
  formData: FormData
): Promise<void> {
  await requireAdminSession();

  const blockedId = String(formData.get("blockedId") ?? "").trim();
  if (!blockedId) return;

  await prisma.blockedDate.deleteMany({ where: { id: blockedId } });
  revalidatePath("/admin/availability");
}

export async function toggleWidgetPauseAdminAction(
  formData: FormData
): Promise<void> {
  await requireAdminSession();

  const paused = formData.get("paused") === "true";
  await setWidgetRuntimePaused(paused);

  revalidatePath("/admin/leads");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/availability");
}
