import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ADMIN_CACHE_TAGS,
  getCachedBillingCustomers,
  invalidateAdminTags,
} from "@/lib/admin/cache";
import {
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import { createBillingCustomer } from "@/lib/invoicing/service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const guard = await requireAdminApiRequest(request, { mutate: false });
  if (guard instanceof NextResponse) return guard;

  try {
    const customers = await getCachedBillingCustomers();
    return adminJsonResponse({ customers });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdminApiRequest(request, { mutate: true });
  if (guard instanceof NextResponse) return guard;

  try {
    const body = await request.json();
    const customer = await createBillingCustomer(body);
    invalidateAdminTags(ADMIN_CACHE_TAGS.CUSTOMERS);
    return adminJsonResponse({ customer }, 201);
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
