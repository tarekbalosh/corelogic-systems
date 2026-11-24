# Security & Abuse Hardening Checklist (`docs/security-checklist.md`)

## Summary Table

| # | Security Control | Status | Implementation / Notes |
|---|---|---|---|
| 1 | Per-session rate limit (`POST /api/chat`) | **Done** | 20 messages / 10 minutes per `sessionId` (`lib/security/rate-limit.ts`), returns HTTP `429` with localized EN/AR message and `Retry-After`. |
| 2 | Per-IP rate limit (`POST /api/chat`) | **Done** | 60 messages / 1 hour per SHA-256-hashed client IP (raw visitor IPs are never stored in Postgres). |
| 3 | Global daily model call cap (`DAILY_MODEL_CALL_LIMIT`) | **Done** | Enforced before each chat turn and incremented on every Anthropic loop iteration in `Asia/Kuala_Lumpur` calendar days (default `200`/day). |
| 4 | Anthropic Console monthly budget & email alerts | **Needs manual action** | Configure hard monthly spend cap and 50%/80%/100% alert thresholds in `console.anthropic.com`. |
| 5 | Bot protection (honeypot + optional Turnstile) | **Done (Turnstile keys optional)** | Hidden `website_url` honeypot enforced on `/api/chat`; Cloudflare Turnstile supported behind `BOT_PROTECTION_ENABLED="true"` before the first session message. |
| 6 | Strict input hardening | **Done** | Rejects non-JSON (`415`), caps raw payload at 16 KB (`413`), caps message at 2,000 chars, strips ASCII/C1 control chars, validates UUID/enums with Zod, ignores client-supplied history/system roles. |
| 7 | Prompt-injection & output exfiltration defenses | **Done** | `<safety>` prompt isolation + server-side `sanitizeAssistantOutput` scrubbing XML tags, key prefixes (`sk-ant-`, `EAA...`), and private `OWNER_WHATSAPP_NUMBER`; covered by `tests/security-adversarial.test.ts`. |
| 8 | Cost controls & token logging | **Done** | `max_tokens: 1024`, history capped at last 20 messages, tool loop capped at 6 iterations, structured per-turn token usage logging (`chat.turn.completed`). |
| 9 | PII log masking | **Done** | Phone numbers masked (`+601****789`), message contents never logged, tokens/keys redacted (`lib/security/mask.ts`). |
| 10 | Data retention & right-to-erasure tooling | **Done** | `scripts/data-retention.ts` (`--purge --days 180 --execute`, `--delete-phone`, `--delete-lead-id`, `--delete-session`) + SQL reference below + `/admin/leads` delete action. |
| 11 | Same-origin API check & security headers | **Done** | `isSameOriginRequest` blocks cross-origin browser requests (`403`); `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy` set on `/api/*` and `/admin/*` in `next.config.ts`. |
| 12 | Zero client-bundle secret leakage | **Done** | Verified via automated scan of `.next/static` build output for secret env names and key prefixes (`sk-ant-`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_APP_SECRET`, `ADMIN_TOKEN`, `DATABASE_URL`). |
| 13 | WhatsApp webhook HMAC & replay/owner protection | **Done** | Verifies `X-Hub-Signature-256` over raw request text via `crypto.timingSafeEqual`, enforces `OWNER_WHATSAPP_NUMBER`, deduplicates `wamid`s via `ProcessedWebhookEvent`. |
| 14 | Privacy policy legal review (`/privacy`, `/ar/privacy`) | **Needs manual action** | Existing privacy pages must be reviewed by legal counsel and updated to mention AI chat processing and WhatsApp notifications before enabling `CHAT_WIDGET_ENABLED="true"`. |

---

## Reference SQL for Manual Data Retention & Subject Deletion

If you prefer running SQL directly in the Neon SQL Editor:

```sql
-- 1. Preview conversations older than 180 days:
SELECT COUNT(*) FROM "agent_conversations"
WHERE "updatedAt" < NOW() - INTERVAL '180 days';

-- 2. Delete conversations (cascades to agent_messages) older than 180 days:
DELETE FROM "agent_conversations"
WHERE "updatedAt" < NOW() - INTERVAL '180 days';

-- 3. Delete all data for a specific customer WhatsApp number (E.164):
DELETE FROM "agent_conversations"
WHERE "leadId" IN (SELECT "id" FROM "agent_leads" WHERE "whatsappNumber" = '+60123456789');

DELETE FROM "agent_leads"
WHERE "whatsappNumber" = '+60123456789';
```
