# Architecture & Build Decisions Log (`docs/decisions.md`)

This living document records every assumption, conflict resolution, and safety decision made while autonomously executing `core-logic-ai-agent-build-guide.md` on branch `feature/ai-agent`.

---

## Step 1 — Repository Inspection & Project Initialization

1. **Root folder layout (`lib/`, `components/`, `app/`) instead of `src/`**
   - **Conflict**: The build guide's default folder plan assumed a `src/` directory (`src/lib/agent/`, `src/components/chat/`, `src/app/api/chat/`). However, this live repository places `app/`, `components/`, `lib/`, `config/`, and `proxy.ts` at the **project root**, with `@/*` mapped to `./*` in `tsconfig.json`.
   - **Reason**: Per Next.js 16 official documentation (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/src-folder.md`), **`src/app` is completely ignored if `app` exists at the root directory**. Moving `app/`, `components/`, `lib/`, and `proxy.ts` into `src/` would alter 75+ live files and violate Live-Site Safety Rule #2 and Execution Rule #7 ("choose the option that changes the existing site the least and document it").
   - **Decision**: Placed all new code in isolated root-level folders matching the repo (`lib/agent/`, `lib/booking/`, `lib/whatsapp/`, `lib/security/`, `lib/db.ts`, `components/chat/`, `app/api/chat/`, `app/api/booking/[id]/status/`, `app/api/whatsapp/webhook/`, `app/admin/`, `knowledge/`, `prisma/`, `scripts/`, `docs/`).

2. **Preserving `@AGENTS.md` in `CLAUDE.md`**
   - **Reason**: Existing `CLAUDE.md` contained `@AGENTS.md` (which points coding agents to bundled Next.js 16 docs in `node_modules/next/dist/docs/`). Kept `@AGENTS.md` on line 1 and appended all AI agent project rules below it so nothing was lost.

3. **Tracking `.env.example` without editing `.gitignore`**
   - **Reason**: Existing `.gitignore` includes `.env*` with the comment `# env files (can opt-in for committing if needed)`. Staged `.env.example` explicitly with `git add -f .env.example` so `.gitignore` did not need to be modified while ensuring `.env.example` is tracked in git.

4. **Pre-existing ESLint issues in untouched legacy site files**
   - **Observation**: Running `npm run lint` on unmodified `main` reports 23 errors and 56 warnings in existing pages/components (e.g., unescaped quotes in `app/contact/page.tsx`, `app/ar/privacy/page.tsx`, `setState` in effect in `components/navbar.tsx`, `require()` in `remove_bg.js`).
   - **Decision**: Per Execution Rule #2 and Live-Site Safety Rule #2 ("Do not modify existing pages, components, styles, routes"), those pre-existing files were intentionally left untouched. Every new and touched file in this feature is verified with `npx eslint` at **zero errors and zero warnings**, alongside full-repo `npx tsc --noEmit`, `npm test` (Vitest), and `npm run build` (`next build`).

---

## Step 2 — Company Knowledge Base & Loader (`lib/agent/knowledge.ts`)

1. **Synthesizing a zero-hallucination baseline `knowledge/core-logic-knowledge.md`**
   - **Situation**: Step 2's manual pre-step (*"قبل الـ Prompt: احفظ نص قاعدة المعرفة التي أرسلتها في ملف باسم `knowledge/core-logic-knowledge.md` داخل المشروع"*) had not been completed prior to launching this autonomous build (`knowledge/` did not exist in the workspace).
   - **Decision**: Created `knowledge/core-logic-knowledge.md` strictly from verified facts already published across the repository (`config/site.ts`, `config/work.ts`, `app/about/page.tsx`, `app/services/**`, `components/services-grid.tsx`, `app/contact/page.tsx`, `lib/dictionaries/{en,ar}.json`). Did **not** invent prices, clients, testimonials, or unverified metrics; marked indicative MYR price tiers with `[OWNER_TODO]` and safe escalation rules, then left the file completely unmodified in all later steps.
2. **Serverless file bundling via `outputFileTracingIncludes`**
   - **Decision**: Configured `outputFileTracingIncludes: { "/api/chat": ["./knowledge/**/*"] }` in `next.config.ts` (verified against Next.js 16 bundled `output.md` docs) and cached the UTF-8 markdown string in module scope in `lib/agent/knowledge.ts`.

---

## Step 3 — Database Layer (Prisma + Neon PostgreSQL)

1. **Prisma v6 (`prisma@^6`, `@prisma/client@^6`) and Vitest v3 (`vitest@^3`)**
   - **Reason**: Prisma v6 supports standard `url = env("DATABASE_URL")` + `directUrl = env("DIRECT_URL")` in `prisma/schema.prisma` and `"prisma": { "seed": "tsx prisma/seed.ts" }` in `package.json` as specified in Step 3. Vitest v3 was chosen instead of Vitest v5 because `vitest@5` requires `@types/node@^22`, whereas the live site pins `@types/node@^20` (preserved per Live-Site Safety Rule #6: never upgrade existing package versions).
2. **Table & Enum Prefixing (`agent_*`)**
   - **Reason**: Even though no database existed previously in this repository, all 7 models and 4 enums are mapped with `@@map("agent_*")` (`agent_conversations`, `agent_messages`, `agent_leads`, `agent_bookings`, `agent_availability_rules`, `agent_blocked_dates`, `agent_processed_webhook_events`) to prevent any collision if the Neon database later hosts additional tables.
3. **Partial Unique Index for Double-Booking Prevention**
   - **Reason**: Added `CREATE UNIQUE INDEX "agent_bookings_startsAt_active_key" ON "agent_bookings"("startsAt") WHERE "status" IN ('PENDING', 'CONFIRMED');` directly in `prisma/migrations/20261124000100_init_ai_agent/migration.sql` so rejected/cancelled bookings do not block re-booking the same time slot, while active (`PENDING` or `CONFIRMED`) bookings are race-proof at the PostgreSQL index level.
4. **Migration Execution Deferred to Owner Dev/Branch DB**
   - **Reason**: `DATABASE_URL` is not configured in this local workspace. Generated and validated the complete SQL migration offline (`prisma migrate diff` + `prisma generate`) without touching any live database.

---

## Step 4 — Booking & Availability Business Logic (`lib/booking/`)

1. **Timezone Library (`date-fns` + `date-fns-tz`)**
   - **Reason**: Used `fromZonedTime` and `formatInTimeZone` from `date-fns-tz` so all `AvailabilityRule` hours (`10:00–12:30`, `14:00–18:00`) are interpreted in `BUSINESS_TIMEZONE` (`Asia/Kuala_Lumpur`, UTC+8) while storing/comparing all timestamps in UTC, with deterministic English and Arabic month/weekday names independent of host ICU locale packs.
2. **Defense-in-Depth Against Double-Booking**
   - **Reason**: `createPendingBooking` executes inside a `Serializable` Prisma transaction, re-validates schedule alignment + blocked dates + 2-hour lead time + overlapping active bookings, and catches PostgreSQL `P2002` (partial unique index violation) / `P2034` (serialization conflict) to throw a typed `SlotUnavailableError`.

---

## Step 5 — Structured System Prompt (`lib/agent/system-prompt.ts`)

1. **XML-Sectioned Composition & Dynamic MYT Timestamp**
   - **Reason**: Structured `buildSystemPrompt()` into `<role>`, `<language>`, `<knowledge>`, `<behavior>`, `<lead_collection>`, `<booking_flow>`, `<tools_usage>`, and `<safety>`, injecting the current `Asia/Kuala_Lumpur` timestamp at call time. Checked for conflicts between behavior rules and `knowledge/core-logic-knowledge.md`: none in `core-logic-knowledge.md` itself, though existing website pages outside the knowledge file still mention a "15-minute discovery call" (`lib/dictionaries/en.json`) vs `MEETING_DURATION_MINUTES=30` (documented for owner alignment).

---

## Step 6 — Agent Tools & Server Executors (`lib/agent/tools.ts`)

1. **Strict E.164 Normalization Without Country Guessing**
   - **Reason**: `normalizeWhatsAppNumber` converts Arabic-Indic digits, accepts `+` or `00` international prefixes, rejects local numbers missing a country code (`MISSING_COUNTRY_CODE`), and validates via `libphonenumber-js` (`parsePhoneNumberFromString`).
2. **Idempotent Per-Conversation Lead Upsert & Single Owner Notification**
   - **Reason**: `save_lead` looks up `Conversation.leadId`, updates existing leads in place without overwriting omitted optional fields, and uses an atomic conditional update (`where: { id, notifiedAt: null }`) so `notifyNewLead` fires at most once per lead, wrapped in `try/catch` so notification errors never fail the tool.

---

## Step 7 — WhatsApp Business Cloud API & Webhook (`lib/whatsapp/`, `app/api/whatsapp/webhook/route.ts`)

1. **Centralized Template Names/Locales & `WHATSAPP_ENABLED` Guard**
   - **Reason**: Centralized all 5 template names (`new_lead_alert`, `booking_request_alert`, `booking_confirmed_customer`, `booking_rejected_customer`, `escalation_alert`) and language codes in `lib/whatsapp/config.ts`, sanitized template text parameters to collapse newlines/tabs (preventing Meta error `#132018`), and gated outbound Graph API requests behind `WHATSAPP_ENABLED="true"` so local/Preview testing never sends unintended messages.
2. **Constant-Time Raw-Body HMAC + Owner-Only + Atomic Idempotency**
   - **Reason**: `app/api/whatsapp/webhook/route.ts` reads `request.text()` first, verifies `X-Hub-Signature-256` with `crypto.timingSafeEqual`, checks `msg.from` against `OWNER_WHATSAPP_NUMBER` before writing state, deduplicates `wamid`s via `ProcessedWebhookEvent` primary-key inserts, and handles both `button.payload` (template quick replies) and `interactive.button_reply.id`.

---

## Step 8 — Streaming Chat Endpoint & Booking Status Route (`app/api/chat/route.ts`, `app/api/booking/[id]/status/route.ts`)

1. **Node.js Runtime SSE Streaming with 6-Iteration Tool Loop Cap**
   - **Reason**: Implemented `POST /api/chat` on the Node.js runtime (`maxDuration = 60`) with `ReadableStream` Server-Sent Events (`text`, `slots`, `booking`, `error`, `done`), loading only server-side conversation history (`MAX_HISTORY_MESSAGES = 20`), capping tool iterations at `6`, logging token usage per turn, and scrubbing output for internal tags/secrets.
2. **Session-Authorized Booking Status Polling (`GET /api/booking/[id]/status`)**
   - **Reason**: Requires `sessionId` UUID query param and verifies via Prisma that `booking.lead.conversations` includes `sessionId`, returning `{ status }` only or `404` to prevent booking-ID enumeration and PII exposure.

---

## Step 9 — Bilingual RTL/LTR Chat Widget UI (`components/chat/`, `app/layout.tsx`)

1. **Lazy-Loaded Gate Keeping All 57 Site Pages Static**
   - **Reason**: Mounted `<ChatWidgetMount />` as a single minimal addition in `app/layout.tsx`. `ChatWidgetLoader` uses `next/dynamic(..., { ssr: false })` and renders nothing unless `CHAT_WIDGET_ENABLED === "true"` (and also checks `/api/chat/config` on mount for runtime kill-switch support without opting marketing pages out of static prerendering). Hidden automatically on `/admin` and `/portal`.
2. **Existing `/privacy` & `/ar/privacy` Reused**
   - **Reason**: Both `/privacy` and `/ar/privacy` already exist in the repository, so no stub page was created (avoiding any modification to existing legal pages); flagged in `docs/needs-from-me.md` for legal counsel review before launch.
3. **Scoped Turbopack File Tracing in `lib/agent/knowledge.ts`**
   - **Reason**: Statically scoped the default `fs.readFileSync(path.join(process.cwd(), "knowledge", "core-logic-knowledge.md"))` branch and annotated the test-only custom path with `/* turbopackIgnore: true */` to eliminate Next.js 16 Turbopack's broad NFT warning.

---

## Step 10 — Security & Abuse Hardening (`lib/security/`, `scripts/data-retention.ts`, `docs/security-checklist.md`)

1. **Postgres-Backed Fixed-Window Rate Limiter Over Upstash Redis**
   - **Reason**: Chose atomic PostgreSQL `INSERT ... ON CONFLICT DO UPDATE` buckets (`agent_rate_limits`) over `@upstash/ratelimit` so the owner does not need to provision or pay for a separate Redis service beyond Neon PostgreSQL, with zero extra npm dependencies and SHA-256 IP hashing so raw visitor IPs are never stored.
2. **Cloudflare Turnstile Optional Flag (`BOT_PROTECTION_ENABLED="false"` default)**
   - **Reason**: Implemented hidden `website_url` honeypot active immediately plus optional Cloudflare Turnstile verification before the first message of a session (`BOT_PROTECTION_ENABLED="true"`).
3. **Runtime Widget Kill-Switch (`agent_runtime_settings`) + Repeated-Error Alert**
   - **Reason**: Added `agent_runtime_settings` so the widget can be paused immediately without redeploying code (when `CHAT_WIDGET_ENABLED="true"`), and added a 30-minute cooldown WhatsApp alert when `/api/chat` experiences >= 3 unhandled errors in 10 minutes.

---

## Step 11 — Protected Admin Dashboard (`app/admin/`, `lib/security/admin-auth.ts`, `lib/admin/actions.ts`)

1. **Constant-Time SHA-256 Digest Check & `httpOnly` `sameSite=strict` Signed Cookie**
   - **Reason**: `verifyAdminTokenConstantTime` compares fixed 32-byte SHA-256 digests via `crypto.timingSafeEqual` (preventing length timing leaks), scopes `corelogic_admin_session` to `path: "/admin"` with `httpOnly`, `secure` (in prod), and `sameSite: "strict"`, rate-limits `/admin/login` (10 attempts / 15 min per hashed IP), and marks all `/admin` routes `noindex` via both metadata and `X-Robots-Tag`.
2. **Unified Booking Decision Pipeline**
   - **Reason**: `/admin/bookings` Confirm/Reject buttons invoke the exact same `decideBooking` + `notifyCustomerBookingDecision` pipeline as `/api/whatsapp/webhook` so results and customer notifications are identical regardless of channel.
