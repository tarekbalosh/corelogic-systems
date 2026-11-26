import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatWidgetMount } from "@/components/chat/chat-widget-mount";
import { siteConfig } from "@/config/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "CoreLogic Systems | Custom Software, Web & Mobile Apps, AI Automation",
    template: "%s | CoreLogic Systems",
  },
  description:
    "We design and build custom business systems, web and mobile apps, and AI-powered automation for growing businesses.",
  applicationName: siteConfig.name,
  openGraph: {
    images: [
      {
        url: `${siteConfig.url}/og/en`,
        width: 1200,
        height: 630,
        alt: "CoreLogic Systems – Custom Software, Web & Mobile Apps, AI Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${siteConfig.url}/og/en`],
  },
  verification: {
    google: "-e6ABi1a2blC15Up04wIeE4IS9tD1DybkrAXJJpoRD0",
  },
};

export default function MiscRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`dark scroll-smooth ${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased bg-background text-foreground min-h-screen"
        suppressHydrationWarning
      >
        <div className="relative flex min-h-screen flex-col">
          <Navbar locale="en" />
          <main className="flex-1">{children}</main>
          <Footer locale="en" />
        </div>
        <ChatWidgetMount />
      </body>
    </html>
  );
}
