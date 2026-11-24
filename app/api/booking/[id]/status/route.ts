import type { NextRequest } from "next/server";
import { getSessionAuthorizedBookingStatus } from "@/lib/booking/status-query";
import { API_SECURITY_HEADERS, isSameOriginRequest } from "@/lib/security/http";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOriginRequest(request)) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403, headers: { ...API_SECURITY_HEADERS, Vary: "Origin" } }
    );
  }

  const { id } = await params;
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  const result = await getSessionAuthorizedBookingStatus(id, sessionId);
  if (!result) {
    return Response.json(
      { error: "Not found" },
      {
        status: 404,
        headers: { ...API_SECURITY_HEADERS, "Cache-Control": "no-store" },
      }
    );
  }

  return Response.json(
    { status: result.status },
    {
      status: 200,
      headers: { ...API_SECURITY_HEADERS, "Cache-Control": "no-store" },
    }
  );
}
