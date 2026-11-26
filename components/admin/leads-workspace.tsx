"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import type { LeadStatus } from "@prisma/client";
import {
  ArrowDownUp,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Inbox,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquareText,
  PhoneCall,
  ReceiptText,
  Search,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import {
  deleteLeadAdminAction,
  updateLeadStatusAction,
} from "@/lib/admin/actions";
import { adminApiJson, InvoicingApiClientError } from "@/components/admin/invoicing/api-client";
import type { SerializedBillingCustomer } from "@/lib/invoicing/types";
import { cn } from "@/lib/utils";
import {
  ConfirmDialog,
  DataTable,
  Drawer,
  EmptyState,
  StatCard,
  StatusBadge,
  useToast,
  type DataTableColumn,
} from "@/components/admin/ui";

const LEAD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED"];

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  CLOSED: "Closed",
};

export interface SerializedLeadRow {
  id: string;
  name: string;
  companyName: string | null;
  requestType: string;
  status: LeadStatus;
  whatsappNumber: string;
  email: string | null;
  createdAtIso: string;
  createdAtMyt: string;
}

export interface SerializedChatMessage {
  id: string;
  role: string;
  content: string;
  timeMyt: string;
  dateMyt: string;
}

export interface SerializedLeadDetail {
  id: string;
  name: string;
  companyName: string | null;
  requestType: string;
  status: LeadStatus;
  whatsappNumber: string;
  email: string | null;
  projectType: string | null;
  budgetRange: string | null;
  expectedStart: string | null;
  existingSystem: string | null;
  projectDescription: string | null;
  requirements: string | null;
  createdAtMyt: string;
  messages: SerializedChatMessage[];
}

interface LeadsWorkspaceProps {
  leads: SerializedLeadRow[];
  selectedLead: SerializedLeadDetail | null;
  initialStatus: LeadStatus | "ALL";
  hasExplicitSelection: boolean;
}

function isNextRedirectError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest?: unknown }).digest === "string" &&
    ((err as { digest: string }).digest.startsWith("NEXT_REDIRECT") ||
      (err as { digest: string }).digest.startsWith("NEXT_NOT_FOUND"))
  );
}

