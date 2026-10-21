import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const title = "تصميم واجهات وتجربة المستخدم UI/UX";
const description = "تصميم UI/UX يركز على المستخدم لمنتجات الويب والجوال: بحث وهياكل أولية ونماذج تفاعلية وأنظمة تصميم. اطلب استشارة تصميم مجانية.";

export const metadata: Metadata = pageMetadata({ path: "/services/design", locale: "ar", title, description });

export default function ArabicServicesDesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "الرئيسية", "path": "/ar"}, {"name": "الخدمات", "path": "/ar/services"}, {"name": "تصميم واجهات وتجربة المستخدم UI/UX", "path": "/ar/services/design"}])} />
      <JsonLd data={serviceJsonLd({ name: "تصميم واجهات وتجربة المستخدم UI/UX", description: description, path: "/ar/services/design", locale: "ar" })} />
      {children}
    </>
  );
}
