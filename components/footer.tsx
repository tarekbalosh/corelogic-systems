"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ChevronUp, Globe, Mail, Send, Share2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const siteMap = [
  { name: "Home", href: "/" },
  { name: "About us", href: "/about" },
  { name: "Our Services", href: "/services" },
  { name: "Contact Us", href: "/contact" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Services", href: "/terms" },
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-32 overflow-hidden border-t border-foreground/5 bg-background">
      {/* Premium Blurred Orbs Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[300px] bg-accent/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Glassy Overlay for the entire footer */}
      <div className="relative z-10 bg-foreground/40 backdrop-blur-3xl border-t border-foreground/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Column 1: Brand & Description (spans 5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <Link href="/" className="inline-block">
                <div className="relative w-56 h-16 md:w-72 md:h-20 flex items-center justify-start">
                  <Image
                    src="/corelogic_logo.png"
                    alt="CoreLogic Systems Logo"
                    fill
                    className="object-contain object-left brightness-0 opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              </Link>

              <p className="text-foreground/70 text-base md:text-lg leading-relaxed max-w-sm font-medium">
                Empowering global industries with advanced multi-modal AI tools to improve automation, insight, and strategic growth outcomes.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 pt-2">
                <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white border border-foreground/5 shadow-sm flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/30 hover:shadow-[0_8px_20px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300">
                  <Globe size={20} />
                </a>
                <a href="mailto:tarekba850@gmail.com" className="w-12 h-12 rounded-2xl bg-white border border-foreground/5 shadow-sm flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/30 hover:shadow-[0_8px_20px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300">
                  <Mail size={20} />
                </a>
                <a href="https://wa.me/601169397149" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white border border-foreground/5 shadow-sm flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/30 hover:shadow-[0_8px_20px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300">
                  <Send size={20} />
                </a>
                <Link href="#" className="w-12 h-12 rounded-2xl bg-white border border-foreground/5 shadow-sm flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/30 hover:shadow-[0_8px_20px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300">
                  <Share2 size={20} />
                </Link>
              </div>
            </div>

            {/* Column 2: Contact Info (spans 3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <h4 className="text-sm font-black text-foreground tracking-widest uppercase mb-6">Contact Us</h4>
              <div className="space-y-4">
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-foreground/50 border border-foreground/60 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300"
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <MapPin size={18} />
                  </div>
                  <span className="text-sm text-foreground/70 font-medium leading-relaxed group-hover:text-foreground transition-colors">
                    Lot C7, Menara IQ, Tun Razak Exchange, 55188 Kuala Lumpur, Malaysia.
                  </span>
                </a>
                <a
                  href="mailto:tarekba850@gmail.com"
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-foreground/50 border border-foreground/60 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300"
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm text-foreground/70 font-medium group-hover:text-foreground transition-colors">
                    tarekba850@gmail.com
                  </span>
                </a>
              </div>
            </div>

            {/* Column 3: Site Map (spans 2 cols) */}
            <div className="lg:col-span-2 space-y-6 lg:pl-8">
              <h4 className="text-sm font-black text-foreground tracking-widest uppercase mb-6">Site Map</h4>
              <ul className="space-y-3">
                {siteMap.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group inline-flex items-center text-foreground/60 hover:text-primary transition-all duration-300 text-[15px] font-semibold"
                    >
                      <span className="w-0 h-[2px] bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 rounded-full" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Legal & Back to Top (spans 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-sm font-black text-foreground tracking-widest uppercase mb-6">Legal</h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group inline-flex items-center text-foreground/60 hover:text-primary transition-all duration-300 text-[15px] font-semibold"
                    >
                      <span className="w-0 h-[2px] bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 rounded-full" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="pt-8">
                <button
                  onClick={scrollToTop}
                  className="group relative flex items-center gap-3 px-6 py-4 bg-foreground text-background rounded-full hover:shadow-[0_10px_30px_rgba(15,23,42,0.2)] hover:-translate-y-1 transition-all duration-300 text-xs font-black tracking-widest uppercase overflow-hidden w-full justify-center"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <ChevronUp size={18} className="relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
                  <span className="relative z-10">Back to Top</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-foreground/5 bg-foreground/50 backdrop-blur-md py-6">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-foreground/50 text-[11px] font-bold tracking-widest uppercase">
              Copyright © {new Date().getFullYear()}, CoreLogic Systems Inc. All Rights Reserved.
            </p>
            <p className="text-foreground/50 text-[11px] font-bold tracking-widest uppercase">
              Designed with <span className="text-primary font-black ml-1">Corelogic Systems</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
