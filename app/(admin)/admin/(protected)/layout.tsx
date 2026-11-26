import React from "react";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { getCachedWidgetPauseState } from "@/lib/admin/cache";
import { AdminFrame } from "@/components/admin/admin-frame";

export const dynamic = "force-dynamic";

/**
 * Protected admin layout shared by `/admin/leads`, `/admin/bookings`,
 * `/admin/availability`, `/admin/invoices`, and `/admin/settings/company`.
 * Enforces `requireAdminSession()` before reading any cached state or rendering
 * the authenticated shell or child `loading.tsx` skeletons.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();
  const widgetState = await getCachedWidgetPauseState();

  return <AdminFrame widgetState={widgetState}>{children}</AdminFrame>;
}
