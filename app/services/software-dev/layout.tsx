import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const title = "Custom Business Software Development";
const description = "Tailored business software: ERP, accounting, POS, inventory and dashboards built around your processes. Talk to CoreLogic Systems about your project.";

export const metadata: Metadata = pageMetadata({ path: "/services/software-dev", locale: "en", title, description });

export default function ServicesSoftwareDevLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "Services", "path": "/services"}, {"name": "Custom Business Software Development", "path": "/services/software-dev"}])} />
      <JsonLd data={serviceJsonLd({ name: "Custom Business Software Development", description: description, path: "/services/software-dev", locale: "en" })} />
      {children}
    </>
  );
}
