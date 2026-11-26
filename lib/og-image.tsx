import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Locale } from "@/lib/i18n-config";

export const OG_SIZE = { width: 1200, height: 630 };

const ogCopy: Record<Locale, { headline: string; tagline: string; domain: string }> = {
  de: {
    headline: "Individualsoftware, Webdesign und KI-Automatisierung",
    tagline:
      "Unternehmenssoftware · Web- & Mobile-Apps · KI-Prozesse · Duisburg, NRW & DACH",
    domain: "www.corelogic-system.my/de",
  },
  en: {
    headline: "Custom software and AI automation for growing businesses",
    tagline: "Business systems · Web apps · Mobile apps · AI automation",
    domain: "www.corelogic-system.my/en",
  },
  // Satori's built-in sans font covers Latin glyphs reliably without tofu boxes;
  // keep brand/bilingual Latin tagline on the rendered PNG while HTML og:title/og:description/og:image:alt are in Arabic.
  ar: {
    headline: "CoreLogic Systems — Custom Software & AI Automation",
    tagline: "Business Systems · Web & Mobile Apps · AI Automation (EN / DE / AR)",
    domain: "www.corelogic-system.my/ar",
  },
};

/** Brand card (navy background, reversed logo) used for Open Graph and Twitter previews. */
export async function renderOgImage(locale: Locale = "en") {
  const logo = await readFile(
    path.join(process.cwd(), "public/brand/corelogic-logo-horizontal-reversed.svg"),
    "utf8"
  );
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;
  const t = ogCopy[locale] ?? ogCopy.en;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0B1F3A 0%, #12396B 100%)",
          color: "#E6ECF4",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={382} height={110} alt="" style={{ marginBottom: 56 }} />
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.15, display: "flex" }}>
          {t.headline}
        </div>
        <div style={{ fontSize: 28, marginTop: 28, color: "#9AA9BD", display: "flex" }}>
          {t.tagline}
        </div>
        <div style={{ fontSize: 28, marginTop: 48, color: "#3FB6B6", display: "flex" }}>
          {t.domain}
        </div>
      </div>
    ),
    OG_SIZE
  );
}
