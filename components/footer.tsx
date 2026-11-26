"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronUp, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  getDirection,
  getLocaleFromPathname,
  localizedPath,
  type Locale,
} from "@/lib/i18n-config";

const footerCopy: Record<
  Locale,
  {
    description: string;
    contactUs: string;
    siteMapTitle: string;
    legal: string;
    backToTop: string;
    address: string;
    designedWith: string;
    allRights: string;
    logoAlt: string;
    emailAriaLabel: string;
    whatsappAriaLabel: string;
    siteMap: Array<{ name: string; path: string }>;
    legalLinks: Array<{ name: string; path: string }>;
  }
> = {
  en: {
    description:
      "We design and build custom business software, web and mobile apps, and practical AI automation for growing businesses.",
    contactUs: "Contact Us",
    siteMapTitle: "Site Map",
    legal: "Legal",
    backToTop: "Back to Top",
    address:
      "Lot C7, Menara IQ, Tun Razak Exchange, 55188 Kuala Lumpur, Malaysia.",
    designedWith: "Built by",
    allRights: "All Rights Reserved.",
    logoAlt: "CoreLogic Systems – Home",
    emailAriaLabel: "Email CoreLogic Systems",
    whatsappAriaLabel: "Chat on WhatsApp",
    siteMap: [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
      { name: "Our Services", path: "/services" },
      { name: "Our Projects", path: "/our-projects" },
      { name: "Contact Us", path: "/contact" },
    ],
    legalLinks: [
      { name: "Impressum (Legal Notice)", path: "/impressum" },
      { name: "Datenschutz (GDPR Notice)", path: "/datenschutz" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ],
  },
  de: {
    description:
      "Wir konzipieren und entwickeln Individualsoftware, Webdesign, Web- und Mobile-Apps sowie praxisnahe KI-Automatisierung für wachsende Unternehmen.",
    contactUs: "Kontakt",
    siteMapTitle: "Navigation",
    legal: "Rechtliches",
    backToTop: "Nach oben",
    address:
      "Lot C7, Menara IQ, Tun Razak Exchange, 55188 Kuala Lumpur, Malaysia.",
    designedWith: "Entwickelt von",
    allRights: "Alle Rechte vorbehalten.",
    logoAlt: "CoreLogic Systems – Startseite",
    emailAriaLabel: "E-Mail an CoreLogic Systems senden",
    whatsappAriaLabel: "Per WhatsApp Kontakt aufnehmen",
    siteMap: [
      { name: "Startseite", path: "/" },
      { name: "Über uns", path: "/about" },
      { name: "Leistungen", path: "/services" },
      { name: "Projekte", path: "/our-projects" },
      { name: "Kontakt", path: "/contact" },
    ],
    legalLinks: [
      { name: "Impressum", path: "/impressum" },
      { name: "Datenschutz", path: "/datenschutz" },
      { name: "Datenschutzhinweise", path: "/privacy" },
      { name: "Nutzungsbedingungen", path: "/terms" },
    ],
  },
  ar: {
    description:
      "نصمم ونطور برمجيات الأعمال المخصصة، وتطبيقات الويب والجوال، وحلول الأتمتة بالذكاء الاصطناعي للأعمال النامية.",
    contactUs: "تواصل معنا",
    siteMapTitle: "خريطة الموقع",
    legal: "روابط قانونية",
    backToTop: "العودة للأعلى",
    address:
      "لوت C7، منارة IQ، تون رازاك إكستشينج، 55188 كوالالمبور، ماليزيا.",
    designedWith: "طُوّر بواسطة",
    allRights: "جميع الحقوق محفوظة.",
    logoAlt: "كورلوجيك سيستمز – الصفحة الرئيسية",
    emailAriaLabel: "مراسلة كورلوجيك سيستمز عبر البريد الإلكتروني",
    whatsappAriaLabel: "التواصل عبر واتساب",
    siteMap: [
      { name: "الرئيسية", path: "/" },
      { name: "من نحن", path: "/about" },
      { name: "خدماتنا", path: "/services" },
      { name: "مشاريعنا", path: "/our-projects" },
      { name: "تواصل معنا", path: "/contact" },
    ],
    legalLinks: [
      { name: "بيانات الشركة (Impressum)", path: "/impressum" },
      { name: "حماية البيانات (Datenschutz)", path: "/datenschutz" },
      { name: "سياسة الخصوصية", path: "/privacy" },
      { name: "شروط الخدمة", path: "/terms" },
    ],
  },
};

export const Footer = ({ locale: propLocale }: { locale?: Locale }) => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const locale = propLocale ?? getLocaleFromPathname(pathname);
  const isArabic = locale === "ar";
  const dir = getDirection(locale);
  const t = footerCopy[locale];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      dir={dir}
      className="relative mt-32 overflow-hidden border-t border-primary/20 bg-[#0B1F3A] text-white"
    >
      {/* Blurred Orbs Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 bg-[#0B1F3A]/60 backdrop-blur-2xl">
        <div
          className={cn(
            "max-w-7xl mx-auto px-6 lg:px-10 py-24",
            isArabic && "text-right"
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Column 1: Brand & Description (spans 5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <Link href={localizedPath("/", locale)} className="inline-block">
                <div className="relative w-56 h-16 md:w-72 md:h-20 flex items-center justify-start">
                  <Image
                    src="/brand/corelogic-logo-horizontal-reversed.svg"
                    alt={t.logoAlt}
                    fill
                    className={cn(
                      "object-contain opacity-80 hover:opacity-100 transition-opacity",
                      isArabic ? "object-right" : "object-left"
                    )}
                  />
                </div>
              </Link>

              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-sm font-medium">
                {t.description}
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 pt-2">
                <a
                  href={`mailto:${siteConfig.email}`}
                  aria-label={t.emailAriaLabel}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 shadow-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-gradient-to-br hover:from-indigo-600 hover:to-violet-600 hover:border-transparent hover:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Mail size={20} />
                </a>
                <a
                  href="https://wa.me/601169397149"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.whatsappAriaLabel}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 shadow-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_10px_25px_-5px_rgba(37,211,102,0.45)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Contact Info (spans 3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <p className="text-sm font-black font-heading text-white tracking-widest uppercase mb-6">
                {t.contactUs}
              </p>
              <div className="space-y-4">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Menara+IQ,+Tun+Razak+Exchange,+Kuala+Lumpur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:shadow-md hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground group-hover:bg-primary group-hover:scale-110 transition-all">
                    <MapPin size={18} />
                  </div>
                  <span className="text-sm text-white/70 font-medium leading-relaxed group-hover:text-white transition-colors break-words">
                    {t.address}
                  </span>
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:shadow-md hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 transition-all">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm text-white/70 font-medium group-hover:text-white transition-colors break-all">
                    {siteConfig.email}
                  </span>
                </a>
              </div>
            </div>

            {/* Column 3: Site Map (spans 2 cols) */}
            <div className="lg:col-span-2 space-y-6 lg:ltr:pl-4">
              <p className="text-sm font-black font-heading text-white tracking-widest uppercase mb-6">
                {t.siteMapTitle}
              </p>
              <ul className="space-y-3">
                {t.siteMap.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={localizedPath(link.path, locale)}
                      className="group inline-flex items-center text-white/60 hover:text-primary transition-all duration-300 text-[15px] font-semibold"
                    >
                      <span
                        className={cn(
                          "w-0 h-[2px] bg-primary transition-all duration-300 rounded-full",
                          isArabic
                            ? "ml-0 group-hover:w-3 group-hover:ml-2"
                            : "mr-0 group-hover:w-3 group-hover:mr-2"
                        )}
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Legal & Back to Top (spans 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <p className="text-sm font-black font-heading text-white tracking-widest uppercase mb-6">
                {t.legal}
              </p>
              <ul className="space-y-3">
                {t.legalLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={localizedPath(link.path, locale)}
                      className="group inline-flex items-center text-white/60 hover:text-primary transition-all duration-300 text-[15px] font-semibold"
                    >
                      <span
                        className={cn(
                          "w-0 h-[2px] bg-primary transition-all duration-300 rounded-full",
                          isArabic
                            ? "ml-0 group-hover:w-3 group-hover:ml-2"
                            : "mr-0 group-hover:w-3 group-hover:mr-2"
                        )}
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="group relative inline-flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white border border-white/15 rounded-full shadow-[0_10px_25px_-5px_rgba(79,70,229,0.45),inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:shadow-[0_16px_32px_-5px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 text-sm font-semibold whitespace-nowrap cursor-pointer w-full justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ChevronUp
                    size={18}
                    className="shrink-0 group-hover:-translate-y-0.5 transition-transform duration-300"
                  />
                  <span>{t.backToTop}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-md py-6">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-start">
            <p className="text-white/40 text-[11px] font-bold tracking-widest uppercase">
              © {new Date().getFullYear()} {siteConfig.name}. {t.allRights}
            </p>
            <p className="text-white/40 text-[11px] font-bold tracking-widest uppercase">
              {t.designedWith}{" "}
              <span className="text-primary font-black ms-1">
                {siteConfig.name}
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
