# Post-Launch AI Agent Review (`docs/agent-review.md`)

> **Status:** Pre-launch baseline ready. Run `npm run agent:review` (`npx tsx scripts/generate-agent-review.ts --days 14`) **1 to 2 weeks after enabling `CHAT_WIDGET_ENABLED="true"` in Production** to populate anonymized funnel metrics, stalled-lead diagnostics, and rule-compliance checks automatically.

## How to Run Post-Launch Review (Step 14)
1. Ensure `DATABASE_URL` points to a read-only replica or your database connection in `.env.local`.
2. Run:
   ```bash
   npm run agent:review
   ```
3. Inspect the generated sections (all phone numbers and emails are automatically redacted), then optionally run Step 14's prompt in `core-logic-ai-agent-build-guide.md` to review suggested `knowledge/core-logic-knowledge.md` additions and quick-reply chip refinements.
