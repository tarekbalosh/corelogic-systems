import type { Metadata } from "next";

// Not part of the public marketing site (placeholder / unverified content or a login gateway).
// "noindex" keeps it out of Google while the page stays reachable. Remove once the content is real.
export const metadata: Metadata = {
  title: "Client Portal",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
