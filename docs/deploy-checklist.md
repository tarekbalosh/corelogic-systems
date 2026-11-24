# Vercel Production Deployment & Rollback Checklist (`docs/deploy-checklist.md`)

Follow this checklist in exact order so the live website (`https://www.corelogic-system.my`) stays 100% safe at every stage.

---

## 1. Region & Function Architecture Verification
- **Runtime:** All API routes (`/api/chat`, `/api/chat/config`, `/api/booking/[id]/status`, `/api/whatsapp/webhook`) run on **Node.js** (Fluid Compute), never Edge.
- **Timeout (`maxDuration`):** `/api/chat` is configured for `60s` (`vercel.json` + `export const maxDuration = 60`), giving ample headroom for multi-step tool calls + streaming.
- **Knowledge Bundling:** `next.config.ts` traces `./knowledge/**/*` into `/api/chat`, and `lib/agent/knowledge.ts` uses a statically scoped path.
- **Region (`sin1` — Singapore):** `vercel.json` pins serverless functions to `sin1` (AWS `ap-southeast-1`).
  - **Why / Tradeoff:** Create your Neon PostgreSQL project in **`aws-ap-southeast-1` (Singapore)** as well. Putting Vercel Functions and Neon in the same Singapore region keeps database round-trips under `~5 ms` (critical when `/api/chat` executes multiple Prisma reads/writes per turn) and gives Malaysia (`MY`) visitors `< 20 ms` network latency and GCC visitors `~90–110 ms` latency. Static website pages continue to be served from Vercel's global CDN edge PoPs worldwide.

---

## 2. Environment Variables Matrix (Set Preview & Production Separately in Vercel)

In **Vercel Dashboard → Project → Settings → Environment Variables**, configure each variable below:

