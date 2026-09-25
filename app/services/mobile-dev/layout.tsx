import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Mobile App Development Agency",
  description: "Looking for a custom mobile app development company? We build secure, scalable cross-platform and native apps for B2B enterprises.",
  alternates: {
    canonical: "https://corelogic.my/services/mobile-dev",
  }
};

export default function MobileDevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
