import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const title = "UI/UX Design for Web & Mobile Apps";
const description = "User-centred UI/UX design for web and mobile products: research, wireframes, prototypes and design systems. Request a free design consultation.";

export const metadata: Metadata = pageMetadata({ path: "/services/design", locale: "en", title, description });

export default function ServicesDesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "Services", "path": "/services"}, {"name": "UI/UX Design for Web & Mobile Apps", "path": "/services/design"}])} />
      <JsonLd data={serviceJsonLd({ name: "UI/UX Design for Web & Mobile Apps", description: description, path: "/services/design", locale: "en" })} />
      {children}
    </>
  );
}
