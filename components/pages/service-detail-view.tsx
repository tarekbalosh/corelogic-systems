"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  Code2,
  Database,
  Globe,
  Layers,
  PenTool,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/neon-button";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { localizedPath, type Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/i18n";

export type ServiceSlug = keyof Dictionary["serviceDetails"];

const themeBySlug: Record<
  ServiceSlug,
  {
    accentText: string;
    accentBg: string;
    gradientText: string;
    heroIcon: typeof Code2;
  }
> = {
  "software-dev": {
    accentText: "text-blue-600",
    accentBg: "bg-blue-500/10",
    gradientText: "from-blue-600 to-cyan-500",
    heroIcon: Boxes,
  },
  "web-dev": {
    accentText: "text-primary",
    accentBg: "bg-primary/10",
    gradientText: "from-indigo-600 to-cyan-500",
    heroIcon: Globe,
  },
  "mobile-dev": {
    accentText: "text-violet-600",
    accentBg: "bg-violet-500/10",
    gradientText: "from-violet-600 to-indigo-500",
    heroIcon: Smartphone,
  },
  "ai-automation": {
    accentText: "text-cyan-600",
    accentBg: "bg-cyan-500/10",
    gradientText: "from-indigo-600 to-cyan-500",
    heroIcon: Bot,
  },
  design: {
    accentText: "text-pink-600",
    accentBg: "bg-pink-500/10",
    gradientText: "from-pink-500 to-purple-500",
    heroIcon: PenTool,
  },
};

const cardIcons = [Code2, Layers, Workflow, Database, ShieldCheck, Zap];

export function ServiceDetailView({
  locale,
  slug,
  dict,
}: {
  locale: Locale;
  slug: ServiceSlug;
  dict: Dictionary["serviceDetails"][ServiceSlug];
}) {
  const isArabic = locale === "ar";
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;
  const theme = themeBySlug[slug];
  const HeroIcon = theme.heroIcon;

  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden font-sans">
      {/* 1. Hero Section */}
      <section className="relative pt-36 sm:pt-44 pb-24 px-6 min-h-[78vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-background pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={false}
            animate="visible"
            variants={staggerContainer}
            className="space-y-7 text-center lg:text-start min-w-0"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md text-primary text-sm font-semibold shadow-sm border border-primary/20"
            >
              <Sparkles size={15} />
              <span>{dict.badge}</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] break-words hyphens-auto"
            >
              {dict.heroTitle1} <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
              >
                {dict.heroTitle2}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-foreground/65 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {dict.heroDescription}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Link
                href={localizedPath("/contact", locale)}
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                <span>{dict.primaryCta}</span>
                <ForwardArrow size={18} className="shrink-0" />
              </Link>
              <Link
                href="#solutions"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                <span>{dict.secondaryCta}</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Clean architectural visual card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="w-full max-w-[440px] aspect-[4/3] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)] p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div
                  className={`w-14 h-14 ${theme.accentBg} ${theme.accentText} rounded-2xl flex items-center justify-center`}
                >
                  <HeroIcon size={28} />
                </div>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-900">
                  {dict.metaTitle}
                </p>
                <div className="w-3/4 h-3 bg-slate-200 rounded-full" />
                <div className="w-full h-3 bg-slate-100 rounded-full" />
                <div className="w-5/6 h-3 bg-slate-100 rounded-full" />
              </div>
              <div className="flex flex-wrap gap-2">
                {dict.industries.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. About the Service */}
      <section className="py-20 px-6 relative z-10 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-foreground/10 bg-background text-foreground/70 font-semibold text-sm shadow-sm">
            {dict.aboutBadge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight break-words hyphens-auto">
            {dict.aboutTitle}
          </h2>
          <p className="text-foreground/65 text-lg leading-relaxed max-w-3xl mx-auto">
            {dict.aboutDescription}
          </p>
        </div>
      </section>

      {/* 3. Solutions Grid */}
      <section id="solutions" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 break-words hyphens-auto">
              {dict.solutionsTitle}
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
              {dict.solutionsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dict.solutions.map((item, idx) => {
              const Icon = cardIcons[idx % cardIcons.length];
              return (
                <div
                  key={idx}
                  className="bg-background/80 backdrop-blur-3xl p-8 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${theme.accentBg} ${theme.accentText} flex items-center justify-center mb-6 shadow-sm`}
                  >
                    <Icon size={24} strokeWidth={1.6} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 break-words hyphens-auto">
                    {item.title}
                  </h3>
                  <p className="text-foreground/65 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Features & Why Choose Us */}
      <section className="py-24 px-6 relative bg-foreground/[0.015] border-y border-foreground/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight break-words hyphens-auto">
              {dict.featuresTitle}
            </h2>
            <p className="text-foreground/65 leading-relaxed text-base md:text-lg">
              {dict.featuresSubtitle}
            </p>
            <ul className="space-y-3.5">
              {dict.whyPoints.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-foreground/85 font-medium text-sm sm:text-base"
                >
                  <div
                    className={`w-6 h-6 mt-0.5 rounded-full ${theme.accentBg} ${theme.accentText} flex items-center justify-center shrink-0`}
                  >
                    <CheckCircle2 size={14} />
                  </div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {dict.features.map((feature, idx) => {
              const Icon = cardIcons[(idx + 2) % cardIcons.length];
              return (
                <div
                  key={idx}
                  className="bg-background p-7 rounded-3xl border border-foreground/10 hover:border-primary/20 hover:shadow-md transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 shrink-0 ${theme.accentText}`}>
                      <Icon size={22} strokeWidth={1.6} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold mb-2 text-foreground break-words hyphens-auto">
                        {feature.title}
                      </h3>
                      <p className="text-foreground/65 text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Process Steps */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 break-words hyphens-auto">
              {dict.processTitle}
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
              {dict.processSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dict.processSteps.map((step) => (
              <div
                key={step.num}
                className="bg-background/60 border border-slate-200/70 p-8 rounded-3xl hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="text-4xl font-bold text-foreground/15 mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground break-words hyphens-auto">
                  {step.title}
                </h3>
                <p className="text-foreground/65 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Industries */}
      <section className="py-20 px-6 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight break-words hyphens-auto">
            {dict.industriesTitle}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {dict.industries.map((ind) => (
              <span
                key={ind}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-foreground/10 bg-background text-foreground/80 font-medium text-sm shadow-sm"
              >
                <CheckCircle2 size={15} className={theme.accentText} />
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="py-28 px-6 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="p-8 sm:p-12 md:p-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[3rem] border border-primary/10 shadow-sm space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight break-words hyphens-auto">
              {dict.ctaTitle1} <br />
              <span className="text-primary">{dict.ctaTitle2}</span>
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              {dict.ctaDescription}
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href={localizedPath("/contact", locale)}
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                <span>{dict.ctaButton}</span>
                <ForwardArrow size={18} className="shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
