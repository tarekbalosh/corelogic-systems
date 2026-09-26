import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شركة حلول الأتمتة بالذكاء الاصطناعي للأعمال",
  description: "طوّر أعمالك مع خدمات الأتمتة بالذكاء الاصطناعي. نساعد الشركات في ماليزيا والخليج على تقليل التكاليف وتسريع العمليات. تواصل معنا لاستشارة مجانية!",
  alternates: {
    canonical: "https://www.corelogic-system.my/ar/services/ai-automation",
    languages: {
      "en": "https://www.corelogic-system.my/services/ai-automation",
      "ar": "https://www.corelogic-system.my/ar/services/ai-automation",
      "en-x-default": "https://www.corelogic-system.my/services/ai-automation"
    }
  }
};

export default function ArabicAiAutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
