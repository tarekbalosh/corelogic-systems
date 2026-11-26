import React from "react";
import type { LeadStatus } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import { AlertTriangle } from "lucide-react";
import prisma from "@/lib/db";
import { getBusinessTimezone } from "@/lib/booking/availability";
import { requireAdminSession } from "@/lib/security/admin-auth";
import {
  LeadsWorkspace,
  type SerializedLeadDetail,
  type SerializedLeadRow,
} from "@/components/admin/leads-workspace";

export const dynamic = "force-dynamic";

const LEAD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED"];

interface AdminLeadsPageProps {
  searchParams: Promise<{ status?: string; id?: string }>;
}

export default async function AdminLeadsPage({
  searchParams,
}: AdminLeadsPageProps) {
  await requireAdminSession();

  const params = await searchParams;
  const initialStatus = LEAD_STATUSES.includes(params.status as LeadStatus)
    ? (params.status as LeadStatus)
    : "ALL";
  const selectedIdParam = params.id?.trim() || undefined;
  const tz = getBusinessTimezone();

  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  const rawLeads = dbConfigured
    ? await prisma.lead
        .findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
        })
        .catch((err: unknown) => {
          dbError =
            err instanceof Error ? err.message : "Database query failed.";
          return [];
        })
    : [];

  if (!dbConfigured || dbError) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-bold">Database not ready</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            {!dbConfigured
              ? "Set DATABASE_URL in .env.local and run `npx prisma migrate deploy` to view stored leads."
              : "Unable to query database. Verify DATABASE_URL and ensure migrations have been applied."}
          </p>
        </div>
      </div>
    );
  }

  const leads: SerializedLeadRow[] = rawLeads.map((lead) => ({
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

  const targetLeadId = selectedIdParam ?? rawLeads[0]?.id;
  const rawSelected = targetLeadId
    ? await prisma.lead
        .findUnique({
          where: { id: targetLeadId },
          include: {
            conversations: {
              orderBy: { updatedAt: "desc" },
              include: {
                messages: {
                  orderBy: { createdAt: "asc" },
                },
              },
            },
            bookings: {
              orderBy: { startsAt: "desc" },
            },
          },
        })
        .catch(() => null)
    : null;

  const selectedLead: SerializedLeadDetail | null = rawSelected
    ? {
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
      }
    : null;

  return (
    <LeadsWorkspace
      leads={leads}
      selectedLead={selectedLead}
      initialStatus={initialStatus}
      hasExplicitSelection={Boolean(selectedIdParam)}
    />
  );
}
