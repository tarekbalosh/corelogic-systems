import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "كورلوجيك سيستمز | برمجيات مخصصة وأتمتة بالذكاء الاصطناعي",
    template: "%s | كورلوجيك سيستمز"
  },
  description: "نصمم ونبني أنظمة الأعمال وتطبيقات الويب والجوال وحلول الأتمتة بالذكاء الاصطناعي، من الفكرة حتى التشغيل والدعم للأعمال النامية.",
  alternates: {
    canonical: "https://www.corelogic-system.my/ar",
    languages: {
      "en": "https://www.corelogic-system.my",
      "ar": "https://www.corelogic-system.my/ar",
      "x-default": "https://www.corelogic-system.my"
    }
  },
  openGraph: {
    title: "كورلوجيك سيستمز | برمجيات مخصصة وأتمتة بالذكاء الاصطناعي",
    description: "نصمم ونبني أنظمة الأعمال وتطبيقات الويب والجوال وحلول الأتمتة بالذكاء الاصطناعي، من الفكرة حتى التشغيل والدعم للأعمال النامية.",
    locale: "ar_SA",
    alternateLocale: "en_US",
    type: "website",
    url: "https://www.corelogic-system.my/ar",
    siteName: "كورلوجيك سيستمز",
  },
  twitter: {
    card: "summary_large_image",
    title: "كورلوجيك سيستمز | برمجيات مخصصة وأتمتة بالذكاء الاصطناعي",
    description: "نصمم ونبني أنظمة الأعمال وتطبيقات الويب والجوال وحلول الأتمتة بالذكاء الاصطناعي، من الفكرة حتى التشغيل والدعم للأعمال النامية.",
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
            "logo": "https://www.corelogic-system.my/brand/corelogic-symbol-color.svg",
            "description": "برمجيات مخصصة وأتمتة بالذكاء الاصطناعي للأعمال النامية",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+601169397149",
              "contactType": "customer service",
              "email": "contact@corelogic-system.my",
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
