import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

/** Brand card (navy background, reversed logo) used for Open Graph and Twitter previews. */
export async function renderOgImage() {
  const logo = await readFile(
    path.join(process.cwd(), "public/brand/corelogic-logo-horizontal-reversed.svg"),
    "utf8"
  );
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;

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
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15, display: "flex" }}>
          Custom software and AI automation for growing businesses
        </div>
        <div style={{ fontSize: 30, marginTop: 28, color: "#9AA9BD", display: "flex" }}>
          Business systems · Web apps · Mobile apps · AI automation
        </div>
        <div style={{ fontSize: 28, marginTop: 48, color: "#3FB6B6", display: "flex" }}>
          www.corelogic-system.my
        </div>
      </div>
    ),
    OG_SIZE
  );
}
