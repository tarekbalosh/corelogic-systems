import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const title = "About Us";
const description = "CoreLogic Systems is a Kuala Lumpur software company building custom business systems, web and mobile apps, and AI automation for growing businesses.";

export const metadata: Metadata = pageMetadata({ path: "/about", locale: "en", title, description });

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "About CoreLogic Systems", "path": "/about"}])} />
      {children}
    </>
  );
}
