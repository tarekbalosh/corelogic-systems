"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Triangle, Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
      "bg-brand-cream"
    )}>
      <div className={cn(
        "w-full max-w-7xl mx-auto h-[60px] flex items-center justify-between px-6 relative"
      )}>
        {/* Logo - left side */}
        <div className="flex items-center shrink-0 h-full">
          <Link href="/" className="relative h-full w-48 md:w-72 flex items-center">
            <Image
              src="/corelogic_logo.png"
              alt="CoreLogic Systems Logo"
              fill
              className="object-contain object-left"
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
                    "flex items-center gap-1 text-[13px] tracking-wide uppercase transition-all duration-300",
                    isActive ? "text-brand-orange font-black" : "text-brand-teal/60 hover:text-brand-orange font-bold"
                  )}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={14} className={cn("transition-transform", isDropdownOpen && "rotate-180")} />}
                </Link>

                {/* Dropdown Menu */}
                {link.hasDropdown && (
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-[38px] left-1/2 -translate-x-1/2 w-64 bg-brand-cream border border-brand-teal/10 shadow-xl z-[100]"
                      >
                        <div className="flex flex-col">
                          {services.map((service) => (
                            <Link
                              key={service.name}
                              href={service.href}
                              className={cn(
                                "px-5 py-3 text-[12px] uppercase transition-all duration-300 block",
                                pathname === service.href ? "text-brand-orange font-black" : "text-brand-teal/70 hover:text-brand-orange font-bold"
                              )}
                            >
                              {service.name}
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
            className="hidden md:flex items-center gap-2 text-[13px] font-bold tracking-wide uppercase text-brand-teal hover:text-brand-orange transition-colors"
          >
            Contact
            <Triangle size={10} className="fill-brand-orange text-brand-orange rotate-90" />
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-end text-brand-teal hover:text-brand-orange transition-colors"
          >
            <Menu size={28} />
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
              className="fixed inset-0 bg-black/50 z-[90] md:hidden"
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-screen w-[85vw] max-w-[400px] bg-brand-cream shadow-2xl z-[100] md:hidden flex flex-col"
            >
              {/* Close Button Header */}
              <div className="flex justify-end items-center px-6 h-[60px]">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-end text-brand-teal hover:text-brand-orange transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col gap-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <div key={link.name} className="flex flex-col gap-5">
                      <Link
                        href={link.href}
                        className={cn(
                          "text-2xl uppercase tracking-widest transition-all duration-300",
                          isActive ? "text-brand-orange font-black" : "text-brand-teal/70 hover:text-brand-orange font-bold"
                        )}
                      >
                        {link.name}
                      </Link>
                      
                      {link.hasDropdown && (
                        <div className="pl-5 flex flex-col gap-4 border-l-2 border-brand-teal/10">
                          {services.map(s => (
                            <Link 
                              key={s.name} 
                              href={s.href} 
                              className={cn(
                                "text-lg transition-all duration-300",
                                pathname === s.href ? "text-brand-orange font-black" : "text-brand-teal/60 hover:text-brand-orange font-bold"
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
              <div className="p-6">
                <Link
                  href="/contact"
                  className="block w-full bg-brand-teal hover:bg-brand-orange text-brand-cream text-center py-5 font-bold uppercase tracking-widest transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
