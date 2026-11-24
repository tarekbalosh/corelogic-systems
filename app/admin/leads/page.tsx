import React from "react";
import Link from "next/link";
import type { LeadStatus } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import { ExternalLink, MessageCircle, Trash2 } from "lucide-react";
import prisma from "@/lib/db";
import {
  deleteLeadAdminAction,
  updateLeadStatusAction,
} from "@/lib/admin/actions";
import { getBusinessTimezone } from "@/lib/booking/availability";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

const LEAD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED"];

function statusBadgeClass(status: LeadStatus): string {
  switch (status) {
    case "NEW":
      return "bg-indigo-100 text-indigo-800";
    case "CONTACTED":
      return "bg-sky-100 text-sky-800";
    case "QUALIFIED":
      return "bg-emerald-100 text-emerald-800";
    case "CLOSED":
      return "bg-slate-200 text-slate-700";
  }
}

interface AdminLeadsPageProps {
  searchParams: Promise<{ status?: string; id?: string }>;
}

export default async function AdminLeadsPage({
  searchParams,
}: AdminLeadsPageProps) {
  await requireAdminSession();

  const params = await searchParams;
  const statusFilter = LEAD_STATUSES.includes(params.status as LeadStatus)
    ? (params.status as LeadStatus)
    : undefined;
  const selectedId = params.id?.trim() || undefined;
  const tz = getBusinessTimezone();

  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  const leads = dbConfigured
    ? await prisma.lead
        .findMany({
          where: statusFilter ? { status: statusFilter } : undefined,
          orderBy: { createdAt: "desc" },
          take: 100,
        })
        .catch((err: unknown) => {
          dbError =
            err instanceof Error ? err.message : "Database query failed.";
          return [];
        })
    : [];

  const targetLeadId = selectedId ?? leads[0]?.id;
  const selectedLead =
    dbConfigured && targetLeadId
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

  return (
    <AdminShell
      activeTab="leads"
      title="Captured Leads & Conversations"
      subtitle="Review qualified leads, inspect full chat transcripts, and update follow-up status."
    >
      {!dbConfigured || dbError ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <strong>Database not ready:</strong>{" "}
          {!dbConfigured
            ? "Set DATABASE_URL in .env.local and run `npx prisma migrate deploy` to view stored leads."
            : "Unable to query database. Verify DATABASE_URL and ensure migrations have been applied."}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/leads"
              className={[
                "rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                !statusFilter
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100",
              ].join(" ")}
            >
              All
            </Link>
            {LEAD_STATUSES.map((st) => (
              <Link
                key={st}
                href={`/admin/leads?status=${st}`}
                className={[
                  "rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                  statusFilter === st
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100",
                ].join(" ")}
              >
                {st}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Leads Table */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xs lg:col-span-7">
              {leads.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  No leads found for this filter yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3.5">Lead</th>
                        <th className="px-4 py-3.5">Type</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5">WhatsApp</th>
                        <th className="px-4 py-3.5">Created (MYT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.map((lead) => {
                        const waDigits = lead.whatsappNumber.replace(/\D/g, "");
                        const isSelected = selectedLead?.id === lead.id;
                        const detailHref = `/admin/leads?${statusFilter ? `status=${statusFilter}&` : ""}id=${lead.id}`;

                        return (
                          <tr
                            key={lead.id}
                            className={
                              isSelected ? "bg-indigo-50/60" : "hover:bg-slate-50"
                            }
                          >
                            <td className="px-4 py-3.5">
                              <Link
                                href={detailHref}
                                className="font-bold text-slate-900 hover:text-indigo-600"
                              >
                                {lead.name}
                              </Link>
                              {lead.companyName && (
                                <p className="text-xs text-slate-500">
                                  {lead.companyName}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-xs font-semibold text-slate-700">
                              {lead.requestType}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusBadgeClass(lead.status)}`}
                              >
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <a
                                href={`https://wa.me/${waDigits}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                              >
                                <span>{lead.whatsappNumber}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                              {formatInTimeZone(
                                lead.createdAt,
                                tz,
                                "yyyy-MM-dd HH:mm"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Lead Detail & Full Conversation Transcript */}
            <div className="space-y-6 lg:col-span-5">
              {selectedLead ? (
                <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {selectedLead.name}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {selectedLead.companyName || "No company specified"} ·{" "}
                        {selectedLead.requestType}
                      </p>
                    </div>

                    <form
                      action={updateLeadStatusAction}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="hidden"
                        name="leadId"
                        value={selectedLead.id}
                      />
                      <select
                        name="status"
                        defaultValue={selectedLead.status}
                        aria-label="Lead status"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:outline-none"
                      >
                        {LEAD_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="cursor-pointer rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                      >
                        Save
                      </button>
                    </form>
                  </div>

                  {/* Metadata Grid */}
                  <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-slate-400">WhatsApp</dt>
                      <dd className="mt-0.5 font-semibold text-emerald-700">
                        <a
                          href={`https://wa.me/${selectedLead.whatsappNumber.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{selectedLead.whatsappNumber}</span>
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-400">Email</dt>
                      <dd className="mt-0.5 text-slate-800">
                        {selectedLead.email || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-400">
                        Project Type
                      </dt>
                      <dd className="mt-0.5 text-slate-800">
                        {selectedLead.projectType || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-400">
                        Indicative Budget
                      </dt>
                      <dd className="mt-0.5 text-slate-800">
                        {selectedLead.budgetRange || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-400">
                        Expected Start
                      </dt>
                      <dd className="mt-0.5 text-slate-800">
                        {selectedLead.expectedStart || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-400">
                        Existing System
                      </dt>
                      <dd className="mt-0.5 text-slate-800">
                        {selectedLead.existingSystem || "—"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-slate-400">
                        Project Description
                      </dt>
                      <dd className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-slate-800">
                        {selectedLead.projectDescription || "—"}
                      </dd>
                    </div>
                    {selectedLead.requirements && (
                      <div className="sm:col-span-2">
                        <dt className="font-semibold text-slate-400">
                          Additional Requirements
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-slate-800">
                          {selectedLead.requirements}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {/* Full Conversation Transcript */}
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Conversation Transcript
                    </h3>
                    {selectedLead.conversations.length === 0 ? (
                      <p className="text-xs text-slate-400">
                        No linked conversation messages.
                      </p>
                    ) : (
                      <div className="max-h-96 space-y-2.5 overflow-y-auto rounded-2xl bg-slate-50 p-3.5">
                        {selectedLead.conversations.flatMap((conv) =>
                          conv.messages.map((m) => (
                            <div
                              key={m.id}
                              className={[
                                "rounded-2xl px-3.5 py-2.5 text-xs",
                                m.role === "user"
                                  ? "ms-6 bg-indigo-600 text-white"
                                  : "me-6 border border-slate-200 bg-white text-slate-800",
                              ].join(" ")}
                            >
                              <div className="mb-1 flex items-center justify-between gap-2 text-[10px] opacity-70">
                                <span className="font-bold uppercase">
                                  {m.role}
                                </span>
                                <span>
                                  {formatInTimeZone(
                                    m.createdAt,
                                    tz,
                                    "HH:mm:ss"
                                  )}
                                </span>
                              </div>
                              <p
                                dir="auto"
                                className="whitespace-pre-wrap leading-relaxed"
                              >
                                {m.content}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right-to-Erasure Delete Action */}
                  <div className="border-t border-slate-100 pt-4">
                    <form action={deleteLeadAdminAction}>
                      <input
                        type="hidden"
                        name="leadId"
                        value={selectedLead.id}
                      />
                      <button
                        type="submit"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Lead & Personal Data</span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                  Select a lead from the table to view details and full chat
                  transcript.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
