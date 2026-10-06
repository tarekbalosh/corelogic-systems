import type { Metadata } from "next";
import { Inter, Space_Grotesk, Cairo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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
  title: {
    default: "CoreLogic Systems | Custom Software & AI Automation",
    template: "%s | CoreLogic Systems"
  },
  description: "We design and build custom business systems, web and mobile apps, and AI-powered automation for growing businesses.",
  alternates: {
    canonical: "https://www.corelogic-system.my",
    languages: {
      "en": "https://www.corelogic-system.my",
      "ar": "https://www.corelogic-system.my/ar",
      "en-x-default": "https://www.corelogic-system.my"
    }
  },
  verification: {
    google: "-e6ABi1a2blC15Up04wIeE4IS9tD1DybkrAXJJpoRD0",
  }
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CoreLogic Systems",
              "url": "https://www.corelogic-system.my",
              "logo": "https://www.corelogic-system.my/brand/corelogic-symbol-color.svg",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+601169397149",
                "contactType": "customer service",
                "email": "contact@corelogic-system.my"
              },
              "sameAs": [
                "https://www.linkedin.com/company/corelogic-systems",
                "https://twitter.com/corelogicsys"
              ]
            })
          }}
        />
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
