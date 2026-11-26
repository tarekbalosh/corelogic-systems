import { NextResponse } from "next/server";
import { ADMIN_API_HEADERS } from "./api-auth";
import { InvoicingError } from "./service";

export function handleInvoicingApiError(err: unknown): NextResponse {
  if (err instanceof InvoicingError) {
    return NextResponse.json(
      {
        error: err.message,
        code: err.code,
        issues: err.issues ?? undefined,
      },
      { status: err.statusCode, headers: ADMIN_API_HEADERS }
    );
  }

  // Handle Prisma unique constraint violation gracefully (P2002)
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "P2002"
  ) {
    return NextResponse.json(
      {
        error: "Eintrag existiert bereits (eindeutige Kennung doppelt vergeben).",
        code: "DUPLICATE_ENTRY",
      },
      { status: 409, headers: ADMIN_API_HEADERS }
    );
  }

  return NextResponse.json(
    {
      error: "Interner Serverfehler bei der Verarbeitung der Anfrage.",
      code: "INTERNAL_ERROR",
    },
    { status: 500, headers: ADMIN_API_HEADERS }
  );
}
