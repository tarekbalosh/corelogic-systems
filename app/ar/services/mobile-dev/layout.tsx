import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أفضل شركة لتطوير تطبيقات الجوال | السعودية وماليزيا",
  description: "هل تبحث عن أفضل شركة لتطوير تطبيقات الجوال بالسعودية والخليج؟ نصمم تطبيقات سريعة، آمنة، وقابلة للتوسع للشركات والمشاريع الناشئة.",
  alternates: {
    canonical: "https://www.corelogic-system.my/ar/services/mobile-dev",
    languages: {
      "en": "https://www.corelogic-system.my/services/mobile-dev",
      "ar": "https://www.corelogic-system.my/ar/services/mobile-dev",
      "en-x-default": "https://www.corelogic-system.my/services/mobile-dev"
    }
  }
};

export default function ArabicMobileDevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
