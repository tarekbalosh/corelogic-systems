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
