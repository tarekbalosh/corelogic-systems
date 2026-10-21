import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const title = "تطوير تطبيقات الويب المخصصة للشركات";
const description = "نبني تطبيقات ويب مخصصة ومنصات SaaS ولوحات تحكم وتكاملات API للشركات. اطلب استشارة مجانية وعرض سعر.";

export const metadata: Metadata = pageMetadata({ path: "/services/web-dev", locale: "ar", title, description });

export default function ArabicServicesWebDevLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "الرئيسية", "path": "/ar"}, {"name": "الخدمات", "path": "/ar/services"}, {"name": "تطوير تطبيقات الويب المخصصة للشركات", "path": "/ar/services/web-dev"}])} />
      <JsonLd data={serviceJsonLd({ name: "تطوير تطبيقات الويب المخصصة للشركات", description: description, path: "/ar/services/web-dev", locale: "ar" })} />
      {children}
    </>
  );
}
