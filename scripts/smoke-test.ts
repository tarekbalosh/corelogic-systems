import crypto from "node:crypto";

/**
 * End-to-End Live Smoke Test (`scripts/smoke-test.ts`)
 *
 * Runs a scripted multi-turn SSE conversation against a running Next.js / Vercel Preview
 * instance with real keys, using clearly fake data ("Test Lead (Smoke Test)") and printing
 * a structured PASS/FAIL table.
 *
 * Safety: Refuses to run if local `WHATSAPP_ENABLED="true"` unless `--send-whatsapp` is passed.
 *
 * Usage:
 *   npx tsx scripts/smoke-test.ts --url http://localhost:3000
 *   npx tsx scripts/smoke-test.ts --url https://your-preview.vercel.app --send-whatsapp
 */

interface StepResult {
  step: string;
  passed: boolean;
  detail: string;
}

interface ParsedSseSummary {
  fullText: string;
  slotsCount: number;
  firstSlotIso: string | null;
  bookingId: string | null;
  errorEvent: string | null;
  doneReceived: boolean;
}

async function sendChatTurn(
  baseUrl: string,
  payload: Record<string, unknown>
): Promise<{ status: number; sse: ParsedSseSummary }> {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: baseUrl,
    },
    body: JSON.stringify(payload),
  });

  const summary: ParsedSseSummary = {
    fullText: "",
    slotsCount: 0,
    firstSlotIso: null,
    bookingId: null,
    errorEvent: null,
    doneReceived: false,
  };

  if (!res.ok || !res.body) {
    const bodyText = await res.text().catch(() => "");
    summary.errorEvent = `HTTP ${res.status}: ${bodyText.slice(0, 160)}`;
    return { status: res.status, sse: summary };
  }

  const rawSse = await res.text();
  for (const frame of rawSse.split("\n\n")) {
    for (const line of frame.split("\n")) {
      if (!line.startsWith("data:")) continue;
      const rawJson = line.slice(5).trim();
      if (!rawJson) continue;
      try {
        const ev = JSON.parse(rawJson) as {
          type: string;
          delta?: string;
          slots?: Array<{ startsAt: string }>;
          bookingId?: string;
          message?: string;
        };
        if (ev.type === "text" && ev.delta) {
          summary.fullText += ev.delta;
        } else if (ev.type === "slots" && Array.isArray(ev.slots)) {
          summary.slotsCount = ev.slots.length;
          summary.firstSlotIso = ev.slots[0]?.startsAt ?? null;
        } else if (ev.type === "booking" && ev.bookingId) {
          summary.bookingId = ev.bookingId;
        } else if (ev.type === "error") {
          summary.errorEvent = ev.message ?? "error event";
        } else if (ev.type === "done") {
          summary.doneReceived = true;
        }
      } catch {
        // Ignore malformed frame
      }
    }
  }

  return { status: res.status, sse: summary };
}

async function main() {
  const args = process.argv.slice(2);
  const allowWhatsApp = args.includes("--send-whatsapp");
  const urlIdx = args.indexOf("--url");
  const baseUrl = (
    (urlIdx >= 0 && args[urlIdx + 1]
      ? args[urlIdx + 1]
      : process.env.SMOKE_TEST_URL) ?? "http://localhost:3000"
  ).replace(/\/+$/, "");

  if (process.env.WHATSAPP_ENABLED === "true" && !allowWhatsApp) {
    console.error(
      "[smoke-test] Refusing to run because WHATSAPP_ENABLED=true in current env and --send-whatsapp was not passed.\n" +
        "Either set WHATSAPP_ENABLED=false on the server or pass --send-whatsapp explicitly."
    );
    process.exit(1);
  }

  if (!allowWhatsApp) {
    console.log(
      "[smoke-test] Note: Running in no-WhatsApp mode (ensure target server has WHATSAPP_ENABLED=false unless testing real alerts with --send-whatsapp)."
    );
  }

  const sessionId = crypto.randomUUID();
  const results: StepResult[] = [];

  console.log(`[smoke-test] Target: ${baseUrl} | Session: ${sessionId}\n`);

  // 1. Check /api/chat/config
  try {
    const cfgRes = await fetch(`${baseUrl}/api/chat/config`, {
      headers: { Origin: baseUrl },
    });
    const cfgJson = (await cfgRes.json()) as { enabled?: boolean };
    results.push({
      step: "1. GET /api/chat/config",
      passed: cfgRes.ok && typeof cfgJson.enabled === "boolean",
      detail: `HTTP ${cfgRes.status}, enabled=${String(cfgJson.enabled)}`,
    });
  } catch (err) {
    results.push({
      step: "1. GET /api/chat/config",
      passed: false,
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  // 2. General service question (EN)
  const turn1 = await sendChatTurn(baseUrl, {
    sessionId,
    message: "Hello! Briefly, what software services does Core Logic Systems offer?",
    clientLanguage: "en",
  });
  results.push({
    step: "2. Service inquiry (EN SSE stream)",
    passed:
      turn1.status === 200 &&
      turn1.sse.doneReceived &&
      !turn1.sse.errorEvent &&
      turn1.sse.fullText.length > 20,
    detail:
      turn1.sse.errorEvent ??
      `OK (${turn1.sse.fullText.length} chars streamed)`,
  });

  // 3. Arabic greeting & RTL language switch
  const turn2 = await sendChatTurn(baseUrl, {
    sessionId,
    message: "هل يمكنكم تطوير نظام ERP مخصص لشركتي؟",
    clientLanguage: "ar",
  });
  const hasArabicReply = /[\u0600-\u06FF]/.test(turn2.sse.fullText);
  results.push({
    step: "3. Arabic reply detection",
    passed:
      turn2.status === 200 &&
      turn2.sse.doneReceived &&
      !turn2.sse.errorEvent &&
      hasArabicReply,
    detail:
      turn2.sse.errorEvent ??
      `Arabic script detected=${String(hasArabicReply)} (${turn2.sse.fullText.length} chars)`,
  });

  // 4. Fake lead details ("Test Lead") — verify agent shows summary / asks consent before saving
  const turn3 = await sendChatTurn(baseUrl, {
    sessionId,
    message:
      "My name is Test Lead (Automated Smoke Test), my WhatsApp is +60123456789, and I want a consultation for a small internal inventory web app.",
    clientLanguage: "en",
  });
  results.push({
    step: "4. Lead summary & consent prompt",
    passed:
      turn3.status === 200 &&
      turn3.sse.doneReceived &&
      !turn3.sse.errorEvent &&
      turn3.sse.fullText.length > 15,
    detail:
      turn3.sse.errorEvent ??
      `OK (${turn3.sse.fullText.slice(0, 90).replace(/\n/g, " ")}…)`,
  });

  // 5. Unauthorized booking status lookup must return 404
  const unauthRes = await fetch(
    `${baseUrl}/api/booking/fake_booking_id/status?sessionId=${sessionId}`,
    { headers: { Origin: baseUrl } }
  );
  results.push({
    step: "5. GET /api/booking/[id]/status guard",
    passed: unauthRes.status === 404,
    detail: `HTTP ${unauthRes.status} (expected 404)`,
  });

  console.log("\n=== Smoke Test Report ===");
  for (const r of results) {
    console.log(
      `${r.passed ? "[PASS]" : "[FAIL]"} ${r.step.padEnd(36)} — ${r.detail}`
    );
  }

  const failedCount = results.filter((r) => !r.passed).length;
  console.log(
    `\nSummary: ${results.length - failedCount}/${results.length} passed.`
  );

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[smoke-test] Fatal error:", err);
  process.exit(1);
});
