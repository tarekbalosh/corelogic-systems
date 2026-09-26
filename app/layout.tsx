import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Corelogic Systems | B2B Software Development & AI Solutions",
    template: "%s | Corelogic Systems"
  },
  description: "Corelogic Systems is a leading software development company offering custom enterprise web development, AI automation solutions, and mobile apps globally and in the Middle East.",
  keywords: ["custom enterprise software development company", "AI automation agency", "top mobile app developers", "شركات برمجة", "تطوير تطبيقات"],
  alternates: {
    canonical: "https://www.corelogic-system.my",
    languages: {
      "en": "https://www.corelogic-system.my",
      "ar": "https://www.corelogic-system.my/ar",
      "en-x-default": "https://www.corelogic-system.my"
    }
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
      className={`dark scroll-smooth ${inter.variable} ${spaceGrotesk.variable}`}
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
              "url": "https://corelogic.my",
              "logo": "https://corelogic.my/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+60-123-456-789",
                "contactType": "customer service"
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
