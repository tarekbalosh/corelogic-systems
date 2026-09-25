"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Triangle, Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NeonButton } from "./neon-button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Services", href: "/services", hasDropdown: true },
];

const services = [
  { name: "Web Application Development", href: "/services/web-dev" },
  { name: "AI Solutions & Automation", href: "/services/ai-automation" },
  { name: "Mobile App Development", href: "/services/mobile-dev" },
  { name: "Custom Software Development", href: "/services/software-dev" },
  { name: "UI/UX Design", href: "/services/design" },
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
                        className="absolute top-[40px] left-1/2 -translate-x-1/2 w-72 bg-foreground/95 backdrop-blur-xl border border-foreground/5 shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-[100] rounded-2xl overflow-hidden p-2"
                      >
                        <div className="flex flex-col">
                          {services.map((service) => (
                            <Link
                              key={service.name}
                              href={service.href}
                              className={cn(
                                "px-4 py-3 text-[13px] font-medium transition-all duration-300 rounded-xl flex items-center justify-between group/item",
                                pathname === service.href ? "bg-primary/5 text-primary" : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                              )}
                            >
                              {service.name}
                              <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-primary" />
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
              className="fixed top-0 right-0 h-screen w-[85vw] max-w-[400px] bg-white shadow-2xl z-[100] md:hidden flex flex-col rounded-l-3xl"
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
              <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col gap-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <div key={link.name} className="flex flex-col gap-4">
                      <Link
                        href={link.href}
                        className={cn(
                          "text-xl font-bold tracking-wide transition-all duration-300",
                          isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                        )}
                      >
                        {link.name}
                      </Link>
                      
                      {link.hasDropdown && (
                        <div className="pl-4 flex flex-col gap-4 border-l-2 border-foreground/10 ml-2">
                          {services.map(s => (
                            <Link 
                              key={s.name} 
                              href={s.href} 
                              className={cn(
                                "text-[15px] font-medium transition-all duration-300 leading-tight",
                                pathname === s.href ? "text-primary" : "text-foreground/60 hover:text-primary"
                              )}
                            >
                              {s.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="p-8 border-t border-foreground/5 bg-background/50">
                <Link
                  href="/contact"
                  className="block w-full"
                >
                  <NeonButton size="lg" variant="primary" className="w-full">
                    Contact Us
                  </NeonButton>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
