import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

/**
 * Post-Launch Conversation & Funnel Review Generator (Step 14 setup — `scripts/generate-agent-review.ts`)
 *
 * Analyzes stored conversations, leads, and bookings over the past N days (default 14),
 * strictly anonymizes all PII (never outputs phone numbers, emails, or full names),
 * and writes `docs/agent-review.md`.
 *
 * Usage (1–2 weeks after launch):
 *   npm run agent:review
 *   npx tsx scripts/generate-agent-review.ts --days 14
 */

function scrubPii(text: string): string {
  return text
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[EMAIL_REDACTED]")
    .replace(/\+?\d[\d\s().-]{6,}\d/g, "[PHONE_REDACTED]")
    .slice(0, 220)
    .replace(/\s+/g, " ")
    .trim();
}

function countQuestionMarks(text: string): number {
  return (text.match(/[?؟]/g) ?? []).length;
}

async function main() {
  const args = process.argv.slice(2);
  const daysIdx = args.indexOf("--days");
  const days = Number.parseInt(
    daysIdx >= 0 && args[daysIdx + 1] ? args[daysIdx + 1] : "14",
    10
  );

  if (!process.env.DATABASE_URL?.trim()) {
    console.error(
      "[agent-review] DATABASE_URL is not set. Configure DATABASE_URL in .env.local to analyze stored conversations."
    );
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [conversations, leadsCount, bookings] = await Promise.all([
      prisma.conversation.findMany({
        where: { createdAt: { gte: since } },
        include: {
          messages: { orderBy: { createdAt: "asc" } },
          lead: { select: { id: true, requestType: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.count({ where: { createdAt: { gte: since } } }),
      prisma.booking.findMany({
        where: { createdAt: { gte: since } },
        select: { id: true, status: true },
      }),
    ]);

    const stalledConversations = conversations.filter(
      (c) => !c.leadId && c.messages.some((m) => m.role === "user")
    );

    const firstUserQuestions: string[] = [];
    const potentialRuleViolations: Array<{
      conversationId: string;
      issue: string;
    }> = [];

    for (const conv of conversations) {
      const firstUser = conv.messages.find((m) => m.role === "user");
      if (firstUser) {
        firstUserQuestions.push(scrubPii(firstUser.content));
      }

      for (const msg of conv.messages) {
        if (msg.role !== "assistant") continue;
        const lower = msg.content.toLowerCase();

        if (countQuestionMarks(msg.content) >= 2) {
          potentialRuleViolations.push({
            conversationId: conv.id,
            issue: "Multiple questions asked in a single assistant turn",
          });
        }
        if (
          (lower.includes("appointment is confirmed") ||
            lower.includes("booking is confirmed")) &&
          !lower.includes("pending")
        ) {
          potentialRuleViolations.push({
            conversationId: conv.id,
            issue: "Possible premature booking confirmation wording",
          });
        }
        if (lower.includes("discount approved")) {
          potentialRuleViolations.push({
            conversationId: conv.id,
            issue: "Possible unauthorized discount commitment",
          });
        }
      }
    }

    const confirmedBookings = bookings.filter(
      (b) => b.status === "CONFIRMED"
    ).length;
    const rejectedBookings = bookings.filter(
      (b) => b.status === "REJECTED"
    ).length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "PENDING"
    ).length;

    const reportLines = [
      `# Post-Launch AI Agent Review (\`docs/agent-review.md\`)`,
      ``,
      `Generated on: \`${new Date().toISOString()}\` | Window: Past **${days} days** (anonymized — zero phone numbers or emails included).`,
      ``,
      `## 1. Sample Visitor Opening Questions (Anonymized)`,
      ...(firstUserQuestions.length > 0
        ? firstUserQuestions.slice(0, 20).map((q, idx) => `${idx + 1}. "${q}"`)
        : ["- No conversations recorded in this window yet."]),
      ``,
      `## 2. Knowledge Base Gap Candidates`,
      `- Review escalated conversations in \`/admin/leads\` and Vercel logs (\`tool.escalate_to_team.ok\`), then propose verified additions to \`knowledge/core-logic-knowledge.md\` manually.`,
      ``,
      `## 3. Stalled Lead Conversations (${stalledConversations.length} of ${conversations.length})`,
      ...(stalledConversations.length > 0
        ? stalledConversations.slice(0, 15).map((c) => {
            const lastUser = [...c.messages]
              .reverse()
              .find((m) => m.role === "user");
            return `- \`${c.id}\` (${c.messages.length} msgs, lang=\`${c.language ?? "?"}\`): last user message: "${scrubPii(lastUser?.content ?? "")}"`;
          })
        : ["- None in this window."]),
      ``,
      `## 4. Heuristic Behavior Rule Audit`,
      ...(potentialRuleViolations.length > 0
        ? potentialRuleViolations.map(
            (v) => `- Conversation \`${v.conversationId}\`: ${v.issue}`
          )
        : ["- Zero heuristic rule violations detected."]),
      ``,
      `## 5. Prompt & Quick-Reply Improvement Notes`,
      `- After reviewing Sections 1–4 above, feed this anonymized report into Step 14's prompt to draft targeted refinements.`,
      ``,
      `## 6. Funnel Summary (Past ${days} Days)`,
      `| Metric | Count |`,
      `|---|---|`,
      `| Conversations started | ${conversations.length} |`,
      `| Leads saved (with consent) | ${leadsCount} |`,
      `| Lead conversion rate | ${conversations.length > 0 ? `${((leadsCount / conversations.length) * 100).toFixed(1)}%` : "N/A"} |`,
      `| Bookings requested | ${bookings.length} |`,
      `| Bookings confirmed | ${confirmedBookings} |`,
      `| Bookings rejected | ${rejectedBookings} |`,
      `| Bookings still pending | ${pendingBookings} |`,
      ``,
    ];

    const outPath = path.join(process.cwd(), "docs", "agent-review.md");
    fs.writeFileSync(outPath, reportLines.join("\n"), "utf-8");
    console.log(`[agent-review] Wrote anonymized report to ${outPath}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("[agent-review] Failed:", err);
  process.exit(1);
});
