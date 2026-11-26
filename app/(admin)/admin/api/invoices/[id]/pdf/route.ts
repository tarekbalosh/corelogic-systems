import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  ADMIN_CACHE_TAGS,
  getCachedCompanySettings,
  invalidateAdminTags,
} from "@/lib/admin/cache";
import {
  ADMIN_API_HEADERS,
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import { generateInvoicePdf } from "@/lib/invoicing/pdf";
import {
  buildPdfDocumentDataFromInvoice,
  recordPdfDownloadAudit,
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
    const isDownload = request.nextUrl.searchParams.get("download") === "1";

    // Fast path for issued PDFs: fetch ONLY status, type, invoiceNumber, pdfBytes, pdfSha256 (1 single lean query!)
    const baseInvoice = await prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        invoiceNumber: true,
        type: true,
        status: true,
        pdfBytes: true,
        pdfSha256: true,
      },
    });

    if (!baseInvoice) {
      return adminJsonResponse({ error: "Rechnung nicht gefunden." }, 404);
    }

    let pdfBuffer: Uint8Array;
    if (
      baseInvoice.status !== "DRAFT" &&
      baseInvoice.pdfBytes &&
      baseInvoice.pdfBytes.length > 0
    ) {
      // GoBD: always serve the exact archived immutable PDF bytes immediately (0 extra joins!)
      pdfBuffer = new Uint8Array(baseInvoice.pdfBytes);
    } else {
      const [fullInvoice, liveCompany] = await Promise.all([
        prisma.invoice.findUnique({
          where: { id },
          include: {
            customer: true,
            items: { orderBy: { position: "asc" } },
            correctedInvoice: { select: { invoiceNumber: true } },
          },
        }),
        getCachedCompanySettings(),
      ]);
      if (!fullInvoice) {
        return adminJsonResponse({ error: "Rechnung nicht gefunden." }, 404);
      }
      const docData = buildPdfDocumentDataFromInvoice({
        invoice: fullInvoice,
        liveCompany,
      });
      pdfBuffer = await generateInvoicePdf(docData);
    }

    if (baseInvoice.status !== "DRAFT" && isDownload) {
      // Log audit event and invalidate detail cache so audit timeline stays fresh
      await recordPdfDownloadAudit(baseInvoice.id, guard.actor).catch(
        () => undefined
      );
      invalidateAdminTags(ADMIN_CACHE_TAGS.INVOICES);
    }

    const filenameBase = baseInvoice.invoiceNumber
      ? `${baseInvoice.type === "CANCELLATION" ? "Stornorechnung" : "Rechnung"}_${baseInvoice.invoiceNumber}`
      : `Entwurf_${baseInvoice.id.slice(-8)}`;
    const safeFilename = filenameBase.replace(/[^A-Za-z0-9._-]/g, "_") + ".pdf";

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        ...ADMIN_API_HEADERS,
        "Content-Type": "application/pdf",
        "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="${safeFilename}"`,
        ...(baseInvoice.pdfSha256
          ? { "X-Content-SHA256": baseInvoice.pdfSha256 }
          : {}),
      },
    });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
