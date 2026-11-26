export type AdminNavIconName =
  | "users"
  | "calendar-clock"
  | "sliders"
  | "receipt-text"
  | "building-2";

export type AdminNavItemStatus = "active" | "soon" | "hidden";

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon: AdminNavIconName;
  status: AdminNavItemStatus;
  badge?: string;
  /** Topbar page heading shown when this section is active. */
  pageTitle: string;
  /** Topbar short description shown under the page heading. */
  pageDescription: string;
}

/**
 * Simple feature flags for upcoming admin sections.
 * To enable Invoices later:
 * 1) Create `app/(admin)/admin/invoices/page.tsx`
 * 2) Change the `invoices` entry below from `status: ADMIN_NAV_FLAGS.showInvoicesPlaceholder ? "soon" : "hidden"`
 *    to `status: "active"` (and remove `badge`).
 */
export const ADMIN_NAV_FLAGS = {
  showInvoicesPlaceholder: true,
} as const;

/**
 * Single source of truth for all Admin Console sidebar items and topbar headers.
 * Adding a new admin section only requires adding one object here.
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: "leads",
    label: "Leads",
    href: "/admin/leads",
    icon: "users",
    status: "active",
    pageTitle: "Captured Leads & Conversations",
    pageDescription:
      "Review captured leads, inspect full chat transcripts, and update follow-up status.",
  },
  {
    id: "bookings",
    label: "Bookings",
    href: "/admin/bookings",
    icon: "calendar-clock",
    status: "active",
    pageTitle: "Consultation Bookings",
    pageDescription:
      "Confirm or reject pending consultation requests in Asia/Kuala_Lumpur (MYT).",
  },
  {
    id: "availability",
    label: "Availability",
    href: "/admin/availability",
    icon: "sliders",
    status: "active",
    pageTitle: "Consultation Schedule & Blocked Dates",
    pageDescription:
      "Manage weekly recurring consultation windows and holiday closures (MYT).",
  },
  {
    id: "invoices",
    label: "Invoices",
    href: "/admin/invoices",
    icon: "receipt-text",
    status: "active",
    pageTitle: "Invoices (Rechnungen)",
    pageDescription:
      "Create, preview, issue, and track GoBD-compliant German EUR invoices.",
  },
  {
    id: "company-settings",
    label: "Company Settings",
    href: "/admin/settings/company",
    icon: "building-2",
    status: "active",
    pageTitle: "Settings · Company",
    pageDescription:
      "Single source of truth for legal entity, Handelsregister (§ 35a GmbHG), tax IDs, and SEPA bank details.",
  },
];

export function resolveAdminNavItem(pathname: string): AdminNavItem {
  const match = ADMIN_NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  return match ?? ADMIN_NAV_ITEMS[0];
}
