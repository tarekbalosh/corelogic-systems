import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_CACHE_TAGS, invalidateAdminTags } from "@/lib/admin/cache";
import {
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import { generateInvoicePdf } from "@/lib/invoicing/pdf";
import { issueInvoice } from "@/lib/invoicing/service";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApiRequest(request, { mutate: true });
  if (guard instanceof NextResponse) return guard;

  try {
    const { id } = await context.params;
    let issueDateOverride: string | undefined;
    try {
      const body = (await request.json()) as { issueDate?: string };
      if (body?.issueDate && /^\d{4}-\d{2}-\d{2}$/.test(body.issueDate)) {
        issueDateOverride = body.issueDate;
      }
    } catch {
      // Optional JSON body
    }

    const invoice = await issueInvoice(id, {
      renderPdf: generateInvoicePdf,
      actor: guard.actor,
      issueDateOverride,
    });
    invalidateAdminTags(ADMIN_CACHE_TAGS.INVOICES);
    return adminJsonResponse({ invoice });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
