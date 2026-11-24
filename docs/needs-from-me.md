# Actions & Inputs Needed From Owner (`docs/needs-from-me.md`)

This living file tracks everything that requires manual owner action, external credentials, legal review, or approval because it cannot or must not be performed autonomously in the repository.

---

## 1. Credentials & Environment Variables (Local `.env.local` & Vercel)
- **Anthropic Console**: Create an API key (`ANTHROPIC_API_KEY`), pick your production model (`ANTHROPIC_MODEL`, e.g., `claude-sonnet-4-5-20250929` or `claude-sonnet-4-6`), and configure monthly spend limits + email usage alerts.
- **Neon PostgreSQL**: Create a project + a separate `dev`/`preview` database branch, then copy both the **Pooled** URL (`DATABASE_URL`) and **Direct** URL (`DIRECT_URL`). Run `npx prisma migrate deploy` and `npx prisma db seed` (never run `migrate dev` against production).
- **Meta WhatsApp Business Cloud API**: Set up a dedicated WhatsApp Business number, create and obtain Meta approval for the 5 utility message templates (`new_lead_alert`, `booking_request_alert`, `booking_confirmed_customer`, `booking_rejected_customer`, `escalation_alert`), generate a permanent System User `WHATSAPP_ACCESS_TOKEN`, copy `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_APP_SECRET`, choose a `WHATSAPP_VERIFY_TOKEN`, set `OWNER_WHATSAPP_NUMBER` (digits only, e.g., `601169397149`), and register `https://www.corelogic-system.my/api/whatsapp/webhook` subscribed to `messages`.
- **Admin Token**: Generate a strong secret (`openssl rand -hex 32`) for `ADMIN_TOKEN` to access `/admin`.

## 2. Existing Live-Site Items Skipped Under Safety Rules
- **Pre-existing ESLint warnings/errors in legacy site pages** (`app/contact/page.tsx`, `app/ar/privacy/page.tsx`, `components/navbar.tsx`, `remove_bg.js`, etc.): Skipped per Live-Site Safety Rules (no edits to existing pages/components). Safe to clean up in a separate maintenance PR later.
- **Existing `/privacy` and `/ar/privacy` pages**: Left untouched per safety rules because both pages already exist. Before setting `CHAT_WIDGET_ENABLED="true"` in Production, have legal counsel review and update `/privacy` and `/ar/privacy` to explicitly disclose AI chat message processing (Anthropic API), consultation booking storage, and WhatsApp communication (Malaysia PDPA compliance).

## 3. Knowledge Base Content (`knowledge/core-logic-knowledge.md`)
- **Replace or merge your authoritative Knowledge Base text**: Because `knowledge/core-logic-knowledge.md` was not present in the repo before Step 2, a strictly factual baseline was generated from your live website pages with zero invented prices or claims. Before enabling the widget:
  1. Paste your full *Core Logic Systems — AI Agent Knowledge Base* (especially **indicative MYR price ranges** per service tier) into `knowledge/core-logic-knowledge.md`.
  2. Resolve the website inconsistencies noted in the final report (registered `Sdn. Bhd.` legal entity name in `config/site.ts`, exact TRX office unit confirmation, 9:00–18:00 office hours vs 10:00–12:30 & 14:00–18:00 consultation slots, and 15-min vs 30-min call duration).

## 4. Deployment, Preview Verification & Post-Launch Actions
- **Vercel Preview Test**: Push `feature/ai-agent` (`git push -u origin feature/ai-agent`), set Preview env vars (`CHAT_WIDGET_ENABLED="true"`, `WHATSAPP_ENABLED="false"` or test number), run `npx tsx scripts/smoke-test.ts --url <preview-url>`, and execute the manual checklist in `docs/test-scenarios.md`.
- **Production Launch**: Follow `docs/deploy-checklist.md` in order (apply `prisma migrate deploy` + `prisma db seed` to Neon Production, merge PR with `CHAT_WIDGET_ENABLED="false"` in Production first, verify Meta webhook + approved templates, then set `CHAT_WIDGET_ENABLED="true"`).
- **Post-Launch Review (1–2 weeks after launch)**: Run `npm run agent:review` to generate anonymized conversation & funnel metrics in `docs/agent-review.md`.