| Variable | Preview Value | Production Value | Where to Get It |
|---|---|---|---|
| `CHAT_WIDGET_ENABLED` | `"true"` | `"false"` *(flip to `"true"` only at Step 6 below!)* | Built-in feature flag |
| `WHATSAPP_ENABLED` | `"false"` *(or `"true"` with test number)* | `"true"` *(once Meta templates are Approved)* | Built-in WhatsApp send guard |
| `ANTHROPIC_API_KEY` | Preview key | Production key | [Anthropic Console → API Keys](https://console.anthropic.com/settings/keys) |
| `ANTHROPIC_MODEL` | e.g. `claude-sonnet-4-5-20250929` | Same | [Anthropic Models Docs](https://docs.anthropic.com/en/docs/about-claude/models) |
| `DATABASE_URL` | Neon **`preview` branch** Pooled URL | Neon **`main` branch** Pooled URL (`-pooler`) | Neon Console → Connection Details (Pooled) |
| `DIRECT_URL` | Neon **`preview` branch** Direct URL | Neon **`main` branch** Direct URL | Neon Console → Connection Details (Direct) |
| `WHATSAPP_PHONE_NUMBER_ID` | Test/Business Phone ID | Business Phone Number ID | Meta Developer Portal → WhatsApp → API Setup |
| `WHATSAPP_ACCESS_TOKEN` | Permanent System User Token | Permanent System User Token | Meta Business Settings → System Users |
| `WHATSAPP_APP_SECRET` | Meta App Secret | Meta App Secret | Meta Developer Portal → App Settings → Basic |
| `WHATSAPP_VERIFY_TOKEN` | Random 48-char secret | Random 48-char secret | Generate via `openssl rand -hex 24` |
| `WHATSAPP_API_VERSION` | `"v21.0"` | `"v21.0"` | Meta Graph API version |
| `WHATSAPP_OWNER_TEMPLATE_LANG` | `"ar"` | `"ar"` | Match approved owner template language in Meta |
| `OWNER_WHATSAPP_NUMBER` | Your digits without `+` (e.g. `601169397149`) | Your digits without `+` (e.g. `601169397149`) | Your personal/owner WhatsApp number |
| `ADMIN_TOKEN` | Long random secret (`>=32` chars) | Different long random secret (`>=32` chars) | Generate via `openssl rand -hex 32` |
| `BUSINESS_TIMEZONE` | `"Asia/Kuala_Lumpur"` | `"Asia/Kuala_Lumpur"` | Default MYT |
| `MEETING_DURATION_MINUTES` | `"30"` | `"30"` | Consultation slot length |
| `BOOKING_WINDOW_DAYS` | `"14"` | `"14"` | Days ahead shown to visitors |
| `DAILY_MODEL_CALL_LIMIT` | `"100"` | `"200"` | Global daily Claude call cap |
| `BOT_PROTECTION_ENABLED` | `"false"` | `"false"` *(or `"true"` if Turnstile keys added)* | Optional Cloudflare Turnstile |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional | Optional | Cloudflare Dashboard → Turnstile |
| `TURNSTILE_SECRET_KEY` | Optional | Optional | Cloudflare Dashboard → Turnstile |
| `DATA_RETENTION_DAYS` | `"180"` | `"180"` | Used by `scripts/data-retention.ts` |

---

## 3. Anthropic Spend Limits & Monitoring
1. Open [Anthropic Console → Plans & Billing → Limits](https://console.anthropic.com/settings/limits).
2. Set a **monthly hard spend limit** (e.g. USD `$25`–`$50` for the first month) and configure email notifications at **50%**, **80%**, and **100%**.
3. Built-in application monitoring:
   - Structured JSON logs (`chat.turn.completed`, `tool.save_lead.ok`, `whatsapp.send.*`) appear in **Vercel Dashboard → Logs** with phone numbers masked and zero message bodies logged.
   - Automatic error alert: If `/api/chat` throws `>= 3` unhandled errors within 10 minutes, the server automatically sends a high-urgency WhatsApp `escalation_alert` to `OWNER_WHATSAPP_NUMBER` (rate-limited to at most 1 alert per 30 minutes).

---

## 4. Safe Live-Site Rollout Sequence

### Step A — Push `feature/ai-agent` & Test Vercel Preview
1. Apply migrations & seed to your **Neon `dev`/`preview` branch** first:
   ```bash
   DATABASE_URL="<NEON_PREVIEW_POOLED_URL>" DIRECT_URL="<NEON_PREVIEW_DIRECT_URL>" npx prisma migrate deploy
   DATABASE_URL="<NEON_PREVIEW_POOLED_URL>" DIRECT_URL="<NEON_PREVIEW_DIRECT_URL>" npx prisma db seed
   ```
2. Push the feature branch (never `main` yet):
   ```bash
   git push -u origin feature/ai-agent
   ```
3. Open the generated **Vercel Preview URL** (`CHAT_WIDGET_ENABLED="true"` in Preview; live Production remains completely untouched!).
4. Run automated smoke test against the Preview URL:
   ```bash
   npx tsx scripts/smoke-test.ts --url https://<your-preview-url>.vercel.app
   ```
5. Run the manual checklist in `docs/test-scenarios.md` on desktop + mobile (EN + AR).

### Step B — Apply Additive Migration & Seed on Production Database
Once Preview passes, run the **additive-only** migration (`agent_*` tables only) and seed against your Neon **Production (`main`)** database from your terminal:
```bash
DATABASE_URL="<NEON_PROD_POOLED_URL>" DIRECT_URL="<NEON_PROD_DIRECT_URL>" npx prisma migrate deploy
DATABASE_URL="<NEON_PROD_POOLED_URL>" DIRECT_URL="<NEON_PROD_DIRECT_URL>" npx prisma db seed
```

### Step C — Merge to `main` with `CHAT_WIDGET_ENABLED="false"`
1. Verify `CHAT_WIDGET_ENABLED="false"` in Vercel **Production** Environment Variables.
2. Merge `feature/ai-agent` into `main` via GitHub Pull Request.
3. Verify the live site (`https://www.corelogic-system.my`) builds cleanly and looks identical (widget still hidden).
4. In Meta Developer Portal → WhatsApp → Configuration, verify the production webhook URL:
   - Callback URL: `https://www.corelogic-system.my/api/whatsapp/webhook`
   - Verify Token: `<WHATSAPP_VERIFY_TOKEN>`
   - Subscribe to field: **`messages`**
5. Confirm all 5 templates in WhatsApp Manager show **Approved**.

### Step D — Enable the Widget Live
1. Set `CHAT_WIDGET_ENABLED="true"` in Vercel **Production** Environment Variables and redeploy Production (Vercel Dashboard → Deployments → **Redeploy**).
2. Complete one real end-to-end booking + WhatsApp **Confirm** tap on `https://www.corelogic-system.my`.

---

## 5. Instant Rollback Procedures

1. **Zero-Redeploy Instant Pause (< 2 seconds):**
   - Sign in to `https://www.corelogic-system.my/admin` using `ADMIN_TOKEN` and click **"Pause Now"** in the top bar. `/api/chat/config` immediately returns `{ enabled: false }` and hides the widget for all visitors **without redeploying code**.
2. **Environment Variable Rollback:**
   - Set `CHAT_WIDGET_ENABLED="false"` in Vercel Production Environment Variables and click **Redeploy**.
3. **Full Code Rollback:**
   - In Vercel Dashboard → Deployments, click `⋯` on the previous Production deployment and choose **Instant Rollback**, or revert the merge commit on `main`. Because all database migrations only added new `agent_*` tables, rolling back code requires **zero** database rollback.
