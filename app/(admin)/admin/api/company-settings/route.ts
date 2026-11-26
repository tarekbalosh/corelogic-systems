import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ADMIN_CACHE_TAGS,
  getCachedCompanySettings,
  invalidateAdminTags,
} from "@/lib/admin/cache";
import {
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import { updateCompanySettings } from "@/lib/invoicing/service";
import { validateCompanySettingsForIssuance } from "@/lib/invoicing/validators";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const guard = await requireAdminApiRequest(request, { mutate: false });
  if (guard instanceof NextResponse) return guard;

  try {
    const settings = await getCachedCompanySettings();
    const missingForIssuance = validateCompanySettingsForIssuance(settings);
    return adminJsonResponse({ settings, missingForIssuance });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}

export async function PUT(request: NextRequest) {
  const guard = await requireAdminApiRequest(request, { mutate: true });
  if (guard instanceof NextResponse) return guard;

  try {
    const body = await request.json();
    const settings = await updateCompanySettings(body);
    invalidateAdminTags(ADMIN_CACHE_TAGS.COMPANY_SETTINGS);
    const missingForIssuance = validateCompanySettingsForIssuance(settings);
    return adminJsonResponse({ settings, missingForIssuance });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
