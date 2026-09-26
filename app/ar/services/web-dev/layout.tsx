import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شركة تطوير وبرمجة مواقع ويب للشركات",
  description: "ابحث عن أفضل شركة لتطوير مواقع الويب المخصصة للشركات في ماليزيا والخليج. نقدم حلولاً آمنة وقابلة للتوسع. تواصل معنا الآن!",
  alternates: {
    canonical: "https://www.corelogic-system.my/ar/services/web-dev",
    languages: {
      "en": "https://www.corelogic-system.my/services/web-dev",
      "ar": "https://www.corelogic-system.my/ar/services/web-dev",
      "en-x-default": "https://www.corelogic-system.my/services/web-dev"
    }
  }
};

export default function ArabicWebDevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
