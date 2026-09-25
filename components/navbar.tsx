"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Triangle, Menu, X, ArrowRight, Globe, Bot, Smartphone, Code2, PenTool } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NeonButton } from "./neon-button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Services", href: "/services", hasDropdown: true },
];

const services = [
  { name: "Web Application Development", description: "Modern, responsive, and scalable web apps.", href: "/services/web-dev", icon: Globe },
  { name: "AI Solutions & Automation", description: "Smart AI integration for your workflows.", href: "/services/ai-automation", icon: Bot },
  { name: "Mobile App Development", description: "Native and cross-platform mobile experiences.", href: "/services/mobile-dev", icon: Smartphone },
  { name: "Custom Software Development", description: "Tailored software built for your business needs.", href: "/services/software-dev", icon: Code2 },
  { name: "UI/UX Design", description: "Beautiful, user-centric interface design.", href: "/services/design", icon: PenTool },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500",
      scrolled ? "bg-foreground/80 backdrop-blur-xl border-b border-foreground/5 shadow-sm py-2" : "bg-transparent py-4"
    )}>
      <div className={cn(
        "w-full max-w-7xl mx-auto flex items-center justify-between px-6 relative transition-all duration-500",
        scrolled ? "h-[60px]" : "h-[70px]"
      )}>
        {/* Logo - left side */}
        <div className="flex items-center shrink-0 h-full">
          <Link href="/" className="relative h-full w-48 md:w-64 flex items-center group">
            <Image
              src="/corelogic_logo.png"
              alt="CoreLogic Systems Logo"
              fill
              className="object-contain object-left group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div
                key={link.name}
                className="relative flex flex-col items-center py-2 h-full justify-center"
                onMouseEnter={() => link.hasDropdown && setIsDropdownOpen(true)}
                onMouseLeave={() => link.hasDropdown && setIsDropdownOpen(false)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 text-[14px] tracking-wide font-semibold transition-all duration-300 group",
                    isActive ? "text-primary" : "text-foreground/70 hover:text-primary"
                  )}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={14} className={cn("transition-transform duration-300 text-foreground/40 group-hover:text-primary", isDropdownOpen && "rotate-180")} />}
                  
                  {/* Underline indicator */}
                  <span className={cn(
                    "absolute -bottom-2 left-0 w-full h-[2px] rounded-full bg-primary transition-all duration-300",
                    isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
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
                        className="absolute top-[50px] left-1/2 -translate-x-1/2 w-[420px] bg-background/90 backdrop-blur-2xl border border-foreground/10 shadow-[0_40px_80px_rgba(0,0,0,0.15)] z-[100] rounded-3xl overflow-hidden p-3"
                      >
                        <div className="flex flex-col gap-1">
                          {services.map((service) => (
                            <Link
                              key={service.name}
                              href={service.href}
                              className={cn(
                                "p-3 text-[14px] font-medium transition-all duration-300 rounded-2xl flex items-start gap-4 group/item relative overflow-hidden",
                                pathname === service.href ? "bg-primary/10 text-primary" : "hover:bg-foreground/5"
                              )}
                            >
                              <div className={cn(
                                "p-2.5 rounded-xl shrink-0 transition-all duration-300 relative z-10",
                                pathname === service.href ? "bg-primary text-primary-foreground" : "bg-foreground/5 text-foreground/60 group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:shadow-lg group-hover/item:shadow-primary/30 group-hover/item:scale-110"
                              )}>
                                <service.icon size={22} strokeWidth={1.5} />
                              </div>
                              <div className="flex flex-col gap-0.5 relative z-10">
                                <span className={cn(
                                  "font-bold transition-colors duration-300 text-[15px]",
                                  pathname === service.href ? "text-primary" : "text-foreground group-hover/item:text-primary"
                                )}>
                                  {service.name}
                                </span>
                                <span className="text-[13px] text-foreground/60 font-medium leading-relaxed group-hover/item:text-foreground/80 transition-colors duration-300">
                                  {service.description}
                                </span>
                              </div>
                              
                              {/* Hover background effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-0" />
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

        {/* Right Section: CTA & Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden md:block"
          >
            <NeonButton size="sm" variant="primary">
              Contact Us
            </NeonButton>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors active:scale-95 bg-foreground/50 border border-foreground/5 rounded-full shadow-sm"
          >
            <Menu size={20} />
          </button>
        </div>
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
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[90] md:hidden"
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-screen w-[85vw] max-w-[400px] bg-background/95 backdrop-blur-3xl shadow-2xl z-[100] md:hidden flex flex-col rounded-l-[2rem] border-l border-foreground/10"
            >
              {/* Close Button Header */}
              <div className="flex justify-end items-center px-6 h-[80px] border-b border-foreground/5">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-foreground/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <div key={link.name} className="flex flex-col gap-3">
                      <Link
                        href={link.href}
                        className={cn(
                          "text-[16px] font-medium transition-all duration-300",
                          isActive ? "text-primary font-semibold" : "text-foreground/70 hover:text-primary"
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
                                pathname === s.href ? "bg-primary/10 text-primary" : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
                              )}
                            >
                              <div className={cn(
                                "p-2 rounded-xl shrink-0 transition-colors",
                                pathname === s.href ? "bg-primary text-primary-foreground" : "bg-foreground/10 text-foreground/60"
                              )}>
                                <s.icon size={18} strokeWidth={1.5} />
                              </div>
                              <span className="text-[14px] font-medium leading-tight">
                                {s.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="p-6 border-t border-foreground/5 bg-background/50 backdrop-blur-xl">
                <Link
                  href="/contact"
                  className="block w-full"
                >
                  <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all text-sm flex items-center justify-center gap-2">
                    Contact Us
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
