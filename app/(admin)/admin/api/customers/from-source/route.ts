import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import { createBillingCustomerFromSource } from "@/lib/invoicing/service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const guard = await requireAdminApiRequest(request, { mutate: true });
  if (guard instanceof NextResponse) return guard;

  try {
    const body = (await request.json()) as {
      leadId?: string;
      bookingId?: string;
    };
    const result = await createBillingCustomerFromSource({
      leadId: body.leadId,
      bookingId: body.bookingId,
    });
    return adminJsonResponse(result, result.alreadyExisted ? 200 : 201);
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
