import { isWidgetRuntimeEnabled } from "@/lib/agent/runtime-flags";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const enabled = await isWidgetRuntimeEnabled();
  return Response.json(
    { enabled },
    {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}
