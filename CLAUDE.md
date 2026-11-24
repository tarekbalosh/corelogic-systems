@AGENTS.md

# CoreLogic Systems — AI Agent Project Rules (`CLAUDE.md`)

## 1. Stack & Architecture
- **Framework**: Next.js `16.2.4` (App Router, Turbopack), React `19.2.4`, TypeScript `strict: true`, Tailwind CSS `v4`, deployed on Vercel (Node.js runtime / Fluid Compute — never Edge runtime).
- **Database**: PostgreSQL on Neon via Prisma (`@prisma/client` + `prisma` v6). All agent tables are prefixed with `agent_` via `@@map(...)` to guarantee zero table-name collisions.
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`) with streaming and tool use. The model name **must** always come from `process.env.ANTHROPIC_MODEL` — never hard-coded in application logic.
- **WhatsApp**: Meta WhatsApp Business Cloud API (Graph API), invoked exclusively from server-side code.
- **Timezone**: Business logic always uses `BUSINESS_TIMEZONE` (default `Asia/Kuala_Lumpur`, MYT, UTC+8). All database timestamps are stored in **UTC**.
- **Languages**: Bilingual Arabic (`ar`, RTL) and English (`en`, LTR). The agent detects and replies in the customer's language; the chat widget supports full RTL/LTR layout switching and per-message text direction detection.

## 2. Security & Code Rules
- **Secrets**: API keys and tokens live exclusively in server-side environment variables. Never expose secrets to client components or client bundles (`NEXT_PUBLIC_*` must never hold secrets). Never commit secrets to the repository.
- **Validation**: Validate all external inputs (HTTP bodies, query parameters, tool inputs, admin forms) with `zod`. Strip control characters and enforce payload size limits.
- **Abuse Protection**: Rate limit public endpoints (`/api/chat`, `/admin/login`), enforce a global daily model call limit (`DAILY_MODEL_CALL_LIMIT`), include honeypot + optional Cloudflare Turnstile verification, and enforce same-origin checks on internal API routes.
- **Webhook Verification**: Verify `X-Hub-Signature-256` on the **raw** request body using `WHATSAPP_APP_SECRET` and `crypto.timingSafeEqual` before parsing JSON. Deduplicate incoming message IDs via `ProcessedWebhookEvent`.
- **Privacy**: Mask phone numbers and avoid logging raw message bodies or tokens in application logs.
- **Modularity**: Small focused modules, no unused dependencies, every environment variable documented in `.env.example`.

## 3. Folder Structure (Adapted to Root-Directory Repo)
> **Note on `src/` vs Root**: This repository places `app/`, `components/`, `lib/`, `config/`, and `proxy.ts` at the **project root** (not inside `src/`), with `@/*` mapped to `./*` in `tsconfig.json`. Next.js ignores `src/app/` whenever root `app/` exists (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/src-folder.md`). To avoid moving 75+ live files, all new modules follow the existing root convention:

- `knowledge/` — Company knowledge base markdown (`knowledge/core-logic-knowledge.md`)
- `prisma/` — Prisma schema (`schema.prisma`), SQL migrations, and `seed.ts`
- `lib/db.ts` — Singleton `PrismaClient` safe for Next.js hot reload and serverless
- `lib/agent/` — Knowledge loader, system prompt builder, tool definitions & executors, chat runner, security guards
- `lib/booking/` — Availability slot generator and transactional booking logic
- `lib/whatsapp/` — Graph API client, template config, owner/customer notifications
- `lib/security/` — Rate limiting, origin checks, masking/logging, bot verification, admin session auth
- `app/api/chat/route.ts` — Streaming SSE chat endpoint + tool loop (`POST`) and widget runtime config (`app/api/chat/config/route.ts`)
- `app/api/booking/[id]/status/route.ts` — Session-scoped booking status polling (`GET`)
- `app/api/whatsapp/webhook/route.ts` — Meta webhook handshake (`GET`) + HMAC-verified button handler (`POST`)
- `app/admin/` — Protected `ADMIN_TOKEN` dashboard (`/admin/leads`, `/admin/bookings`, `/admin/availability`) with `noindex`
- `components/chat/` — Lazy-loaded bilingual RTL/LTR chat widget UI and root-layout gate
- `scripts/` — Verification, smoke test, and data retention scripts
- `docs/` — Living decisions log, owner checklist, WhatsApp setup guide, test scenarios, deploy checklist, post-launch review setup

## 4. Live-Site Safety Rules (Mandatory)
1. **Branch Isolation**: Work exclusively on git branch `feature/ai-agent`. Never commit to `main`, never push to `main`, never deploy to production, and never run migrations against a production database.
2. **Zero Impact on Existing Site**: Do **not** modify existing pages, components, styles, routes, or existing dependency versions. The only permitted edits to existing tracked files are:
   - `CLAUDE.md` (project rules documentation)
   - `package.json` & `package-lock.json` (adding strictly required new packages & scripts without changing existing package versions)
   - `next.config.ts` (`outputFileTracingIncludes` for `knowledge/core-logic-knowledge.md` and API security headers)
   - `app/layout.tsx` (single minimal line mounting `<ChatWidgetMount />`)
3. **New Code in New Files Only**: Keep all agent, booking, WhatsApp, chat UI, and admin code isolated in new directories/files.
4. **Additive Database Only**: Never alter or drop existing tables or data. Only create new `agent_*`-mapped tables. Use a Neon development/branch database for local work and testing.
5. **Default Disabled**: The chat widget is disabled by default (`CHAT_WIDGET_ENABLED=false`) and hidden on `/admin` (and `/portal`) routes.
6. **Continuous Verification**: After every step, run lint (on all new/touched files), TypeScript type check (`npx tsc --noEmit`), automated tests (`npm test`), and production build (`npm run build`), then commit cleanly to `feature/ai-agent`.

## 5. Repository Inspection Baseline
- **Existing Database / Prisma**: None present prior to this feature.
- **Existing Chat / Contact**: No chat widget or floating bottom-corner launcher exists. `/contact` and `/ar/contact` use `sendContactEmail` in `app/actions.ts` (currently console-logged `TODO` with a `website_url` honeypot). Static WhatsApp links point to `https://wa.me/601169397149`.
- **Fonts & RTL**: `app/layout.tsx` loads `Inter`, `Space_Grotesk`, and `Cairo` (`--font-arabic`); `/ar/*` uses `app/ar/layout.tsx` (`dir="rtl" lang="ar" className="rtl font-arabic"`) + `<HtmlLang lang="ar" />`.
- **Theme**: Light modern palette (`#f8fafc` background, `#0f172a` text, `#4f46e5` primary indigo, `#0ea5e9` secondary cyan, `#0B1F3A` navy footer).
- **Existing Legal Pages**: `/privacy`, `/ar/privacy`, `/terms`, `/ar/terms` already exist (left untouched; flagged for legal update to cover AI chat & WhatsApp processing).
- **Proxy & Robots**: `proxy.ts` already excludes `/api` routes; `app/robots.ts` already disallows `/api/`.
