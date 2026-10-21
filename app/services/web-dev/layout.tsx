import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const title = "Custom Web Application Development";
const description = "We build custom web applications, SaaS platforms, admin dashboards and API integrations for businesses. Request a free consultation and quote.";

export const metadata: Metadata = pageMetadata({ path: "/services/web-dev", locale: "en", title, description });

export default function ServicesWebDevLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "Services", "path": "/services"}, {"name": "Custom Web Application Development", "path": "/services/web-dev"}])} />
      <JsonLd data={serviceJsonLd({ name: "Custom Web Application Development", description: description, path: "/services/web-dev", locale: "en" })} />
      {children}
    </>
  );
}
