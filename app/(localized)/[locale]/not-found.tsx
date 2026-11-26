"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/neon-button";
import {
  getLocaleFromPathname,
  localizedPath,
  type Locale,
} from "@/lib/i18n-config";

const copy: Record<
  Locale,
  { heading: string; body: string; homeLabel: string; contactLabel: string }
> = {
  de: {
    heading: "Seite nicht gefunden",
    body: "Die angeforderte Seite wurde leider nicht gefunden oder wurde verschoben.",
    homeLabel: "Zur Startseite",
    contactLabel: "Kontakt",
  },
  en: {
    heading: "Page not found",
    body: "The page you requested could not be found or may have been moved.",
    homeLabel: "Back to Home",
    contactLabel: "Contact Us",
  },
  ar: {
    heading: "الصفحة غير موجودة",
    body: "عذراً، تعذّر العثور على الصفحة المطلوبة أو ربما تم نقلها.",
    homeLabel: "العودة للرئيسية",
    contactLabel: "تواصل معنا",
  },
};

export default function LocalizedNotFound() {
  const pathname = usePathname() || "/en";
  const locale = getLocaleFromPathname(pathname);
  const t = copy[locale];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-20 text-center">
      <div className="max-w-md space-y-6">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t.heading}
        </h1>
        <p className="text-foreground/60">{t.body}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href={localizedPath("/", locale)}
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            {t.homeLabel}
          </Link>
          <Link
            href={localizedPath("/contact", locale)}
            className={buttonVariants({ variant: "secondary", size: "md" })}
          >
            {t.contactLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
