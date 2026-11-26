import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_CACHE_TAGS, invalidateAdminTags } from "@/lib/admin/cache";
import {
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import { recordInvoicePayment } from "@/lib/invoicing/service";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApiRequest(request, { mutate: true });
  if (guard instanceof NextResponse) return guard;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const invoice = await recordInvoicePayment(id, body, guard.actor);
    invalidateAdminTags(ADMIN_CACHE_TAGS.INVOICES);
    return adminJsonResponse({ invoice }, 201);
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
