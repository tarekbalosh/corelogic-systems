import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const title = "تواصل معنا واطلب عرض سعر";
const description = "تواصل مع كورلوجيك سيستمز لمناقشة البرمجيات المخصصة أو تطبيقات الويب والجوال أو الأتمتة بالذكاء الاصطناعي. عبر البريد أو الهاتف أو واتساب.";

export const metadata: Metadata = pageMetadata({ path: "/contact", locale: "ar", title, description });

export default function ArabicContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "الرئيسية", "path": "/ar"}, {"name": "تواصل معنا واطلب عرض سعر", "path": "/ar/contact"}])} />
      {children}
    </>
  );
}
