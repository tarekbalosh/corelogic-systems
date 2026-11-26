"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  Globe,
  Bot,
  Smartphone,
  Code2,
  PenTool,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { buttonVariants } from "./neon-button";
import {
  getDirection,
  getLocaleFromPathname,
  localizedPath,
  type Locale,
} from "@/lib/i18n-config";

const navConfig: Record<
  Locale,
  {
    links: Array<{ name: string; path: string; hasDropdown?: boolean }>;
    services: Array<{
      name: string;
      description: string;
      path: string;
      icon: typeof Globe;
    }>;
    contactLabel: string;
    logoAlt: string;
    openMenuLabel: string;
    closeMenuLabel: string;
  }
> = {
  en: {
    links: [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
      { name: "Our Services", path: "/services", hasDropdown: true },
      { name: "Our Projects", path: "/our-projects" },
    ],
    services: [
      {
        name: "Web Application Development",
        description: "Modern, responsive, and scalable web apps.",
        path: "/services/web-dev",
        icon: Globe,
      },
      {
        name: "AI Solutions & Automation",
        description: "Smart AI integration for your workflows.",
        path: "/services/ai-automation",
        icon: Bot,
      },
      {
        name: "Mobile App Development",
        description: "Native and cross-platform mobile experiences.",
        path: "/services/mobile-dev",
        icon: Smartphone,
      },
      {
        name: "Custom Software Development",
        description: "Tailored software built for your business needs.",
        path: "/services/software-dev",
        icon: Code2,
      },
      {
        name: "UI/UX Design",
        description: "Beautiful, user-centric interface design.",
        path: "/services/design",
        icon: PenTool,
      },
    ],
    contactLabel: "Contact Us",
    logoAlt: "CoreLogic Systems – Home",
    openMenuLabel: "Open menu",
    closeMenuLabel: "Close menu",
  },
  de: {
    links: [
      { name: "Startseite", path: "/" },
      { name: "Über uns", path: "/about" },
      { name: "Leistungen", path: "/services", hasDropdown: true },
      { name: "Projekte", path: "/our-projects" },
    ],
    services: [
      {
        name: "Webanwendungen",
        description: "Moderne, responsive und skalierbare Web-Apps.",
        path: "/services/web-dev",
        icon: Globe,
      },
      {
        name: "KI-Lösungen & Automatisierung",
        description: "Intelligente KI-Integration für Ihre Abläufe.",
        path: "/services/ai-automation",
        icon: Bot,
      },
      {
        name: "Mobile-App-Entwicklung",
        description: "Native und plattformübergreifende Apps für iOS & Android.",
        path: "/services/mobile-dev",
        icon: Smartphone,
      },
      {
        name: "Individuelle Softwareentwicklung",
        description: "Maßgeschneiderte Software für Ihre Geschäftsprozesse.",
        path: "/services/software-dev",
        icon: Code2,
      },
      {
        name: "UI/UX-Design",
        description: "Durchdachte, nutzerzentrierte Oberflächen.",
        path: "/services/design",
        icon: PenTool,
      },
    ],
    contactLabel: "Kontakt",
    logoAlt: "CoreLogic Systems – Startseite",
    openMenuLabel: "Menü öffnen",
    closeMenuLabel: "Menü schließen",
  },
  ar: {
    links: [
      { name: "الرئيسية", path: "/" },
      { name: "من نحن", path: "/about" },
      { name: "خدماتنا", path: "/services", hasDropdown: true },
      { name: "مشاريعنا", path: "/our-projects" },
    ],
    services: [
      {
        name: "تطوير تطبيقات الويب",
        description: "تطبيقات ويب حديثة ومتجاوبة وقابلة للتوسع.",
        path: "/services/web-dev",
        icon: Globe,
      },
      {
        name: "حلول الذكاء الاصطناعي والأتمتة",
        description: "تكامل ذكي للذكاء الاصطناعي في سير عملك.",
        path: "/services/ai-automation",
        icon: Bot,
      },
      {
        name: "تطوير تطبيقات الجوال",
        description: "تجارب جوال أصلية ومتعددة المنصات.",
        path: "/services/mobile-dev",
        icon: Smartphone,
      },
      {
        name: "تطوير البرمجيات المخصصة",
        description: "برمجيات مصممة خصيصاً لاحتياجات أعمالك.",
        path: "/services/software-dev",
        icon: Code2,
      },
      {
        name: "تصميم واجهة المستخدم",
        description: "تصميم واجهات جميلة تركز على المستخدم.",
        path: "/services/design",
        icon: PenTool,
      },
    ],
    contactLabel: "تواصل معنا",
    logoAlt: "كورلوجيك سيستمز – الصفحة الرئيسية",
    openMenuLabel: "فتح القائمة",
    closeMenuLabel: "إغلاق القائمة",
  },
};

