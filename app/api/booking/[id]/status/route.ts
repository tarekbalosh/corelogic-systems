import type { NextRequest } from "next/server";
import { getSessionAuthorizedBookingStatus } from "@/lib/booking/status-query";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  const result = await getSessionAuthorizedBookingStatus(id, sessionId);
  if (!result) {
    return Response.json(
      { error: "Not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  return Response.json(
    { status: result.status },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
