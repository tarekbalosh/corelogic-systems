"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ChevronUp, Globe, Mail, Send, Share2 } from "lucide-react";
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
  /* { name: "Lawyer's Corners", href: "/legal" }, */
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#03050C] text-white relative overflow-hidden mt-32 border-t border-white/10">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 600L400 0L800 600H0Z" stroke="url(#paint0_linear)" strokeWidth="1" />
          <path d="M200 600L400 300L600 600H200Z" stroke="url(#paint1_linear)" strokeWidth="1" />
          <defs>
            <linearGradient id="paint0_linear" x1="400" y1="0" x2="400" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7C3AED" />
              <stop offset="1" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="400" y1="300" x2="400" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-10 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">

          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center gap-3">
              <div className="relative w-72 h-24 md:w-96 md:h-32 lg:w-[450px] lg:h-40 flex items-center justify-start">
                <Image
                  src="/corelogic_logo.png"
                  alt="CoreLogic Systems Logo"
                  fill
                  className="object-contain object-left brightness-0 invert opacity-90"
                />
              </div>
            </div>

            <p className="text-white/60 text-lg leading-relaxed max-w-md font-light">
              Empowering global industries with advanced multi-modal AI tools to improve automation, insight, and strategic growth outcomes.
            </p>

            <div className="space-y-3 text-white/50 text-sm max-w-md">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Menara+IQ+HSBC+Tun+Razak+Exchange+Kuala+Lumpur"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 hover:text-primary transition-colors cursor-pointer group"
              >
                <Globe className="shrink-0 w-5 h-5 text-secondary mt-0.5 group-hover:text-primary transition-colors" />
                <span>Lot C7, Menara IQ (HSBC, 17-A, Persiaran TRX, Tun Razak Exchange, 55188 Kuala Lumpur, Federal Territory of Kuala Lumpur.</span>
              </a>
              <a
                href="mailto:tarekba850@gmail.com"
                className="flex items-center gap-4 hover:text-primary transition-colors cursor-pointer group"
              >
                <Mail className="shrink-0 w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
                <span>tarekba850@gmail.com</span>
              </a>
              <a
                href="https://wa.me/601169397149"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 hover:text-primary transition-colors cursor-pointer group"
              >
                <Send className="shrink-0 w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
                <span>+601169397149</span>
              </a>
            </div>

            <div className="flex gap-6 pt-4">
              <a href="https://www.google.com/maps/search/?api=1&query=Menara+IQ+HSBC+Tun+Razak+Exchange+Kuala+Lumpur" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all shadow-[0_0_15px_rgba(124,58,237,0)] hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                <Globe size={18} />
              </a>
              <a href="mailto:tarekba850@gmail.com" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all shadow-[0_0_15px_rgba(124,58,237,0)] hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                <Mail size={18} />
              </a>
              <a href="https://wa.me/601169397149" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all shadow-[0_0_15px_rgba(124,58,237,0)] hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                <Send size={18} />
              </a>
              <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all shadow-[0_0_15px_rgba(124,58,237,0)] hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                <Share2 size={18} />
              </Link>
            </div>

            <button
              onClick={scrollToTop}
              className="group flex items-center gap-3 px-6 py-3 border border-white/10 rounded hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 text-sm font-bold tracking-widest uppercase mt-4"
            >
              <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform text-primary" />
              Back to Top
            </button>
          </div>

          {/* Site Map */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold font-heading tracking-wider">Site Map</h4>
            <ul className="space-y-4">
              {siteMap.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/50 hover:text-white transition-colors text-[15px] font-medium hover:underline underline-offset-4 decoration-primary/50">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold font-heading tracking-wider">Legal</h4>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/50 hover:text-white transition-colors text-[15px] font-medium hover:underline underline-offset-4 decoration-primary/50">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#020308] border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-10 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-[11px] font-bold tracking-widest uppercase">
            Copyright © {new Date().getFullYear()}, CoreLogic Systems Inc. All Rights Reserved.
          </p>
          <p className="text-white/30 text-[11px] font-bold tracking-widest uppercase">
            Designed with <span className="text-primary">Corelogic systems</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
