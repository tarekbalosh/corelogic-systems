import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const title = "من نحن";
const description = "كورلوجيك سيستمز شركة برمجيات مقرها كوالالمبور، نبني أنظمة أعمال مخصصة وتطبيقات ويب وجوال وحلول أتمتة بالذكاء الاصطناعي للأعمال النامية.";

export const metadata: Metadata = pageMetadata({ path: "/about", locale: "ar", title, description });

export default function ArabicAboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{"name": "الرئيسية", "path": "/ar"}, {"name": "من نحن", "path": "/ar/about"}])} />
      {children}
    </>
  );
}
