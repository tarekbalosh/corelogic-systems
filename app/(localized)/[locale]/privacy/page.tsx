import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ParticleBackground } from "@/components/particle-background";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { localizedPath, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return pageMetadata({
    path: "/privacy",
    locale,
    title: dict.meta.privacyTitle,
    description: dict.meta.privacyDescription,
  });
}

export default async function LocalizedPrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <JsonLd
        data={webPageJsonLd({
          name: dict.meta.privacyTitle,
          description: dict.meta.privacyDescription,
          path: localizedPath("/privacy", locale),
          locale,
        })}
      />
      <ParticleBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 break-words hyphens-auto">
          {dict.privacy.title}
        </h1>
        <div className="space-y-6 text-foreground/80 leading-relaxed text-lg">
          <p>{dict.privacy.intro}</p>
          <p>
            <Link
              href={localizedPath("/datenschutz", locale)}
              className="text-primary font-semibold underline underline-offset-4 hover:text-primary-hover"
            >
              {dict.privacy.datenschutzLinkLabel}
            </Link>
          </p>
          {dict.privacy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground break-words hyphens-auto">
                {section.heading}
              </h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
