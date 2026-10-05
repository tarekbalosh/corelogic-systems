# CoreLogic Systems website improvements: instructions for Claude Code

Read this whole file first, then execute it step by step. The site is https://www.corelogic-system.my/ (appears to be Next.js). Inspect the repo before changing anything and confirm the framework, router type (app/pages), styling system and how pages are organised.

## Ground rules

- Do not invent facts: no fake clients, numbers, certifications, awards, testimonials or uptime claims. Where real data is needed, use a clearly marked `TODO` placeholder and list it in the final report.
- Keep existing routes: `/`, `/about`, `/services`, `/contact`, `/privacy`, `/terms`.
- Work in small commits, one per task below. Run lint, type-check and build after each task.
- Do not change the company name or domain.
- Final output: a short report listing what changed, what is still a `TODO`, and anything needing the owner's decision.

## Brand tokens (use these)

Direction: "Enterprise Trust".

| Token | HEX |
|---|---|
| navy-deep (primary dark) | `#0B1F3A` |
| blue (buttons, links) | `#12396B` |
| blue-light (LOGIC wordmark) | `#3A6EA5` |
| steel (secondary text) | `#5B6B7F` |
| mist (section bg) | `#E8EDF3` |
| cloud (page bg) | `#F6F8FB` |
| line (borders) | `#D3DAE4` |
| teal (accent) | `#3FB6B6` |

Dark mode: bg `#0A1626`, surface `#12233A`, border `#223650`, text `#E6ECF4`, muted `#9AA9BD`, link `#4C8DDB`.
Fonts: Montserrat for the wordmark/headings, IBM Plex Sans and IBM Plex Sans Arabic for body (load with `next/font`). Keep contrast at WCAG AA or better.

Logo files are in `/public/brand/` (add them if missing; they are provided separately): `corelogic-logo-horizontal-color.svg`, `-reversed.svg`, `-mono-black.svg`, `corelogic-symbol-color.svg`, `-reversed.svg`, `-mono-black.svg`. Use the horizontal logo in the header (reversed on dark), the symbol as favicon/app icon, and replace `corelogic_logo.png` everywhere.

## Task 1: Fix the hero message

Problem: the hero reads like a compute-infrastructure vendor ("high-performance infrastructure and neural architectures for industrial-scale compute"), but the real offering is custom business software, web and mobile apps, and AI automation.

Replace the hero with:

- EN H1: `Custom software and AI automation for growing businesses`
- EN sub: `We design and build business systems, web and mobile apps, and AI-powered automation, from first idea to production support.`
- AR H1: `برمجيات مخصصة وأتمتة بالذكاء الاصطناعي للأعمال النامية`
- AR sub: `نصمم ونبني أنظمة الأعمال وتطبيقات الويب والجوال وحلول الأتمتة بالذكاء الاصطناعي، من الفكرة حتى التشغيل والدعم.`
- Primary CTA: `Book a free consultation` / `احجز استشارة مجانية` → `/contact`
- Secondary CTA: `View our work` / `شاهد أعمالنا` → work section

Replace the "AI Neural Brain Hologram" image with a clean, lightweight visual built from the new symbol (network of nodes around a core ring) as inline SVG, no heavy raster image.

## Task 2: Remove unverifiable statistics

- Remove the "0+ Active Clients / 0% Target Uptime / 0K+ API Calls/sec" counters.
- Remove or soften claims such as "leading", "top", "global enterprise partners", "industrial-scale datasets".
- Replace with a trust strip using only things that are true and verifiable, with placeholders: `TODO: years in operation`, `TODO: number of delivered projects`, `TODO: technologies`. If the owner has no real numbers yet, render nothing and leave the section out.
- Update the `<meta name="description">` and Open Graph text to match the new messaging, and remove the `keywords` meta tag.

## Task 3: Rebuild services

Current services are only AI. Replace the services list with six items (keep the existing card component), each with EN and AR text:

1. Custom business software (ERP, accounting, POS, inventory, dashboards)
2. Web development (company sites, portals, e-commerce)
3. Mobile apps (iOS/Android)
4. AI automation (workflow automation, chatbots, document processing)
5. Data and analytics (dashboards, reporting, integrations)
6. Maintenance and technical support

Fix the typo "IA Automation" → "AI Automation". Each card links to a section on `/services`. Keep copy short, concrete, benefit-led, and free of buzzwords.

## Task 4: Turn projects into real case studies

Current "Featured Projects" link to `*.vercel.app` login pages (accounting, restaurant POS, student management).

- Create `/work` (list) and `/work/[slug]` (detail) pages.
- Each case study: problem, solution, features, technologies, result. Use `TODO` for any result metric not provided.
- Replace the "View Case Study" external links with internal links; show the demo as a secondary "Live demo" link only if it works without login (otherwise omit, or add demo credentials as `TODO`).
- Add a note in the report suggesting a custom subdomain such as `demo.corelogic-system.my` for demos.

## Task 5: Arabic and RTL support

- Add i18n (use the framework's built-in routing, e.g. `/ar`), default locale `en`, plus an `ar` locale.
- Language switcher in the header.
- `dir="rtl"` and `lang="ar"` on Arabic pages; use logical CSS properties (`margin-inline-start`, etc.) instead of left/right; mirror directional icons only; keep numbers, code and logos LTR.
- Add `hreflang` alternates and localized metadata.
- Translate all existing site copy; keep tone professional and concise.

## Task 6: Contact, legal and footer details

- Footer legal line: replace "CoreLogic Systems Inc." with `TODO: exact registered legal entity name` (Malaysian companies usually use "Sdn. Bhd."); read it from a single constant in `config/site.ts`.
- Make the address link open a map search for the actual address (`Menara IQ, Tun Razak Exchange, Kuala Lumpur`) instead of generic Google Maps. Leave a `TODO` to confirm the address is accurate.
- Contact form: validation, spam protection (honeypot or Turnstile), success and error states, and server-side delivery to `contact@corelogic-system.my`.
- Keep the WhatsApp link; add `rel="noopener noreferrer"`.
- Check `/privacy` and `/terms` mention what data the contact form collects. Flag for owner review, do not rewrite legal terms.

## Task 7: SEO, performance and accessibility

- One H1 per page, correct heading order, descriptive alt text, visible focus states.
- Add `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph/Twitter images (use the logo on `#0B1F3A`), and `Organization` JSON-LD with the correct name, URL, logo and contact.
- Use `next/image` with sizes; remove unused large images.
- Lighthouse targets on mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

## Task 8: Domain consistency

Domain is `corelogic-system.my` (singular) while the company name is "CoreLogic Systems". Do not change the domain, but:

- Add a config constant for the canonical domain and use it everywhere.
- Add a `TODO` in the report recommending the owner reserve `corelogic-systems.my` and `corelogicsystems.my` and 301-redirect them here.

## Acceptance checklist

- [ ] Hero, services and metadata describe what the company actually does
- [ ] No fabricated numbers or unverifiable claims remain
- [ ] "AI Automation" typo fixed everywhere
- [ ] Case study pages exist; no external login-page links in the main flow
- [ ] Arabic version complete, RTL correct, language switcher works
- [ ] New logo and favicon in place; old `corelogic_logo.png` removed
- [ ] Footer legal name and address driven by config, `TODO`s listed
- [ ] Contact form works with validation and spam protection
- [ ] Sitemap, robots, canonical, hreflang, JSON-LD added
- [ ] Build passes with no lint or type errors
- [ ] Final report lists every `TODO` and open decision
