import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const title = "تطوير تطبيقات الجوال iOS وأندرويد";
const description = "نصمم ونبني تطبيقات جوال مخصصة لنظامي iOS وأندرويد، أصلية أو متعددة المنصات، من النموذج الأولي حتى النشر والدعم. اطلب عرض سعر.";

export const metadata: Metadata = pageMetadata({ path: "/services/mobile-dev", locale: "ar", title, description });

export default function ArabicServicesMobileDevLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "الرئيسية", "path": "/ar"}, {"name": "الخدمات", "path": "/ar/services"}, {"name": "تطوير تطبيقات الجوال iOS وأندرويد", "path": "/ar/services/mobile-dev"}])} />
      <JsonLd data={serviceJsonLd({ name: "تطوير تطبيقات الجوال iOS وأندرويد", description: description, path: "/ar/services/mobile-dev", locale: "ar" })} />
      {children}
    </>
  );
}
