"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Lightbulb,
  Award,
  TrendingUp,
  Cpu,
  Zap,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { buttonVariants } from "@/components/neon-button";
import { ParticleBackground } from "@/components/particle-background";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { localizedPath, type Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/i18n";

const valueIcons = [Lightbulb, Award, Zap, TrendingUp];
const reasonIcons = [Zap, TrendingUp, Cpu];

export function AboutView({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["about"];
}) {
  const isArabic = locale === "ar";
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground selection:bg-primary/30">
      <ParticleBackground />

      <div className="relative z-10 pt-32 md:pt-40 pb-32">
        {/* 1. Hero Section */}
        <section className="px-6 mb-28 md:mb-32">
          <div className="max-w-7xl mx-auto w-full min-w-0 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={false}
              animate="visible"
              variants={staggerContainer}
              className="space-y-8 min-w-0"
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl break-words hyphens-auto font-black tracking-tighter font-heading leading-tight">
                  {dict.heroTitle1} <br />
                  <span className="text-gradient">{dict.heroTitle2}</span>
                </h1>
                <p className="text-xl md:text-2xl text-foreground/60 font-medium">
                  {dict.heroSubtitle}
                </p>
              </motion.div>
              <motion.p
                variants={fadeInUp}
                className="text-lg text-foreground/70 max-w-lg leading-relaxed"
              >
                {dict.heroDescription}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: isArabic ? 5 : -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full max-w-full min-w-0"
            >
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
              <Image
                src="/about_ai_dashboard.png"
                alt={dict.imageAlt}
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 50vw, 100vw"
                width={700}
                height={700}
                className="relative z-10 w-full h-auto drop-shadow-[0_0_50px_rgba(124,58,237,0.15)] animate-float"
              />
            </motion.div>
          </div>
        </section>

        {/* 2. Company Overview */}
        <section className="px-6 mb-32 md:mb-40">
          <div className="max-w-7xl mx-auto">
            <GlassCard className="p-6 sm:p-12 md:p-20 border-primary/20 bg-primary/5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                <div className="lg:col-span-1">
                  <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tighter break-words hyphens-auto">
                    {dict.whoWeAre}
                  </h2>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed font-light">
                    {dict.whoWeAreP1}
                  </p>
                  <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed font-light">
                    {dict.whoWeAreP2}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 3. Mission & Vision */}
        <section className="px-6 mb-32 md:mb-40">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard glowColor="purple" className="h-full">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary shadow-sm">
                  <Target size={30} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                  {dict.mission}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {dict.missionDesc}
                </p>
              </div>
            </GlassCard>
            <GlassCard glowColor="cyan" className="h-full">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/15 flex items-center justify-center text-secondary shadow-sm">
                  <Eye size={30} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                  {dict.vision}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {dict.visionDesc}
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 4. Core Values */}
        <section className="px-6 mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 break-words hyphens-auto">
                {dict.coreValues}
              </h2>
              <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
                {dict.coreValuesSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {dict.values.map((v, i) => {
                const Icon = valueIcons[i % valueIcons.length];
                return (
                  <div
                    key={i}
                    className="bg-background/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/10 transition-colors shadow-sm">
                      <Icon size={26} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 break-words hyphens-auto">
                      {v.title}
                    </h3>
                    <p className="text-foreground/60 text-sm leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Why Choose Us */}
        <section className="px-6 mb-32 md:mb-40 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 break-words hyphens-auto">
                {dict.whyChooseUs}
              </h2>
              <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
                {dict.whyChooseUsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {dict.reasons.map((r, i) => {
                const Icon = reasonIcons[i % reasonIcons.length];
                return (
                  <div
                    key={i}
                    className="relative p-6 sm:p-10 bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-[2.5rem] overflow-hidden group hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)] transition-all duration-500"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

                    <div className="flex items-start gap-5 relative z-10">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
                        <Icon size={26} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-2.5 pt-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight break-words hyphens-auto">
                          {r.title}
                        </h3>
                        <p className="text-foreground/60 leading-relaxed text-sm">
                          {r.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Call To Action */}
        <section className="px-6">
          <div className="max-w-5xl mx-auto">
            <GlassCard className="text-center py-16 md:py-20 bg-gradient-to-br from-primary/5 via-white to-secondary/5 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tighter break-words hyphens-auto">
                  {dict.ctaTitle1} <br />
                  <span className="text-gradient">{dict.ctaTitle2}</span>
                </h2>
                <div className="flex justify-center">
                  <Link
                    href={localizedPath("/contact", locale)}
                    className={buttonVariants({
                      variant: "primary",
                      size: "lg",
                    })}
                  >
                    <span>{dict.ctaButton}</span>
                    <ForwardArrow
                      size={18}
                      className={`shrink-0 transition-transform duration-250 ${
                        isArabic
                          ? "group-hover:-translate-x-1"
                          : "group-hover:translate-x-1"
                      }`}
                    />
                  </Link>
                </div>
              </motion.div>
            </GlassCard>
          </div>
        </section>
      </div>
    </div>
  );
}
