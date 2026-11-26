import { revalidateTag, unstable_cache } from "next/cache";
import prisma from "@/lib/db";
import { getWidgetRuntimePauseState } from "@/lib/agent/runtime-flags";
import {
  getInvoiceDetail,
  getOrInitCompanySettings,
  listBillingCustomers,
  listInvoices,
} from "@/lib/invoicing/service";
import {
  formatSlotLabels,
  getBusinessTimezone,
  normalizeBlockedDateKey,
} from "@/lib/booking/availability";
import { formatInTimeZone } from "date-fns-tz";
import type {
  SerializedLeadDetail,
  SerializedLeadRow,
} from "@/components/admin/leads-workspace";
import type { SerializedBooking } from "@/components/admin/bookings-workspace";
import type {
  SerializedAvailabilityRule,
  SerializedBlockedDate,
} from "@/components/admin/availability-workspace";

export const ADMIN_CACHE_TAGS = {
  WIDGET_STATE: "admin-widget-state",
  COMPANY_SETTINGS: "admin-company-settings",
  CUSTOMERS: "admin-customers",
  INVOICES: "admin-invoices",
  LEADS: "admin-leads",
  BOOKINGS: "admin-bookings",
  AVAILABILITY: "admin-availability",
} as const;

export type AdminCacheTag =
  (typeof ADMIN_CACHE_TAGS)[keyof typeof ADMIN_CACHE_TAGS];

/**
 * Immediately expires one or more admin cache tags using Next.js 16's
 * two-argument `revalidateTag(tag, { expire: 0 })` API.
 * Safe to call in unit tests / scripts outside a Next.js request context.
 */
export function invalidateAdminTags(...tags: AdminCacheTag[]): void {
  for (const tag of tags) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      // No-op when invoked outside Next.js server request context (e.g. Vitest / CLI scripts)
    }
  }
}

export const getCachedWidgetPauseState = unstable_cache(
  async () => getWidgetRuntimePauseState(),
  ["admin:widget-pause-state"],
  {
    tags: [ADMIN_CACHE_TAGS.WIDGET_STATE],
    revalidate: 60,
  }
);

export const getCachedCompanySettings = unstable_cache(
  async () => getOrInitCompanySettings(),
  ["admin:company-settings"],
  {
    tags: [ADMIN_CACHE_TAGS.COMPANY_SETTINGS],
    revalidate: 120,
  }
);

export const getCachedBillingCustomers = unstable_cache(
  async () => listBillingCustomers(),
  ["admin:billing-customers"],
  {
    tags: [ADMIN_CACHE_TAGS.CUSTOMERS],
    revalidate: 60,
  }
);

export const getCachedInvoicesList = unstable_cache(
  async () => listInvoices(),
  ["admin:invoices-list"],
  {
    tags: [ADMIN_CACHE_TAGS.INVOICES],
    revalidate: 30,
  }
);

export function getCachedInvoiceDetail(id: string) {
  return unstable_cache(
    async () => getInvoiceDetail(id),
    ["admin:invoice-detail", id],
    {
      tags: [ADMIN_CACHE_TAGS.INVOICES],
      revalidate: 30,
    }
  )();
}

export const getCachedAdminLeadsList = unstable_cache(
  async (): Promise<SerializedLeadRow[]> => {
    const tz = getBusinessTimezone();
    const rawLeads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        companyName: true,
        requestType: true,
        status: true,
        whatsappNumber: true,
        email: true,
        createdAt: true,
      },
      take: 100,
    });

    return rawLeads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      companyName: lead.companyName,
      requestType: lead.requestType,
      status: lead.status,
      whatsappNumber: lead.whatsappNumber,
      email: lead.email,
      createdAtIso: lead.createdAt.toISOString(),
      createdAtMyt: formatInTimeZone(lead.createdAt, tz, "MMM dd, yyyy · HH:mm"),
    }));
  },
  ["admin:leads-list"],
  {
    tags: [ADMIN_CACHE_TAGS.LEADS],
    revalidate: 15,
  }
);

