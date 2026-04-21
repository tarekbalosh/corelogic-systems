"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, User, Triangle, ArrowRight, ShieldCheck } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export default function PortalPage() {
  return (
    <div className="bg-brand-cream min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(229,154,53,0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(12,43,43,0.03),transparent_40%)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white rounded-[3rem] p-12 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-brand-teal/5 relative overflow-hidden"
      >
        {/* Background Decorative Item */}
        <div className="absolute top-0 right-0 p-8 text-brand-orange opacity-10">
            <Triangle size={120} className="rotate-45" />
        </div>

        <div className="relative z-10 space-y-10">
          {/* Logo & Header */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center text-brand-orange group-hover:rotate-12 transition-transform">
                  <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4L28 26H4L16 4Z" fill="currentColor" />
                    <path d="M16 10L24 24H8L16 10Z" fill="white" />
                  </svg>
                </div>
                <span className="text-2xl font-black tracking-[0.2em] font-heading text-brand-teal uppercase">CORELOGIC</span>
              </Link>
            </div>
            <div className="space-y-2">
                <h1 className="text-4xl font-black font-heading tracking-tighter uppercase">Client Portal</h1>
                <p className="text-brand-teal/40 font-bold uppercase text-xs tracking-widest">Authorized Access Only</p>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-brand-teal/60 ml-4">Identifier</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-teal/20 group-focus-within:text-brand-orange transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter username or email" 
                  className="w-full bg-brand-cream/50 border border-brand-teal/5 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-brand-orange focus:bg-white transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-brand-teal/60 ml-4">Passkey</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-teal/20 group-focus-within:text-brand-orange transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  className="w-full bg-brand-cream/50 border border-brand-teal/5 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-brand-orange focus:bg-white transition-all text-sm font-medium uppercase tracking-widest"
                />
              </div>
            </div>

            <button className="w-full bg-brand-teal text-white py-6 rounded-2xl font-black tracking-widest uppercase text-sm hover:bg-brand-orange transition-all hover:shadow-[0_20px_40px_rgba(12,43,43,0.15)] flex items-center justify-center gap-3 overflow-hidden group">
                <span className="group-hover:translate-x-1 transition-transform">Initialize Access</span>
                <ArrowRight size={18} className="text-brand-orange group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex justify-between items-center text-[11px] font-bold tracking-widest uppercase text-brand-teal/40">
                <Link href="#" className="hover:text-brand-orange transition-colors">Emergency Protocol</Link>
                <Link href="#" className="flex items-center gap-2 hover:text-brand-orange transition-colors border-b border-brand-orange/20 pb-1">
                    <ShieldCheck size={14} /> Recovery Systems
                </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
