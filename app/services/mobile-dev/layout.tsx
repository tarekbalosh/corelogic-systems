import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Mobile App Development Agency",
  description: "Looking for a custom mobile app development company? We build secure, scalable cross-platform and native apps for B2B enterprises globally.",
  alternates: {
    canonical: "https://www.corelogic-system.my/services/mobile-dev",
    languages: {
      "en": "https://www.corelogic-system.my/services/mobile-dev",
      "ar": "https://www.corelogic-system.my/ar/services/mobile-dev",
      "en-x-default": "https://www.corelogic-system.my/services/mobile-dev"
    }
  }
};

export default function MobileDevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