export function getCachedAdminLeadDetail(id: string) {
  return unstable_cache(
    async (): Promise<SerializedLeadDetail | null> => {
      const tz = getBusinessTimezone();
      const rawSelected = await prisma.lead.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          companyName: true,
          requestType: true,
          status: true,
          whatsappNumber: true,
          email: true,
          projectType: true,
          budgetRange: true,
          expectedStart: true,
          existingSystem: true,
          projectDescription: true,
          requirements: true,
          createdAt: true,
          conversations: {
            orderBy: { updatedAt: "desc" },
            select: {
              messages: {
                orderBy: { createdAt: "asc" },
                select: {
                  id: true,
                  role: true,
                  content: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      });

      if (!rawSelected) return null;

      return {
        id: rawSelected.id,
        name: rawSelected.name,
        companyName: rawSelected.companyName,
        requestType: rawSelected.requestType,
        status: rawSelected.status,
        whatsappNumber: rawSelected.whatsappNumber,
        email: rawSelected.email,
        projectType: rawSelected.projectType,
        budgetRange: rawSelected.budgetRange,
        expectedStart: rawSelected.expectedStart,
        existingSystem: rawSelected.existingSystem,
        projectDescription: rawSelected.projectDescription,
        requirements: rawSelected.requirements,
        createdAtMyt: formatInTimeZone(
          rawSelected.createdAt,
          tz,
          "MMM dd, yyyy · HH:mm"
        ),
        messages: rawSelected.conversations.flatMap((conv) =>
          conv.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timeMyt: formatInTimeZone(m.createdAt, tz, "HH:mm:ss"),
            dateMyt: formatInTimeZone(m.createdAt, tz, "MMM dd"),
          }))
        ),
      };
    },
    ["admin:lead-detail", id],
    {
      tags: [ADMIN_CACHE_TAGS.LEADS],
      revalidate: 15,
    }
  )();
}

export const getCachedAdminBookings = unstable_cache(
  async (): Promise<SerializedBooking[]> => {
    const tz = getBusinessTimezone();
    const rawBookings = await prisma.booking.findMany({
      orderBy: [{ status: "asc" }, { startsAt: "asc" }],
      select: {
        id: true,
        status: true,
        startsAt: true,
        endsAt: true,
        customerNote: true,
        alternativeProposal: true,
        lead: {
          select: {
            name: true,
            whatsappNumber: true,
            companyName: true,
            conversations: {
              select: { language: true },
              orderBy: { updatedAt: "desc" },
              take: 1,
            },
          },
        },
      },
      take: 100,
    });

    return rawBookings.map((bk) => {
      const labels = formatSlotLabels(bk.startsAt, bk.endsAt, tz);
      return {
        id: bk.id,
        status: bk.status,
        leadName: bk.lead.name,
        whatsappNumber: bk.lead.whatsappNumber,
        leadCompany: bk.lead.companyName,
        visitorLanguage: bk.lead.conversations?.[0]?.language ?? null,
        slotLabelMyt: labels.label_en,
        slotLabelDe: labels.label_de,
        customerNote: bk.customerNote,
        alternativeProposal: bk.alternativeProposal,
      };
    });
  },
  ["admin:bookings-list"],
  {
    tags: [ADMIN_CACHE_TAGS.BOOKINGS],
    revalidate: 15,
  }
);

export const getCachedAdminAvailability = unstable_cache(
  async (): Promise<{
    rules: SerializedAvailabilityRule[];
    blockedDates: SerializedBlockedDate[];
  }> => {
    const [rawRules, rawBlockedDates] = await Promise.all([
      prisma.availabilityRule.findMany({
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          active: true,
        },
      }),
      prisma.blockedDate.findMany({
        orderBy: { date: "asc" },
        select: {
          id: true,
          date: true,
          reason: true,
        },
      }),
    ]);

    return {
      rules: rawRules,
      blockedDates: rawBlockedDates.map((bd) => ({
        id: bd.id,
        dateKey: normalizeBlockedDateKey(bd.date),
        reason: bd.reason,
      })),
    };
  },
  ["admin:availability"],
  {
    tags: [ADMIN_CACHE_TAGS.AVAILABILITY],
    revalidate: 60,
  }
);
