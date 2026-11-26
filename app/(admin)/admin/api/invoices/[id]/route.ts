import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import {
  deleteInvoiceDraft,
  getInvoiceDetail,
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
    const invoice = await getInvoiceDetail(id);
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
    return adminJsonResponse({ ok: true });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
