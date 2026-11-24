import type { NextRequest } from "next/server";
import { isWidgetRuntimeEnabled } from "@/lib/agent/runtime-flags";
import { API_SECURITY_HEADERS, isSameOriginRequest } from "@/lib/security/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403, headers: { ...API_SECURITY_HEADERS, Vary: "Origin" } }
    );
  }

  const enabled = await isWidgetRuntimeEnabled();
  return Response.json(
    { enabled },
    {
      status: 200,
      headers: {
        ...API_SECURITY_HEADERS,
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
