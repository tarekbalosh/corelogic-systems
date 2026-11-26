"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Smartphone,
  Layout,
  Terminal,
  Bot,
  Sparkles,
} from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { buttonVariants } from "@/components/neon-button";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { localizedPath, type Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/i18n";

const serviceVisuals = [
  {
    icon: Code2,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Bot,
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
  {
    icon: Smartphone,
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: Terminal,
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-500",
  },
  {
    icon: Layout,
    gradient: "from-primary/20 to-primary-foreground/20",
    iconColor: "text-primary",
  },
];

export function ServicesView({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["servicesPage"];
}) {
  const isArabic = locale === "ar";
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <ParticleBackground />

      <div className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={false}
          animate="visible"
          variants={staggerContainer}
          className="space-y-20"
        >
          {/* Hero */}
          <motion.div
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2 shadow-sm border border-primary/20">
              <Sparkles size={16} />
              <span>{dict.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 break-words hyphens-auto">
              {dict.heroTitle1}{" "}
              <span className="text-primary">{dict.heroTitle2}</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
              {dict.heroSubtitle}
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dict.items.map((s, i) => {
              const visual = serviceVisuals[i % serviceVisuals.length];
              const Icon = visual.icon;
              return (
                <motion.div
                  key={s.slug}
                  variants={fadeInUp}
                  className={cn(
                    "relative group bg-background/80 backdrop-blur-3xl p-8 sm:p-10 rounded-[2.5rem] border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-primary/20 transition-all duration-500 overflow-hidden",
                    i === dict.items.length - 1 && dict.items.length % 2 !== 0
                      ? "lg:col-span-2 lg:w-1/2 lg:mx-auto"
                      : ""
                  )}
                >
                  <div
                    className={cn(
                      "absolute -top-32 -right-32 w-64 h-64 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br",
                      visual.gradient
                    )}
                  />

                  <div className="relative z-10 flex flex-col gap-8 h-full">
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-foreground/5 shadow-sm transition-transform duration-500 group-hover:scale-110",
                          visual.iconColor
                        )}
                      >
                        <Icon size={32} strokeWidth={1.5} />
                      </div>
                      <div className="text-4xl md:text-5xl font-bold text-foreground/10 leading-none select-none pointer-events-none">
                        0{i + 1}
                      </div>
                    </div>

                    <div className="space-y-4 flex-grow min-w-0">
                      <h2 className="text-2xl font-bold tracking-tight break-words hyphens-auto">
                        {s.title}
                      </h2>
                      <p className="text-foreground/60 leading-relaxed">
                        {s.description}
                      </p>
                    </div>

                    <div className="space-y-6 mt-auto">
                      <ul className="flex flex-wrap gap-2">
                        {s.details.map((detail, idx) => (
                          <li
                            key={idx}
                            className="px-3.5 py-1.5 rounded-full bg-foreground/5 border border-foreground/5 text-xs font-medium text-foreground/75"
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={localizedPath(`/services/${s.slug}`, locale)}
                          className={buttonVariants({
                            variant: "primary",
                            size: "md",
                            className: "w-full sm:w-auto",
                          })}
                        >
                          <span>{dict.viewDetails}</span>
                          <ForwardArrow size={16} className="shrink-0" />
                        </Link>
                        <Link
                          href={localizedPath("/contact", locale)}
                          className={buttonVariants({
                            variant: "secondary",
                            size: "md",
                            className: "w-full sm:w-auto",
                          })}
                        >
                          <span>{dict.projectInquiry}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div variants={fadeInUp} className="pt-12 text-center">
            <div className="p-8 sm:p-12 md:p-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[3rem] border border-primary/10 shadow-sm relative overflow-hidden">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-6 relative z-10 break-words hyphens-auto">
                {dict.ctaTitle}
              </h3>
              <p className="text-foreground/70 mb-8 max-w-xl mx-auto relative z-10">
                {dict.ctaSubtitle}
              </p>
              <Link
                href={localizedPath("/contact", locale)}
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                  className: "relative z-10",
                })}
              >
                <span>{dict.ctaButton}</span>
                <ForwardArrow size={18} className="shrink-0" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
