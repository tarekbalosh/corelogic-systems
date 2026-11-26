import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import { generateInvoicePdf } from "@/lib/invoicing/pdf";
import { createStornoInvoice } from "@/lib/invoicing/service";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApiRequest(request, { mutate: true });
  if (guard instanceof NextResponse) return guard;

  try {
    const { id } = await context.params;
    let reason: string | undefined;
    try {
      const body = (await request.json()) as { reason?: string };
      reason = body?.reason;
    } catch {
      // Optional JSON body
    }

    const result = await createStornoInvoice(id, {
      renderPdf: generateInvoicePdf,
      reason,
      actor: guard.actor,
    });
    return adminJsonResponse(result, 201);
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
