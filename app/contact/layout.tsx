import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const title = "Contact Us & Request a Quote";
const description = "Contact CoreLogic Systems to discuss custom software, web or mobile apps, or AI automation. Email, call, WhatsApp or send a project inquiry.";

export const metadata: Metadata = pageMetadata({ path: "/contact", locale: "en", title, description });

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "Contact Us & Request a Quote", "path": "/contact"}])} />
      {children}
    </>
  );
}
