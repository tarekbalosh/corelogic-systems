import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  localizedPath,
  pageMetadata,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import {
  ServiceDetailView,
  type ServiceSlug,
} from "@/components/pages/service-detail-view";

const SERVICE_SLUGS: ServiceSlug[] = [
  "software-dev",
  "web-dev",
  "mobile-dev",
  "ai-automation",
  "design",
];

function isServiceSlug(value: string): value is ServiceSlug {
  return (SERVICE_SLUGS as string[]).includes(value);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale) || !isServiceSlug(slug)) return {};
  const dict = await getDictionary(locale);
  const service = dict.serviceDetails[slug];

  return pageMetadata({
    path: `/services/${slug}`,
    locale,
    title: service.metaTitle,
    description: service.metaDescription,
  });
}

export default async function LocalizedServiceDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(locale) || !isServiceSlug(slug)) {
    notFound();
  }
  const dict = await getDictionary(locale);
  const service = dict.serviceDetails[slug];
  const servicePath = localizedPath(`/services/${slug}`, locale);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: service.metaTitle,
            description: service.metaDescription,
            path: servicePath,
            locale,
          }),
          breadcrumbJsonLd([
            { name: dict.meta.breadcrumbHome, path: localizedPath("/", locale) },
            {
              name: dict.meta.breadcrumbServices,
              path: localizedPath("/services", locale),
            },
            { name: service.metaTitle, path: servicePath },
          ]),
          serviceJsonLd({
            name: service.metaTitle,
            description: service.metaDescription,
            path: servicePath,
            locale,
          }),
        ]}
      />
      <ServiceDetailView locale={locale} slug={slug} dict={service} />
    </>
  );
}
