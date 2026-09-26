import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Enterprise Web Development Company",
  description: "Looking for secure, scalable web development services? CoreLogic Systems builds custom web apps for global B2B enterprises. Get a free consultation today.",
  alternates: {
    canonical: "https://www.corelogic-system.my/services/web-dev",
    languages: {
      "en": "https://www.corelogic-system.my/services/web-dev",
      "ar": "https://www.corelogic-system.my/ar/services/web-dev",
      "en-x-default": "https://www.corelogic-system.my/services/web-dev"
    }
  }
};

export default function WebDevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
