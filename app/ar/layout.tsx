import type { Metadata } from "next";
import { HtmlLang } from "@/components/html-lang";

// Canonical URLs and hreflang alternates are set per page (see lib/seo.ts), never at this level,
// so that Arabic sub-pages do not inherit the /ar canonical.
// The Organization / WebSite JSON-LD is emitted once from the root layout.
export const metadata: Metadata = {
  title: {
    default: "كورلوجيك سيستمز | برمجيات مخصصة وأتمتة بالذكاء الاصطناعي",
    template: "%s | كورلوجيك سيستمز"
  },
  description: "نصمم ونبني أنظمة الأعمال وتطبيقات الويب والجوال وحلول الأتمتة بالذكاء الاصطناعي، من الفكرة حتى التشغيل والدعم للأعمال النامية.",
};

export default function ArabicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" lang="ar" className="rtl font-arabic">
      <HtmlLang lang="ar" />
      {children}
    </div>
  );
}
