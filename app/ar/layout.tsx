import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "كورلوجيك سيستمز | شركة تطوير برمجيات وحلول ذكاء اصطناعي",
    template: "%s | كورلوجيك سيستمز"
  },
  description: "كورلوجيك سيستمز هي شركة رائدة في تطوير البرمجيات تقدم خدمات تصميم المواقع وتطبيقات الجوال وحلول الذكاء الاصطناعي للشركات في ماليزيا والشرق الأوسط والسعودية والإمارات.",
  keywords: [
    "شركة برمجة",
    "تطوير تطبيقات الجوال",
    "حلول أتمتة الأعمال بالذكاء الاصطناعي",
    "تصميم متجر إلكتروني",
    "شركة تطوير مواقع",
    "تطوير تطبيقات السعودية",
    "برمجة مواقع ماليزيا",
    "حلول الذكاء الاصطناعي للشركات",
    "تصميم واجهات المستخدم",
    "شركة برمجة في الإمارات",
    "أفضل شركة تطوير برمجيات"
  ],
  alternates: {
    canonical: "https://www.corelogic-system.my/ar",
    languages: {
      "en": "https://www.corelogic-system.my",
      "ar": "https://www.corelogic-system.my/ar",
      "x-default": "https://www.corelogic-system.my"
    }
  },
  openGraph: {
    title: "كورلوجيك سيستمز | شركة تطوير برمجيات وحلول ذكاء اصطناعي",
    description: "كورلوجيك سيستمز هي شركة رائدة في تطوير البرمجيات تقدم خدمات تصميم المواقع وتطبيقات الجوال وحلول الذكاء الاصطناعي.",
    locale: "ar_SA",
    alternateLocale: "en_US",
    type: "website",
    url: "https://www.corelogic-system.my/ar",
    siteName: "كورلوجيك سيستمز",
  },
  twitter: {
    card: "summary_large_image",
    title: "كورلوجيك سيستمز | شركة تطوير برمجيات وحلول ذكاء اصطناعي",
    description: "كورلوجيك سيستمز هي شركة رائدة في تطوير البرمجيات تقدم خدمات تصميم المواقع وتطبيقات الجوال وحلول الذكاء الاصطناعي.",
  }
};

export default function ArabicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" lang="ar" className="rtl font-arabic">
      {/* Arabic-specific structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "كورلوجيك سيستمز",
            "alternateName": "CoreLogic Systems",
            "url": "https://www.corelogic-system.my/ar",
            "logo": "https://www.corelogic-system.my/logo.png",
            "description": "شركة رائدة في تطوير البرمجيات وحلول الذكاء الاصطناعي",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+601169397149",
              "contactType": "customer service",
              "availableLanguage": ["Arabic", "English"]
            },
            "areaServed": [
              { "@type": "Country", "name": "Saudi Arabia" },
              { "@type": "Country", "name": "United Arab Emirates" },
              { "@type": "Country", "name": "Malaysia" },
              { "@type": "Country", "name": "Qatar" },
              { "@type": "Country", "name": "Kuwait" },
              { "@type": "Country", "name": "Bahrain" }
            ],
            "sameAs": [
              "https://www.linkedin.com/company/corelogic-systems",
              "https://twitter.com/corelogicsys"
            ]
          })
        }}
      />
      {children}
    </div>
  );
}
