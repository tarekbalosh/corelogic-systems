import type { NextRequest } from "next/server";
import {
  processWhatsAppWebhookPost,
  verifyWebhookHandshakeToken,
} from "@/lib/whatsapp/webhook";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const verifyToken = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge") ?? "";

  if (verifyWebhookHandshakeToken(mode, verifyToken)) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return Response.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  const result = await processWhatsAppWebhookPost(rawBody, signature);
  return Response.json(result.body, { status: result.status });
}
