import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Automation Services & Solutions for B2B",
  description: "Transform your business workflows with our customized AI automation services. Reduce costs and increase efficiency with CoreLogic Systems. Let's talk!",
  alternates: {
    canonical: "https://corelogic.my/services/ai-automation",
  }
};

export default function AiAutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
