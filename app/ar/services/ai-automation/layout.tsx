import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const title = "أتمتة الأعمال بالذكاء الاصطناعي";
const description = "أتمتة المهام المتكررة بالذكاء الاصطناعي: سير العمل وروبوتات المحادثة ومعالجة المستندات، بما يناسب طريقة عمل شركتك. احصل على استشارة مجانية.";

export const metadata: Metadata = pageMetadata({ path: "/services/ai-automation", locale: "ar", title, description });

export default function ArabicServicesAiAutomationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "الرئيسية", "path": "/ar"}, {"name": "الخدمات", "path": "/ar/services"}, {"name": "أتمتة الأعمال بالذكاء الاصطناعي", "path": "/ar/services/ai-automation"}])} />
      <JsonLd data={serviceJsonLd({ name: "أتمتة الأعمال بالذكاء الاصطناعي", description: description, path: "/ar/services/ai-automation", locale: "ar" })} />
      {children}
    </>
  );
}
