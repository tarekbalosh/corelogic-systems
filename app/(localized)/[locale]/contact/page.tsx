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
import { ContactView } from "@/components/pages/contact-view";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return pageMetadata({
    path: "/contact",
    locale,
    title: dict.meta.contactTitle,
    description: dict.meta.contactDescription,
  });
}

export default async function LocalizedContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: dict.meta.contactTitle,
            description: dict.meta.contactDescription,
            path: localizedPath("/contact", locale),
            locale,
          }),
          breadcrumbJsonLd([
            { name: dict.meta.breadcrumbHome, path: localizedPath("/", locale) },
            {
              name: dict.meta.breadcrumbContact,
              path: localizedPath("/contact", locale),
            },
          ]),
        ]}
      />
      <ContactView locale={locale} dict={dict.contact} />
    </>
  );
}
