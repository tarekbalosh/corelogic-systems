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
import { ServicesView } from "@/components/pages/services-view";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return pageMetadata({
    path: "/services",
    locale,
    title: dict.meta.servicesTitle,
    description: dict.meta.servicesDescription,
  });
}

export default async function LocalizedServicesPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: dict.meta.servicesTitle,
            description: dict.meta.servicesDescription,
            path: localizedPath("/services", locale),
            locale,
          }),
          breadcrumbJsonLd([
            { name: dict.meta.breadcrumbHome, path: localizedPath("/", locale) },
            {
              name: dict.meta.breadcrumbServices,
              path: localizedPath("/services", locale),
            },
          ]),
        ]}
      />
      <ServicesView locale={locale} dict={dict.servicesPage} />
    </>
  );
}
