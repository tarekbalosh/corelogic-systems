import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { localizedPath, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { HomeView } from "@/components/pages/home-view";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return pageMetadata({
    path: "/",
    locale,
    absoluteTitle: true,
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
  });
}

export default async function LocalizedHomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: dict.meta.homeTitle,
          description: dict.meta.homeDescription,
          path: localizedPath("/", locale),
          locale,
        })}
      />
      <HomeView locale={locale} dict={dict.home} />
    </>
  );
}
