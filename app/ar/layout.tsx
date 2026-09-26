import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Corelogic Systems | تطوير البرمجيات وحلول الذكاء الاصطناعي",
    template: "%s | Corelogic Systems"
  },
  description: "كورلوجيك سيستمز هي شركة رائدة في تطوير البرمجيات تقدم خدمات تصميم المواقع وتطبيقات الجوال وحلول الذكاء الاصطناعي للشركات في ماليزيا والشرق الأوسط.",
  keywords: ["شركة برمجة", "تطوير تطبيقات الجوال بالسعودية", "حلول أتمتة الأعمال بالذكاء الاصطناعي", "تصميم متجر إلكتروني"],
  alternates: {
    canonical: "https://www.corelogic-system.my/ar",
    languages: {
      "en": "https://www.corelogic-system.my",
      "ar": "https://www.corelogic-system.my/ar",
      "en-x-default": "https://www.corelogic-system.my"
    }
  }
};

export default function ArabicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" className="rtl">
      {children}
    </div>
  );
}
