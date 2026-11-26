import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ADMIN_CACHE_TAGS,
  getCachedInvoiceDetail,
  invalidateAdminTags,
} from "@/lib/admin/cache";
import {
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import {
  deleteInvoiceDraft,
  updateInvoiceDraft,
} from "@/lib/invoicing/service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApiRequest(request, { mutate: false });
  if (guard instanceof NextResponse) return guard;

  try {
    const { id } = await context.params;
    const invoice = await getCachedInvoiceDetail(id);
    if (!invoice) {
      return adminJsonResponse({ error: "Rechnung nicht gefunden." }, 404);
    }
    return adminJsonResponse({ invoice });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApiRequest(request, { mutate: true });
  if (guard instanceof NextResponse) return guard;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const invoice = await updateInvoiceDraft(id, body, guard.actor);
    invalidateAdminTags(ADMIN_CACHE_TAGS.INVOICES);
    return adminJsonResponse({ invoice });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApiRequest(request, { mutate: true });
  if (guard instanceof NextResponse) return guard;

  try {
    const { id } = await context.params;
    await deleteInvoiceDraft(id);
    invalidateAdminTags(ADMIN_CACHE_TAGS.INVOICES, ADMIN_CACHE_TAGS.CUSTOMERS);
    return adminJsonResponse({ ok: true });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
