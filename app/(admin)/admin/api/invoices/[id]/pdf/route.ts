import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  ADMIN_API_HEADERS,
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import { generateInvoicePdf } from "@/lib/invoicing/pdf";
import {
  buildPdfDocumentDataFromInvoice,
  getOrInitCompanySettings,
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

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { orderBy: { position: "asc" } },
        correctedInvoice: { select: { invoiceNumber: true } },
      },
    });

    if (!invoice) {
      return adminJsonResponse({ error: "Rechnung nicht gefunden." }, 404);
    }

    let pdfBuffer: Uint8Array;
    if (invoice.status !== "DRAFT" && invoice.pdfBytes && invoice.pdfBytes.length > 0) {
      // GoBD: always serve the exact archived immutable PDF bytes
      pdfBuffer = new Uint8Array(invoice.pdfBytes);
    } else {
      const liveCompany = await getOrInitCompanySettings();
      const docData = buildPdfDocumentDataFromInvoice({
        invoice,
        liveCompany,
      });
      pdfBuffer = await generateInvoicePdf(docData);
    }

    if (invoice.status !== "DRAFT" && isDownload) {
      await recordPdfDownloadAudit(invoice.id, guard.actor).catch(() => undefined);
    }

    const filenameBase = invoice.invoiceNumber
      ? `${invoice.type === "CANCELLATION" ? "Stornorechnung" : "Rechnung"}_${invoice.invoiceNumber}`
      : `Entwurf_${invoice.id.slice(-8)}`;
    const safeFilename = filenameBase.replace(/[^A-Za-z0-9._-]/g, "_") + ".pdf";

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        ...ADMIN_API_HEADERS,
        "Content-Type": "application/pdf",
        "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="${safeFilename}"`,
        ...(invoice.pdfSha256 ? { "X-Content-SHA256": invoice.pdfSha256 } : {}),
      },
    });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
