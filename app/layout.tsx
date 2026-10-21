import type { Metadata } from "next";
import { Inter, Space_Grotesk, Cairo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const arabicFont = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "CoreLogic Systems | Custom Software, Web & Mobile Apps, AI Automation",
    template: "%s | CoreLogic Systems"
  },
  description: "We design and build custom business systems, web and mobile apps, and AI-powered automation for growing businesses.",
  applicationName: siteConfig.name,
  // Canonical URLs and hreflang alternates are set per page (see lib/seo.ts) so that no page
  // inherits another page's canonical.
  verification: {
    google: "-e6ABi1a2blC15Up04wIeE4IS9tD1DybkrAXJJpoRD0",
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  alternateName: siteConfig.nameAr,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/corelogic-symbol-color.svg`,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: { "@type": "PostalAddress", ...siteConfig.address },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    contactType: "customer service",
    availableLanguage: ["English", "Arabic"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  inLanguage: ["en", "ar"],
  publisher: { "@id": `${siteConfig.url}/#organization` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`dark scroll-smooth ${inter.variable} ${spaceGrotesk.variable} ${arabicFont.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased bg-background text-foreground min-h-screen"
        suppressHydrationWarning
      >
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
