import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const title = "Mobile App Development (iOS & Android)";
const description = "We design and build custom iOS and Android apps, native or cross-platform, from first prototype to store release and support. Request a quote.";

export const metadata: Metadata = pageMetadata({ path: "/services/mobile-dev", locale: "en", title, description });

export default function ServicesMobileDevLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "Services", "path": "/services"}, {"name": "Mobile App Development (iOS & Android)", "path": "/services/mobile-dev"}])} />
      <JsonLd data={serviceJsonLd({ name: "Mobile App Development (iOS & Android)", description: description, path: "/services/mobile-dev", locale: "en" })} />
      {children}
    </>
  );
}
