"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typewriter } from "./typewriter";
import { NeonButton } from "./neon-button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 px-6 min-h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-10 z-10"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-heading leading-tight">
              Custom software and <br className="hidden md:block" />
              <span className="text-gradient">AI automation</span> for growing businesses
            </h1>
            <div className="text-xl md:text-2xl font-medium text-foreground/70">
              We design and build business systems, web and mobile apps, and AI-powered automation, from first idea to production support.
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 pt-4">
            <Link href="/contact">
              <NeonButton size="lg" variant="primary">Book a free consultation</NeonButton>
            </Link>
            <Link href="#portfolio" className="flex items-center justify-center font-semibold hover:text-primary transition-colors px-6 py-3">
              View our work
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side: 3D Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative flex items-center justify-center p-8 mix-blend-screen"
        >
          {/* Animated 3D Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[120%] h-[120%] border-2 border-primary/20 rounded-full animate-[spin_8s_linear_infinite] [transform-style:preserve-3d] [transform:rotateX(60deg)]" />
            <div className="absolute w-[100%] h-[100%] border-2 border-secondary/20 rounded-full animate-[spin_12s_linear_infinite_reverse] [transform-style:preserve-3d] [transform:rotateX(-45deg)]" />
            <div className="absolute w-[80%] h-[80%] border-t-2 border-primary/40 rounded-full animate-[spin_6s_linear_infinite] [transform-style:preserve-3d] [transform:rotateX(30deg)]" />
          </div>

          {/* Hologram Pulse Effect */}
          <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />

          {/* Floating Symbol SVG */}
          <div className="animate-float flex items-center justify-center p-12 w-full h-full relative z-10" style={{ mixBlendMode: "screen" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-full max-w-[400px] h-auto drop-shadow-[0_0_50px_rgba(124,58,237,0.5)]">
              <g transform="translate(14 14) scale(1)">
                <path d="M46 18L72.6 28.5L79.1 52.2L60.8 71.2L31.2 71.2L12.9 52.2L19.4 28.5Z" fill="none" stroke="currentColor" className="text-primary/80" strokeWidth="3" strokeLinejoin="round"/>
                <path d="M46 38L46 18M52.7 41.6L72.6 28.5M53.9 47.5L79.1 52.2M50.1 52.9L60.8 71.2M41.9 52.9L31.2 71.2M38.1 47.5L12.9 52.2M39.3 41.6L19.4 28.5" fill="none" stroke="currentColor" className="text-primary/60" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="46" cy="18" r="4.5" fill="currentColor" className="text-primary"/>
                <circle cx="79.1" cy="52.2" r="4.5" fill="currentColor" className="text-primary"/>
                <circle cx="60.8" cy="71.2" r="4.5" fill="currentColor" className="text-primary"/>
                <circle cx="31.2" cy="71.2" r="4.5" fill="currentColor" className="text-primary"/>
                <circle cx="12.9" cy="52.2" r="4.5" fill="currentColor" className="text-primary"/>
                <circle cx="19.4" cy="28.5" r="4.5" fill="currentColor" className="text-primary"/>
                <circle cx="72.6" cy="28.5" r="5.5" fill="currentColor" className="text-secondary"/>
                <circle cx="46" cy="46" r="8" fill="none" stroke="currentColor" className="text-primary" strokeWidth="3"/>
                <circle cx="46" cy="46" r="3" fill="currentColor" className="text-secondary"/>
              </g>
            </svg>
          </div>

          {/* Background Geometric Shapes */}
          <motion.div 
            animate={{ 
                rotate: 360,
                y: [0, -20, 0]
            }}
            transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-10 -right-10 w-24 h-24 border border-foreground/10 rounded-lg opacity-20" 
          />
          <motion.div 
            animate={{ 
                rotate: -360,
                y: [0, 20, 0]
            }}
            transition={{
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -bottom-10 -left-10 w-32 h-32 border border-foreground/10 rounded-full opacity-20" 
          />
        </motion.div>
      </div>
    </section>
  );
};
