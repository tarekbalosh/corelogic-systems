import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Blog & Insights | CoreLogic Systems",
  description: "Read the latest insights on enterprise web development, AI automation, and custom mobile app solutions from CoreLogic Systems experts.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-32 pb-24">
      {children}
    </div>
  );
}
