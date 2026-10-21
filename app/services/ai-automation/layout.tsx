import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const title = "AI Automation for Business Workflows";
const description = "Automate repetitive work with AI: workflow automation, chatbots and document processing, built around how your business actually runs. Get a free consultation.";

export const metadata: Metadata = pageMetadata({ path: "/services/ai-automation", locale: "en", title, description });

export default function ServicesAiAutomationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "Services", "path": "/services"}, {"name": "AI Automation for Business Workflows", "path": "/services/ai-automation"}])} />
      <JsonLd data={serviceJsonLd({ name: "AI Automation for Business Workflows", description: description, path: "/services/ai-automation", locale: "en" })} />
      {children}
    </>
  );
}
