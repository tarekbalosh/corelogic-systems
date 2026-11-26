import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  localizedPath,
  pageMetadata,
  webPageJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { AboutView } from "@/components/pages/about-view";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return pageMetadata({
    path: "/about",
    locale,
    title: dict.meta.aboutTitle,
    description: dict.meta.aboutDescription,
  });
}

export default async function LocalizedAboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: dict.meta.aboutTitle,
            description: dict.meta.aboutDescription,
            path: localizedPath("/about", locale),
            locale,
          }),
          breadcrumbJsonLd([
            { name: dict.meta.breadcrumbHome, path: localizedPath("/", locale) },
            {
              name: dict.meta.breadcrumbAbout,
              path: localizedPath("/about", locale),
            },
          ]),
        ]}
      />
      <AboutView locale={locale} dict={dict.about} />
    </>
  );
}
