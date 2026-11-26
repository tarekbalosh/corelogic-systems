import React from "react";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { getWidgetRuntimePauseState } from "@/lib/agent/runtime-flags";
import { AdminFrame } from "@/components/admin/admin-frame";

export const dynamic = "force-dynamic";

/**
 * Protected admin layout shared by `/admin/leads`, `/admin/bookings`,
 * `/admin/availability`, and future sections like `/admin/invoices`.
 * Enforces `requireAdminSession()` before reading any runtime flag or rendering
 * the authenticated shell or child `loading.tsx` skeletons.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();
  const widgetState = await getWidgetRuntimePauseState();

  return <AdminFrame widgetState={widgetState}>{children}</AdminFrame>;
}
