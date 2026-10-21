import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const title = "تطوير البرمجيات وأنظمة الأعمال المخصصة";
const description = "برمجيات أعمال مخصصة: تخطيط موارد، محاسبة، نقاط بيع، مخزون ولوحات تحكم مبنية على إجراءات عملك. تحدث مع كورلوجيك سيستمز عن مشروعك.";

export const metadata: Metadata = pageMetadata({ path: "/services/software-dev", locale: "ar", title, description });

export default function ArabicServicesSoftwareDevLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "الرئيسية", "path": "/ar"}, {"name": "الخدمات", "path": "/ar/services"}, {"name": "تطوير البرمجيات وأنظمة الأعمال المخصصة", "path": "/ar/services/software-dev"}])} />
      <JsonLd data={serviceJsonLd({ name: "تطوير البرمجيات وأنظمة الأعمال المخصصة", description: description, path: "/ar/services/software-dev", locale: "ar" })} />
      {children}
    </>
  );
}
