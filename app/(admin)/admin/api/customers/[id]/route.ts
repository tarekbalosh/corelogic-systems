import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import { updateBillingCustomer } from "@/lib/invoicing/service";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApiRequest(request, { mutate: true });
  if (guard instanceof NextResponse) return guard;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const customer = await updateBillingCustomer(id, body);
    return adminJsonResponse({ customer });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
