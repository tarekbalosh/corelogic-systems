import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Automation Services & Solutions Company",
  description: "Transform your business with custom AI automation solutions. Corelogic Systems helps global enterprises streamline workflows and reduce costs. Get a free consultation!",
  alternates: {
    canonical: "https://www.corelogic-system.my/services/ai-automation",
    languages: {
      "en": "https://www.corelogic-system.my/services/ai-automation",
      "ar": "https://www.corelogic-system.my/ar/services/ai-automation",
      "en-x-default": "https://www.corelogic-system.my/services/ai-automation"
    }
  }
};

export default function AiAutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
