# Datenschutz & Third-Party Service Audit Report

> **Important Legal Notice:** This document is a technical audit of every external service, cookie, and browser storage mechanism present in the `corelogic-systems` codebase. It is **not** legal advice. Before removing `noindex` from `/[locale]/impressum` and `/[locale]/datenschutz` or marketing actively in Germany, a qualified German lawyer (*Rechtsanwalt*) or certified German privacy generator (e.g., eRecht24 / IT-Recht Kanzlei) must review and finalize the legal texts and Data Processing Agreements (AVV / DPA).

---

## 1. Inventory of Third-Party Services Called by the Site

| # | Service / Category | Provider | Code Location | When Called | Data Transmitted | GDPR / TDDDG Notes |
|---|---|---|---|---|---|---|
| 1 | **Hosting, CDN & Serverless Functions** | Vercel Inc. | `next.config.ts`, `vercel.json`, `proxy.ts` | Every page/API request | IP address, HTTP headers, requested URL, timestamp | Execute Vercel DPA (AVV); document EU-US DPF / SCCs. |
| 2 | **PostgreSQL Database** | Neon (via Prisma) | `prisma/schema.prisma`, `lib/db.ts` | Chat API, booking API, admin console, rate limiting | Lead name, email, WhatsApp number, project summary, chat messages, booking timestamps, SHA-256 hashed IP | Verify database region (prefer EU/Frankfurt for German market) & sign Neon DPA. |
| 3 | **Web Fonts (`Inter`, `Space Grotesk`, `Cairo`)** | Self-hosted via `next/font/google` | `app/(localized)/[locale]/layout.tsx`, `app/(misc)/layout.tsx` | **Build-time only** | **None at runtime** (font files served from own domain `/_next/static/media/...`) | Privacy-friendly: no runtime connection to `fonts.googleapis.com` or `fonts.gstatic.com`. |
| 4 | **AI Chat Agent LLM Provider** | Anthropic PBC (default) or optional Google Gemini (`generativelanguage.googleapis.com`) / Groq (`api.groq.com`) | `lib/agent/runner.ts`, `lib/agent/openai-compat-adapter.ts` | Only when a visitor actively sends a message in the AI chat widget | Chat message text & recent conversation context | Document whichever provider is active in production; confirm zero-training API policy & DPA. |
| 5 | **WhatsApp Business Cloud API** | Meta Platforms Ireland Ltd. / Meta Platforms, Inc. (`graph.facebook.com`) | `lib/whatsapp/client.ts`, `lib/whatsapp/notifications.ts`, `lib/whatsapp/webhook.ts` | Only when lead/booking notifications fire (after explicit visitor consent for WhatsApp contact) | Visitor name, E.164 WhatsApp phone number, consultation time label | Ensure explicit Art. 6(1)(a) GDPR consent before calling `save_lead` / sending templates; review Meta Business DPA. |
| 6 | **External WhatsApp Links (`wa.me`)** | Meta Platforms | `components/footer.tsx`, `components/pages/contact-view.tsx` | Only if visitor clicks the link | Standard navigation to `wa.me` | External link only (no background tracking pixel). |
| 7 | **Google Maps Embed** | Google Ireland Ltd. / Google LLC (`google.com/maps/embed`) | `components/pages/contact-view.tsx` | **Gated behind a 2-click button** ("Google Maps laden" / "Load Google Maps") | **None on page load**; IP & Google cookies only after explicit user click | Previously loaded automatically via `<iframe>`; converted to a 2-click consent gate so no data flows to Google before user interaction. |
| 8 | **Bot Protection (Optional)** | Cloudflare Turnstile (`challenges.cloudflare.com`) | `components/chat/chat-widget.tsx`, `lib/security/bot-protection.ts` | Only if `BOT_PROTECTION_ENABLED=true` AND visitor opens the chat panel | Browser/device telemetry & IP address | If enabled in production, document in Datenschutzerklärung and sign Cloudflare DPA. |
| 9 | **Analytics / Ad Pixels** | **None installed** | Checked across `package.json`, `app/`, `components/` | Never | None | No Google Analytics, no Meta Pixel, no Vercel Analytics, no Hotjar. |

---

## 2. Cookies & Browser Storage Audit

| Key | Type | Scope / Lifetime | Strictly Necessary / Functional? | Purpose |
|---|---|---|---|---|
| `NEXT_LOCALE` | Cookie (`SameSite=Lax`) | `/`, 1 year | Yes (user-requested preference, § 25 Abs. 2 Nr. 2 TDDDG) | Remembers user's chosen locale (`en`, `de`, `ar`) after clicking the language switcher. |
| `corelogic_chat_session_id` | `localStorage` | Browser origin | Functional for AI chat | Identifies the visitor's chat session so conversation & booking status polling work. |
| `corelogic_chat_messages_v1` | `sessionStorage` | Browser tab | Functional for AI chat | Preserves visible chat messages across page navigation within the tab. |
| Admin auth session cookie | `HttpOnly` Cookie | `/admin/*` only | Strictly necessary | Authenticates internal administrators. |

---

## 3. Cookie / Consent Banner Assessment

- **Current recommendation:** **No site-wide cookie/consent banner is required right now**, *provided that*:
  1. No analytics, advertising, or third-party tracking scripts are added.
  2. Google Maps on `/[locale]/contact` remains behind the implemented **2-click consent gate** (never auto-loaded).
  3. Web fonts remain self-hosted via `next/font/google`.
  4. The AI chat widget only transmits user inputs when the visitor actively submits a message, and WhatsApp outreach happens only after explicit consent.
  5. If `BOT_PROTECTION_ENABLED=true` (Cloudflare Turnstile) is turned on in production, have German legal counsel confirm whether Turnstile is classified as strictly necessary (§ 25 Abs. 2 Nr. 2 TDDDG) or requires prior opt-in before opening the chat panel.
- **When a CMP banner WILL become mandatory:** Immediately if Google Analytics, Vercel Web Analytics, Meta Pixel, LinkedIn Insight Tag, YouTube/Vimeo auto-embeds, or any marketing/retargeting cookies are added in the future.

---

## 4. Owner `[TODO]` Checklist Before Removing `noindex`

- [ ] Fill all § 5 DDG fields on `app/(localized)/[locale]/impressum/page.tsx` (exact registered `UG (haftungsbeschränkt)` name, German address, managing director, `Amtsgericht` + `HRB` number, `USt-IdNr.`, German phone if available, § 18 Abs. 2 MStV responsible person).
- [ ] Replace `[TODO]` blocks on `app/(localized)/[locale]/datenschutz/page.tsx` with final wording reviewed by a German lawyer or certified German privacy tool.
- [ ] Confirm and execute DPAs (AVV) with Vercel, Neon, Anthropic (or active LLM provider), Meta, and Cloudflare (if Turnstile is enabled).
- [ ] Remove `noindex: true` from `/[locale]/impressum` and `/[locale]/datenschutz` once finalized (or keep legal pages `index, follow` per German legal preference) and add them to `app/sitemap.ts` if desired.
