import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// Blog index. Individual articles set their own metadata.
export const metadata: Metadata = pageMetadata({
  path: "/blog",
  locale: "en",
  hasTranslation: false,
  title: "Tech Blog & Insights",
  description: "Insights on custom software, web and mobile development, and AI automation for businesses from the CoreLogic Systems team.",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-32 pb-24">
      {children}
    </div>
  );
}
