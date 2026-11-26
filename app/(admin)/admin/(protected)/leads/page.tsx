import React from "react";
import type { LeadStatus } from "@prisma/client";
import { AlertTriangle } from "lucide-react";
import {
  getCachedAdminLeadDetail,
  getCachedAdminLeadsList,
} from "@/lib/admin/cache";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { LeadsWorkspace } from "@/components/admin/leads-workspace";

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

  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  // When an explicit lead ID is selected, fetch list + detail in parallel instead of sequentially.
  const [leads, preloadedDetail] = dbConfigured
    ? await Promise.all([
        getCachedAdminLeadsList().catch((err: unknown) => {
          dbError =
            err instanceof Error ? err.message : "Database query failed.";
          return [];
        }),
        selectedIdParam
          ? getCachedAdminLeadDetail(selectedIdParam).catch(() => null)
          : Promise.resolve(null),
      ])
    : [[], null];

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

  const selectedLead = selectedIdParam
    ? preloadedDetail
    : leads[0]?.id
      ? await getCachedAdminLeadDetail(leads[0].id).catch(() => null)
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