export const Navbar = ({ locale: propLocale }: { locale?: Locale }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const locale = propLocale ?? getLocaleFromPathname(pathname);
  const isArabic = locale === "ar";
  const dir = getDirection(locale);
  const cfg = navConfig[locale];
  const homeHref = localizedPath("/", locale);
  const contactHref = localizedPath("/contact", locale);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none"
        dir={dir}
      >
        <nav
          className={cn(
            "pointer-events-auto flex items-center justify-center transition-all duration-500 bg-white/95 backdrop-blur-xl border-b border-slate-100 w-full shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
            scrolled ? "h-[65px]" : "h-[80px]"
          )}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4 h-full">
            {/* Logo */}
            <div className="flex items-center shrink-0 h-full">
              <Link
                href={homeHref}
                className="relative h-12 w-44 sm:h-14 sm:w-48 lg:h-[68px] lg:w-[240px] flex items-center group"
              >
                <Image
                  src="/brand/corelogic-logo-horizontal-color.svg"
                  alt={cfg.logoAlt}
                  fill
                  className={cn(
                    "object-contain group-hover:scale-105 transition-transform duration-500",
                    isArabic ? "object-right" : "object-left"
                  )}
                  loading="eager"
                />
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
              {cfg.links.map((link) => {
                const href = localizedPath(link.path, locale);
                const isActive =
                  pathname === href ||
                  (link.path !== "/" && pathname.startsWith(`${href}/`));

                return (
                  <div
                    key={link.path}
                    className="relative flex flex-col items-center justify-center h-full group/nav"
                    onMouseEnter={() =>
                      link.hasDropdown && setIsDropdownOpen(true)
                    }
                    onMouseLeave={() =>
                      link.hasDropdown && setIsDropdownOpen(false)
                    }
                  >
                    <Link
                      href={href}
                      className={cn(
                        "relative flex items-center gap-1.5 text-[15px] whitespace-nowrap transition-all duration-300 font-bold",
                        isActive
                          ? "text-primary"
                          : "text-slate-700 hover:text-primary"
                      )}
                    >
                      {link.name}
                      {link.hasDropdown && (
                        <ChevronDown
                          size={14}
                          className={cn(
                            "transition-transform duration-300 text-slate-400 group-hover/nav:text-primary",
                            isDropdownOpen && "rotate-180"
                          )}
                        />
                      )}

                      <span
                        className={cn(
                          "absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-primary transition-all duration-300 mx-auto",
                          isActive
                            ? "w-full opacity-100"
                            : "w-0 opacity-0 group-hover/nav:w-full group-hover/nav:opacity-100"
                        )}
                      />
                    </Link>

                    {/* Dropdown Menu */}
                    {link.hasDropdown && (
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              "absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[440px] bg-white border border-slate-100 shadow-[0_40px_80px_rgba(0,0,0,0.1)] z-[100] rounded-3xl overflow-hidden p-3",
                              isArabic && "text-right"
                            )}
                          >
                            <div className="flex flex-col gap-1">
                              {cfg.services.map((service) => {
                                const serviceHref = localizedPath(
                                  service.path,
                                  locale
                                );
                                return (
                                  <Link
                                    key={service.path}
                                    href={serviceHref}
                                    className={cn(
                                      "p-3 text-[14px] font-medium transition-all duration-300 rounded-2xl flex items-start gap-4 group/item relative overflow-hidden",
                                      pathname === serviceHref
                                        ? "bg-primary/5 text-primary"
                                        : "hover:bg-slate-50"
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "p-2.5 rounded-xl shrink-0 transition-all duration-300 relative z-10",
                                        pathname === serviceHref
                                          ? "bg-primary text-white shadow-md shadow-primary/20"
                                          : "bg-slate-100 text-slate-500 group-hover/item:bg-primary group-hover/item:text-white group-hover/item:shadow-lg group-hover/item:shadow-primary/30 group-hover/item:scale-110"
                                      )}
                                    >
                                      <service.icon size={22} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col gap-0.5 relative z-10 min-w-0">
                                      <span
                                        className={cn(
                                          "font-bold transition-colors duration-300 text-[15px]",
                                          pathname === serviceHref
                                            ? "text-primary"
                                            : "text-slate-900 group-hover/item:text-primary"
                                        )}
                                      >
                                        {service.name}
                                      </span>
                                      <span className="text-[13px] text-slate-500 font-medium leading-relaxed group-hover/item:text-slate-600 transition-colors duration-300">
                                        {service.description}
                                      </span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Section: Lang Switcher, CTA & Hamburger */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <LanguageSwitcher
                currentLocale={locale}
                className="hidden lg:inline-flex"
              />

              <Link
                href={contactHref}
                className={buttonVariants({
                  variant: "primary",
                  size: "sm",
                  className: "hidden lg:inline-flex whitespace-nowrap",
                })}
              >
                <Rocket
                  size={16}
                  className="shrink-0 transition-transform duration-250 group-hover:-translate-y-0.5"
                />
                <span>{cfg.contactLabel}</span>
              </Link>

              {/* Hamburger Button */}
              <button
                type="button"
                aria-label={cfg.openMenuLabel}
                onClick={() => setIsMobileMenuOpen(true)}
                className={buttonVariants({
                  variant: "icon",
                  size: "md",
                  className: "lg:hidden",
                })}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] lg:hidden"
            />

            <motion.div
              dir={dir}
              initial={{ x: isArabic ? "-100%" : "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isArabic ? "-100%" : "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "fixed top-0 h-screen w-[85vw] max-w-[400px] bg-white shadow-2xl z-[100] lg:hidden flex flex-col border-slate-100",
                isArabic
                  ? "left-0 rounded-r-[2rem] border-r"
                  : "right-0 rounded-l-[2rem] border-l"
              )}
            >
              {/* Close Button Header */}
              <div
                className={cn(
                  "flex items-center px-6 h-[80px] border-b border-slate-100",
                  isArabic ? "justify-start" : "justify-end"
                )}
              >
                <button
                  type="button"
                  aria-label={cfg.closeMenuLabel}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={buttonVariants({ variant: "icon", size: "md" })}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Links */}
              <div
                className={cn(
                  "flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6",
                  isArabic && "text-right"
                )}
              >
                {cfg.links.map((link) => {
                  const href = localizedPath(link.path, locale);
                  const isActive =
                    pathname === href ||
                    (link.path !== "/" && pathname.startsWith(`${href}/`));

                  return (
                    <div key={link.path} className="flex flex-col gap-3">
                      <Link
                        href={href}
                        className={cn(
                          "text-[16px] transition-all duration-300",
                          isActive
                            ? "text-primary font-bold"
                            : "text-slate-700 font-medium hover:text-primary"
                        )}
                      >
                        {link.name}
                      </Link>

                      {link.hasDropdown && (
                        <div className="flex flex-col gap-2 mt-2">
                          {cfg.services.map((s) => {
                            const serviceHref = localizedPath(s.path, locale);
                            return (
                              <Link
                                key={s.path}
                                href={serviceHref}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-2xl transition-all duration-300",
                                  pathname === serviceHref
                                    ? "bg-primary/5 text-primary"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                              >
                                <div
                                  className={cn(
                                    "p-2 rounded-xl shrink-0 transition-colors",
                                    pathname === serviceHref
                                      ? "bg-primary text-white"
                                      : "bg-white border border-slate-100 text-slate-500"
                                  )}
                                >
                                  <s.icon size={18} strokeWidth={1.5} />
                                </div>
                                <span className="text-[14px] font-bold leading-tight">
                                  {s.name}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Mobile Language Switcher */}
                <div className="pt-4 border-t border-slate-100 mt-2">
                  <LanguageSwitcher
                    currentLocale={locale}
                    className="w-full justify-center"
                  />
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 backdrop-blur-xl">
                <Link
                  href={contactHref}
                  className={buttonVariants({
                    variant: "primary",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  <Rocket size={18} className="shrink-0" />
                  <span>{cfg.contactLabel}</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