function LeadDetailContent({
  lead,
  loadingDetail,
}: {
  lead: SerializedLeadDetail;
  loadingDetail: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [statusDraft, setStatusDraft] = useState<LeadStatus>(lead.status);
  const [savingStatus, startSaveTransition] = useTransition();
  const [deleting, startDeleteTransition] = useTransition();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Start chat transcript scrolled to the latest message whenever the selected lead changes.
  useEffect(() => {
    const el = transcriptContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lead.id, lead.messages.length]);

  const waDigits = lead.whatsappNumber.replace(/\D/g, "");

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    startSaveTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("leadId", lead.id);
        fd.set("status", statusDraft);
        await updateLeadStatusAction(fd);
        router.refresh();
        toast.success(
          "Lead status updated",
          `${lead.name} is now marked as ${STATUS_LABELS[statusDraft]}.`
        );
      } catch (err) {
        if (isNextRedirectError(err)) throw err;
        toast.error(
          "Failed to update lead status",
          "Please try again in a moment."
        );
      }
    });
  };

  const handleCreateBillingCustomer = async () => {
    setCreatingCustomer(true);
    try {
      const res = await adminApiJson<{
        customer: SerializedBillingCustomer;
        alreadyExisted: boolean;
      }>("/admin/api/customers/from-source", {
        method: "POST",
        body: { leadId: lead.id },
      });
      toast.success(
        res.alreadyExisted
          ? "Billing customer found"
          : "Billing customer created",
        "Complete the customer's postal address in the invoice editor before issuing."
      );
      router.push(`/admin/invoices/new?customerId=${res.customer.id}`);
    } catch (err) {
      const msg =
        err instanceof InvoicingApiClientError
          ? err.message
          : "Could not create billing customer.";
      toast.error("Billing customer error", msg);
    } finally {
      setCreatingCustomer(false);
    }
  };

  const handleConfirmDelete = () => {
    startDeleteTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("leadId", lead.id);
        const result = await deleteLeadAdminAction(fd);
        setConfirmDeleteOpen(false);
        if (result && !result.ok) {
          toast.error(
            result.blockedByInvoices
              ? "Deletion blocked (GoBD tax retention)"
              : "Could not delete lead",
            result.message || "Issued invoices prevent lead deletion."
          );
          return;
        }
        toast.success(
          "Lead deleted",
          "The lead and associated personal data were permanently removed."
        );
      } catch (err) {
        if (isNextRedirectError(err)) {
          setConfirmDeleteOpen(false);
          toast.success(
            "Lead deleted",
            "The lead and associated personal data were permanently removed."
          );
          throw err;
        }
        toast.error(
          "Could not delete lead",
          "Please try again or verify database connectivity."
        );
      }
    });
  };

  const handleCopyText = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(key);
      toast.info("Copied to clipboard", label);
      setTimeout(() => {
        setCopiedId((prev) => (prev === key ? null : prev));
      }, 1800);
    } catch {
      toast.error("Copy failed", "Clipboard permission was denied.");
    }
  };

  const handleCopyFullTranscript = () => {
    const formatted = lead.messages
      .map((m) => `[${m.dateMyt} ${m.timeMyt} MYT] ${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");
    void handleCopyText(formatted, "full-transcript", "Full conversation transcript copied.");
  };

  if (loadingDetail) {
    return (
      <div
        role="status"
        aria-label="Loading lead details"
        className="space-y-5 p-1"
      >
        <div className="h-7 w-40 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Status Editor */}
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate font-heading text-lg font-bold text-slate-900">
              {lead.name}
            </h2>
            <StatusBadge status={lead.status} />
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {lead.companyName || "No company specified"} · {lead.requestType}
          </p>
        </div>

        <form
          onSubmit={handleSaveStatus}
          className="flex shrink-0 items-center gap-2"
        >
          <select
            name="status"
            value={statusDraft}
            onChange={(e) => setStatusDraft(e.target.value as LeadStatus)}
            aria-label="Lead status"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {LEAD_STATUSES.map((st) => (
              <option key={st} value={st}>
                {STATUS_LABELS[st]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={savingStatus || statusDraft === lead.status}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingStatus && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Save</span>
          </button>
        </form>
      </div>

      {/* Section 1: Client Information */}
      <section aria-labelledby="client-info-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3
            id="client-info-heading"
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Client Information</span>
          </h3>
          <button
            type="button"
            disabled={creatingCustomer}
            onClick={handleCreateBillingCustomer}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:opacity-60"
          >
            {creatingCustomer ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ReceiptText className="h-3 w-3" />
            )}
            <span>Create Invoice / Billing Customer</span>
          </button>
        </div>
        <dl className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-400">WhatsApp</dt>
            <dd className="mt-1 flex items-center gap-2">
              <a
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                <span dir="ltr">{lead.whatsappNumber}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
              <button
                type="button"
                onClick={() =>
                  void handleCopyText(
                    lead.whatsappNumber,
                    "phone",
                    "Phone number copied."
                  )
                }
                aria-label="Copy WhatsApp number"
                className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {copiedId === "phone" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-slate-400">Email</dt>
            <dd className="mt-1 font-medium text-slate-800 break-all">
              {lead.email ? (
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-1.5 text-slate-800 hover:text-indigo-600 hover:underline"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span>{lead.email}</span>
                </a>
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-slate-400">Request Type</dt>
            <dd className="mt-1 font-semibold text-slate-800">
              {lead.requestType}
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-slate-400">Captured (MYT)</dt>
            <dd className="mt-1 flex items-center gap-1.5 font-medium text-slate-700">
              <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{lead.createdAtMyt} MYT</span>
            </dd>
          </div>
        </dl>
      </section>

      {/* Section 2: Project Details */}
      <section aria-labelledby="project-details-heading" className="space-y-3">
        <h3
          id="project-details-heading"
          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400"
        >
          <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Project Details</span>
        </h3>
        <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <dt className="font-semibold text-slate-400">Project Type</dt>
            <dd className="mt-1 font-semibold text-slate-800">
              {lead.projectType || "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <dt className="font-semibold text-slate-400">Indicative Budget</dt>
            <dd className="mt-1 font-semibold text-slate-800">
              {lead.budgetRange || "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <dt className="font-semibold text-slate-400">Expected Start</dt>
            <dd className="mt-1 font-semibold text-slate-800">
              {lead.expectedStart || "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <dt className="font-semibold text-slate-400">Existing System</dt>
            <dd className="mt-1 font-semibold text-slate-800">
              {lead.existingSystem || "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 sm:col-span-2">
            <dt className="font-semibold text-slate-400">
              Project Description
            </dt>
            <dd
              dir="auto"
              className="mt-1.5 whitespace-pre-wrap leading-relaxed text-slate-800"
            >
              {lead.projectDescription || "—"}
            </dd>
          </div>
          {lead.requirements && (
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 sm:col-span-2">
              <dt className="font-semibold text-slate-400">
                Additional Requirements
              </dt>
              <dd
                dir="auto"
                className="mt-1.5 whitespace-pre-wrap leading-relaxed text-slate-800"
              >
                {lead.requirements}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Section 3: Conversation Transcript */}
      <section aria-labelledby="transcript-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3
            id="transcript-heading"
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              Conversation Transcript ({lead.messages.length})
            </span>
          </h3>

          {lead.messages.length > 0 && (
            <button
              type="button"
              onClick={handleCopyFullTranscript}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {copiedId === "full-transcript" ? (
                <Check className="h-3 w-3 text-emerald-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span>Copy all</span>
            </button>
          )}
        </div>

        {lead.messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-xs text-slate-400">
            No linked conversation messages for this lead.
          </div>
        ) : (
          <div
            ref={transcriptContainerRef}
            className="max-h-[440px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4"
          >
            {lead.messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={cn(
                    "group flex flex-col",
                    isUser ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "relative max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs",
                      isUser
                        ? "rounded-br-md bg-indigo-600 text-white"
                        : "rounded-bl-md border border-slate-200/90 bg-white text-slate-800"
                    )}
                  >
                    <div
                      className={cn(
                        "mb-1 flex items-center justify-between gap-3 text-[10px]",
                        isUser ? "text-indigo-100" : "text-slate-400"
                      )}
                    >
                      <span className="font-bold uppercase tracking-wide">
                        {isUser ? "Visitor" : "AI Assistant"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="tabular-nums">
                          {m.dateMyt} · {m.timeMyt} MYT
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            void handleCopyText(
                              m.content,
                              m.id,
                              "Message copied."
                            )
                          }
                          aria-label="Copy message"
                          className={cn(
                            "cursor-pointer rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2",
                            isUser
                              ? "text-indigo-100 hover:bg-white/15 focus-visible:ring-white"
                              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-indigo-500"
                          )}
                        >
                          {copiedId === m.id ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p
                      dir="auto"
                      className="whitespace-pre-wrap break-words leading-relaxed"
                    >
                      {m.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Danger Zone */}
      <section
        aria-labelledby="danger-zone-heading"
        className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <h3
              id="danger-zone-heading"
              className="text-xs font-bold uppercase tracking-wider text-rose-700"
            >
              Danger Zone
            </h3>
            <p className="text-xs text-rose-700/80">
              Permanently erase this lead, linked chat transcripts, and
              consultation bookings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmDeleteOpen(true)}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-white px-3.5 py-2 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Lead & Personal Data</span>
          </button>
        </div>
      </section>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        variant="danger"
        title={`Delete ${lead.name} permanently?`}
        description="This action cannot be undone. All personal information, linked conversation transcripts, and consultation bookings for this lead will be permanently removed from the database."
        confirmLabel="Yes, delete permanently"
        cancelLabel="Cancel"
      />
    </div>
  );
}

export function LeadsWorkspace({
  leads,
  selectedLead,
  initialStatus,
  hasExplicitSelection,
}: LeadsWorkspaceProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">(
    initialStatus
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(
    hasExplicitSelection
  );
  const [loadingDetail, startSelectTransition] = useTransition();

  // Compute exact counts strictly from actual database leads.
  const counts = useMemo(() => {
    const map: Record<LeadStatus, number> = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      CLOSED: 0,
    };
    for (const l of leads) {
      map[l.status] += 1;
    }
    return {
      total: leads.length,
      ...map,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = leads.filter((lead) => {
      if (statusFilter !== "ALL" && lead.status !== statusFilter) return false;
      if (!q) return true;
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.whatsappNumber.toLowerCase().includes(q) ||
        (lead.companyName?.toLowerCase().includes(q) ?? false) ||
        (lead.email?.toLowerCase().includes(q) ?? false)
      );
    });

    return [...list].sort((a, b) => {
      const diff =
        new Date(a.createdAtIso).getTime() - new Date(b.createdAtIso).getTime();
      return sortOrder === "desc" ? -diff : diff;
    });
  }, [leads, statusFilter, searchQuery, sortOrder]);

  const handleSelectLead = (row: SerializedLeadRow) => {
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    params.set("id", row.id);
    setMobileDrawerOpen(true);
    startSelectTransition(() => {
      router.replace(`/admin/leads?${params.toString()}`, { scroll: false });
    });
  };

  const resetFilters = () => {
    setStatusFilter("ALL");
    setSearchQuery("");
    setSortOrder("desc");
  };

  const columns: Array<DataTableColumn<SerializedLeadRow>> = [
    {
      key: "lead",
      header: "Lead",
      render: (lead) => (
        <div className="min-w-[140px]">
          <p className="font-bold text-slate-900">{lead.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {lead.companyName || lead.requestType}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cellClassName: "hidden sm:table-cell",
      headerClassName: "hidden sm:table-cell",
      render: (lead) => (
        <span className="inline-flex rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
          {lead.requestType}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (lead) => <StatusBadge status={lead.status} />,
    },
    {
      key: "whatsapp",
      header: "WhatsApp",
      render: (lead) => {
        const waDigits = lead.whatsappNumber.replace(/\D/g, "");
        return (
          <a
            href={`https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-emerald-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            <span dir="ltr">{lead.whatsappNumber}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        );
      },
    },
    {
      key: "created",
      header: "Created (MYT)",
      cellClassName: "whitespace-nowrap text-xs text-slate-500 tabular-nums",
      render: (lead) => lead.createdAtMyt,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Stat Cards (derived solely from real DB records) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Total Leads"
          value={counts.total}
          tone="slate"
          active={statusFilter === "ALL"}
          onClick={() => setStatusFilter("ALL")}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="New"
          value={counts.NEW}
          tone="indigo"
          active={statusFilter === "NEW"}
          onClick={() => setStatusFilter("NEW")}
          icon={<Sparkles className="h-5 w-5" />}
        />
        <StatCard
          label="Contacted"
          value={counts.CONTACTED}
          tone="sky"
          active={statusFilter === "CONTACTED"}
          onClick={() => setStatusFilter("CONTACTED")}
          icon={<PhoneCall className="h-5 w-5" />}
        />
        <StatCard
          label="Qualified"
          value={counts.QUALIFIED}
          tone="emerald"
          active={statusFilter === "QUALIFIED"}
          onClick={() => setStatusFilter("QUALIFIED")}
          icon={<UserCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Closed"
          value={counts.CLOSED}
          tone="slate"
          active={statusFilter === "CLOSED"}
          onClick={() => setStatusFilter("CLOSED")}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      {/* Toolbar: Search + Status Filter Pills + Date Sort */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 md:max-w-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, or phone…"
              aria-label="Search leads by name, company, or phone"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-9 pl-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort Button */}
          <button
            type="button"
            onClick={() =>
              setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <ArrowDownUp className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Date: {sortOrder === "desc" ? "Newest first" : "Oldest first"}
            </span>
          </button>
        </div>

        {/* Status Filter Tabs with Counts */}
        <div
          role="group"
          aria-label="Filter leads by status"
          className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3"
        >
          {(["ALL", ...LEAD_STATUSES] as const).map((st) => {
            const active = statusFilter === st;
            const count = st === "ALL" ? counts.total : counts[st];
            const label = st === "ALL" ? "All" : STATUS_LABELS[st];
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                aria-pressed={active}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  active
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                )}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Workspace: Table (7 cols) + Sticky Detail Panel (5 cols on lg+) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <DataTable
            caption="Captured leads list"
            columns={columns}
            data={filteredLeads}
            rowKey={(row) => row.id}
            selectedRowKey={selectedLead?.id ?? null}
            onRowClick={handleSelectLead}
            emptyState={
              <EmptyState
                icon={<Inbox className="h-5 w-5" />}
                title={
                  leads.length === 0
                    ? "No leads captured yet"
                    : "No leads match your filters"
                }
                description={
                  leads.length === 0
                    ? "New inquiries submitted through the AI assistant will appear here automatically."
                    : "Try adjusting your search query or switching to a different status filter."
                }
                action={
                  leads.length > 0 ? (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      Clear filters
                    </button>
                  ) : undefined
                }
              />
            }
          />
        </div>

        {/* Desktop Sticky Detail Panel */}
        <div className="hidden lg:sticky lg:top-24 lg:col-span-5 lg:block">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            {selectedLead ? (
              <LeadDetailContent
                key={`${selectedLead.id}-${selectedLead.status}`}
                lead={selectedLead}
                loadingDetail={loadingDetail}
              />
            ) : (
              <EmptyState
                icon={<MessageSquareText className="h-5 w-5" />}
                title="Select a lead"
                description="Choose any row from the leads table to inspect contact details, project scope, and full chat transcript."
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Slide-over Detail Drawer */}
      <div className="lg:hidden">
        <Drawer
          open={mobileDrawerOpen && Boolean(selectedLead)}
          onClose={() => setMobileDrawerOpen(false)}
          title={selectedLead?.name ?? "Lead details"}
          subtitle={
            selectedLead
              ? `${selectedLead.companyName || "No company"} · ${selectedLead.requestType}`
              : undefined
          }
          side="right"
          widthClass="w-full sm:max-w-lg"
        >
          {selectedLead && (
            <LeadDetailContent
              key={`${selectedLead.id}-${selectedLead.status}`}
              lead={selectedLead}
              loadingDetail={loadingDetail}
            />
          )}
        </Drawer>
      </div>
    </div>
  );
}
