import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// Shared by /services only; each sub-page layout overrides this metadata and adds its own JSON-LD.
const title = "Software, Web, Mobile & AI Services";
const description = "Custom business software, web applications, mobile apps, AI automation and UI/UX design from CoreLogic Systems. Tell us what you need and request a quote.";

export const metadata: Metadata = pageMetadata({ path: "/services", locale: "en", title, description });

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
