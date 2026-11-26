import { renderOgImage } from "@/lib/og-image";
import { hasLocale, locales, type Locale } from "@/lib/i18n-config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ locale: string }> }
) {
  const { locale } = await context.params;
  const resolved: Locale = hasLocale(locale) ? locale : "en";
  const imageResponse = await renderOgImage(resolved);
  imageResponse.headers.set(
    "Cache-Control",
    "public, max-age=31536000, immutable"
  );
  return imageResponse;
}
