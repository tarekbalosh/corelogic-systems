"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, ArrowRight, ArrowLeft, Globe, Bot, Smartphone, Code2, PenTool, Rocket } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";

const navLinksEn = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Services", href: "/services", hasDropdown: true },
];

const navLinksAr = [
  { name: "الرئيسية", href: "/ar" },
  { name: "من نحن", href: "/ar/about" },
  { name: "خدماتنا", href: "/ar/services", hasDropdown: true },
];

const servicesEn = [
  { name: "Web Application Development", description: "Modern, responsive, and scalable web apps.", href: "/services/web-dev", icon: Globe },
  { name: "AI Solutions & Automation", description: "Smart AI integration for your workflows.", href: "/services/ai-automation", icon: Bot },
  { name: "Mobile App Development", description: "Native and cross-platform mobile experiences.", href: "/services/mobile-dev", icon: Smartphone },
  { name: "Custom Software Development", description: "Tailored software built for your business needs.", href: "/services/software-dev", icon: Code2 },
  { name: "UI/UX Design", description: "Beautiful, user-centric interface design.", href: "/services/design", icon: PenTool },
];

const servicesAr = [
  { name: "تطوير تطبيقات الويب", description: "تطبيقات ويب حديثة ومتجاوبة وقابلة للتوسع.", href: "/ar/services/web-dev", icon: Globe },
  { name: "حلول الذكاء الاصطناعي والأتمتة", description: "تكامل ذكي للذكاء الاصطناعي في سير عملك.", href: "/ar/services/ai-automation", icon: Bot },
  { name: "تطوير تطبيقات الجوال", description: "تجارب جوال أصلية ومتعددة المنصات.", href: "/ar/services/mobile-dev", icon: Smartphone },
  { name: "تطوير البرمجيات المخصصة", description: "برمجيات مصممة خصيصاً لاحتياجات أعمالك.", href: "/ar/services/software-dev", icon: Code2 },
  { name: "تصميم واجهة المستخدم", description: "تصميم واجهات جميلة تركز على المستخدم.", href: "/ar/services/design", icon: PenTool },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isArabic = pathname.startsWith("/ar");
  const navLinks = isArabic ? navLinksAr : navLinksEn;
  const services = isArabic ? servicesAr : servicesEn;
  const contactHref = isArabic ? "/ar/contact" : "/contact";
  const contactLabel = isArabic ? "تواصل معنا" : "Contact Us";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div 
        className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <nav className={cn(
          "pointer-events-auto flex items-center justify-center transition-all duration-500 bg-white/95 backdrop-blur-xl border-b border-slate-100 w-full shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
          scrolled ? "h-[65px]" : "h-[80px]"
        )}>
          <div className="w-full max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center shrink-0 h-full">
              <Link href={isArabic ? "/ar" : "/"} className="relative h-14 w-52 md:h-[72px] md:w-[280px] flex items-center group">
                <Image
                  src="/corelogic_logo.png"
                  alt="CoreLogic Systems Logo"
                  fill
                  className={cn(
                    "object-contain group-hover:scale-105 transition-transform duration-500",
                    isArabic ? "object-right" : "object-left"
                  )}
                  priority
                />
              </Link>
            </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 h-full">
            {navLinks.map((link) => {
              // Active link logic
              const isActive = pathname === link.href || (link.href !== (isArabic ? "/ar" : "/") && pathname.startsWith(link.href));
              
              return (
                <div
                  key={link.name}
                  className="relative flex flex-col items-center justify-center h-full group/nav"
                  onMouseEnter={() => link.hasDropdown && setIsDropdownOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setIsDropdownOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "relative flex items-center gap-1.5 text-[15px] transition-all duration-300 font-bold",
                      isActive ? "text-primary" : "text-slate-700 hover:text-primary"
                    )}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={14} className={cn("transition-transform duration-300 text-slate-400 group-hover/nav:text-primary", isDropdownOpen && "rotate-180")} />}
                    
                    {/* Underline indicator */}
                    <span className={cn(
                      "absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-primary transition-all duration-300 mx-auto",
                      isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover/nav:w-full group-hover/nav:opacity-100"
                    )} />
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
                            "absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[420px] bg-white border border-slate-100 shadow-[0_40px_80px_rgba(0,0,0,0.1)] z-[100] rounded-3xl overflow-hidden p-3",
                            isArabic && "text-right"
                          )}
                        >
                          <div className="flex flex-col gap-1">
                            {services.map((service) => (
                              <Link
                                key={service.name}
                                href={service.href}
                                className={cn(
                                  "p-3 text-[14px] font-medium transition-all duration-300 rounded-2xl flex items-start gap-4 group/item relative overflow-hidden",
                                  pathname === service.href ? "bg-primary/5 text-primary" : "hover:bg-slate-50"
                                )}
                              >
                                <div className={cn(
                                  "p-2.5 rounded-xl shrink-0 transition-all duration-300 relative z-10",
                                  pathname === service.href ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-slate-100 text-slate-500 group-hover/item:bg-primary group-hover/item:text-white group-hover/item:shadow-lg group-hover/item:shadow-primary/30 group-hover/item:scale-110"
                                )}>
                                  <service.icon size={22} strokeWidth={1.5} />
                                </div>
                                <div className="flex flex-col gap-0.5 relative z-10">
                                  <span className={cn(
                                    "font-bold transition-colors duration-300 text-[15px]",
                                    pathname === service.href ? "text-primary" : "text-slate-900 group-hover/item:text-primary"
                                  )}>
                                    {service.name}
                                  </span>
                                  <span className="text-[13px] text-slate-500 font-medium leading-relaxed group-hover/item:text-slate-600 transition-colors duration-300">
                                    {service.description}
                                  </span>
                                </div>
                              </Link>
                            ))}
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
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={isArabic ? "ar" : "en"} className="hidden md:inline-flex" />

            <Link
              href={contactHref}
              className="hidden md:block"
            >
              <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-full shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 transition-all text-[14px] tracking-wide flex items-center gap-2">
                <Rocket size={16} />
                {contactLabel}
              </button>
            </Link>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-slate-700 hover:text-primary transition-colors active:scale-95 bg-slate-50 border border-slate-100 rounded-full shadow-sm"
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
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] md:hidden"
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: isArabic ? "-100%" : "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isArabic ? "-100%" : "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "fixed top-0 h-screen w-[85vw] max-w-[400px] bg-white shadow-2xl z-[100] md:hidden flex flex-col border-slate-100",
                isArabic ? "left-0 rounded-r-[2rem] border-r" : "right-0 rounded-l-[2rem] border-l"
              )}
            >
              {/* Close Button Header */}
              <div className={cn(
                "flex items-center px-6 h-[80px] border-b border-slate-100",
                isArabic ? "justify-start" : "justify-end"
              )}>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Menu Links */}
              <div className={cn("flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6", isArabic && "text-right")}>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== (isArabic ? "/ar" : "/") && pathname.startsWith(link.href));
                  return (
                    <div key={link.name} className="flex flex-col gap-3">
                      <Link
                        href={link.href}
                        className={cn(
                          "text-[16px] transition-all duration-300",
                          isActive ? "text-primary font-bold" : "text-slate-700 font-medium hover:text-primary"
                        )}
                      >
                        {link.name}
                      </Link>
                      
                      {link.hasDropdown && (
                        <div className="flex flex-col gap-2 mt-2">
                          {services.map(s => (
                            <Link 
                              key={s.name} 
                              href={s.href} 
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-2xl transition-all duration-300",
                                pathname === s.href ? "bg-primary/5 text-primary" : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                              )}
                            >
                              <div className={cn(
                                "p-2 rounded-xl shrink-0 transition-colors",
                                pathname === s.href ? "bg-primary text-white" : "bg-white border border-slate-100 text-slate-500"
                              )}>
                                <s.icon size={18} strokeWidth={1.5} />
                              </div>
                              <span className="text-[14px] font-bold leading-tight">
                                {s.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Mobile Language Switcher */}
                <div className="pt-4 border-t border-slate-100 mt-2">
                  <LanguageSwitcher currentLocale={isArabic ? "ar" : "en"} className="w-full justify-center" />
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 backdrop-blur-xl">
                <Link
                  href={contactHref}
                  className="block w-full"
                >
                  <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all text-[15px] flex items-center justify-center gap-2">
                    <Rocket size={18} />
                    {contactLabel}
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
