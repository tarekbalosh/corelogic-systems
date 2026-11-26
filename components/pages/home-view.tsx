"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  Bot,
  Globe,
  LineChart,
  Monitor,
  Smartphone,
  Wrench,
} from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { buttonVariants } from "@/components/neon-button";
import { GlassCard } from "@/components/glass-card";
import { SectionTitle } from "@/components/section-title";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { localizedPath, type Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/i18n";
import { projectsData } from "@/config/work";

const iconMap = {
  monitor: Monitor,
  globe: Globe,
  smartphone: Smartphone,
  bot: Bot,
  chart: LineChart,
  wrench: Wrench,
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 60, damping: 15 },
  },
} as const;

export function HomeView({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["home"];
}) {
  const isArabic = locale === "ar";
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;
  const CornerArrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col gap-0 pb-32">
        {/* Hero */}
        <section className="relative pt-36 sm:pt-40 pb-20 px-6 min-h-screen flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={false}
              animate="visible"
              variants={staggerContainer}
              className="space-y-10 z-10 min-w-0"
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter font-heading leading-tight break-words hyphens-auto">
                  {dict.heroTitleStart} <br className="hidden md:block" />
                  <span className="text-gradient">{dict.heroTitleHighlight}</span>{" "}
                  {dict.heroTitleEnd}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl font-medium text-foreground/70 leading-relaxed">
                  {dict.heroSubtitle}
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 pt-4"
              >
                <Link
                  href={localizedPath("/contact", locale)}
                  className={buttonVariants({ variant: "primary", size: "lg" })}
                >
                  <span>{dict.heroPrimaryCta}</span>
                  <ForwardArrow
                    size={18}
                    className={`shrink-0 transition-transform duration-250 ${
                      isArabic
                        ? "group-hover:-translate-x-1"
                        : "group-hover:translate-x-1"
                    }`}
                  />
                </Link>
                <Link
                  href="#portfolio"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                  })}
                >
                  <span>{dict.heroSecondaryCta}</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* 3D Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative flex items-center justify-center p-8 mix-blend-screen"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[120%] h-[120%] border-2 border-primary/20 rounded-full animate-[spin_8s_linear_infinite] [transform-style:preserve-3d] [transform:rotateX(60deg)]" />
                <div className="absolute w-[100%] h-[100%] border-2 border-secondary/20 rounded-full animate-[spin_12s_linear_infinite_reverse] [transform-style:preserve-3d] [transform:rotateX(-45deg)]" />
                <div className="absolute w-[80%] h-[80%] border-t-2 border-primary/40 rounded-full animate-[spin_6s_linear_infinite] [transform-style:preserve-3d] [transform:rotateX(30deg)]" />
              </div>
              <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />

              <div
                className="animate-float flex items-center justify-center p-12 w-full h-full relative z-10"
                style={{ mixBlendMode: "screen" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                  className="w-full max-w-[400px] h-auto drop-shadow-[0_0_50px_rgba(124,58,237,0.5)]"
                >
                  <g transform="translate(14 14) scale(1)">
                    <path
                      d="M46 18L72.6 28.5L79.1 52.2L60.8 71.2L31.2 71.2L12.9 52.2L19.4 28.5Z"
                      fill="none"
                      stroke="currentColor"
                      className="text-primary/80"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M46 38L46 18M52.7 41.6L72.6 28.5M53.9 47.5L79.1 52.2M50.1 52.9L60.8 71.2M41.9 52.9L31.2 71.2M38.1 47.5L12.9 52.2M39.3 41.6L19.4 28.5"
                      fill="none"
                      stroke="currentColor"
                      className="text-primary/60"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="46" cy="18" r="4.5" fill="currentColor" className="text-primary" />
                    <circle cx="79.1" cy="52.2" r="4.5" fill="currentColor" className="text-primary" />
                    <circle cx="60.8" cy="71.2" r="4.5" fill="currentColor" className="text-primary" />
                    <circle cx="31.2" cy="71.2" r="4.5" fill="currentColor" className="text-primary" />
                    <circle cx="12.9" cy="52.2" r="4.5" fill="currentColor" className="text-primary" />
                    <circle cx="19.4" cy="28.5" r="4.5" fill="currentColor" className="text-primary" />
                    <circle cx="72.6" cy="28.5" r="5.5" fill="currentColor" className="text-secondary" />
                    <circle cx="46" cy="46" r="8" fill="none" stroke="currentColor" className="text-primary" strokeWidth="3" />
                    <circle cx="46" cy="46" r="3" fill="currentColor" className="text-secondary" />
                  </g>
                </svg>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <SectionTitle
              title={dict.servicesTitle}
              subtitle={dict.servicesSubtitle}
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {dict.servicesItems.map((service, idx) => {
                const Icon =
                  iconMap[service.icon as keyof typeof iconMap] ?? Monitor;
                const glow = service.glow === "cyan" ? "cyan" : "purple";
                return (
                  <Link
                    href={localizedPath(service.href, locale)}
                    key={idx}
                    className="block h-full"
                  >
                    <GlassCard
                      glowColor={glow}
                      delay={idx * 0.1}
                      className="h-full group cursor-pointer"
                    >
                      <div className="flex flex-col h-full space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm shrink-0">
                          <Icon size={26} />
                        </div>
                        <div className="space-y-3 flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 group-hover:text-primary transition-colors break-words hyphens-auto">
                            {service.title}
                          </h3>
                          <p className="text-slate-600 text-base leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        <div className="pt-4 mt-auto border-t border-slate-100">
                          <div
                            className={`inline-flex items-center gap-2 text-sm font-bold text-primary transition-transform duration-300 ${
                              isArabic
                                ? "group-hover:-translate-x-1.5"
                                : "group-hover:translate-x-1.5"
                            }`}
                          >
                            <span>{dict.learnMore}</span>
                            <ForwardArrow size={16} />
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Portfolio */}
        <section
          id="portfolio"
          className="py-24 px-6 bg-white border-t border-gray-100"
        >
          <div className="max-w-7xl mx-auto">
            <SectionTitle
              title={dict.portfolioTitle}
              subtitle={dict.portfolioSubtitle}
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-[340px]"
            >
              {projectsData.map((project, idx) => {
                const span =
                  idx === 0 || idx === projectsData.length - 1
                    ? "col-span-2 md:col-span-1 lg:col-span-2"
                    : "col-span-2 md:col-span-1 lg:col-span-1";
                const title =
                  (project.title as Record<string, string>)[locale] ??
                  project.title.en;
                const category =
                  (project.category as Record<string, string>)[locale] ??
                  project.category.en;
                const tags =
                  (project.tags as Record<string, string[]>)[locale] ??
                  project.tags.en;

                return (
                  <motion.div
                    key={project.slug}
                    variants={cardVariants}
                    whileHover={{ y: -10 }}
                    className={span}
                  >
                    <Link
                      href={localizedPath(
                        `/our-projects/${project.slug}`,
                        locale
                      )}
                      className="block h-full w-full group"
                    >
                      <div className="relative h-full w-full bg-background rounded-3xl border border-foreground/10 group-hover:border-primary/30 group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                        <Image
                          src={project.image}
                          alt={title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-6 md:p-8 flex flex-col justify-end opacity-95 group-hover:opacity-100 transition-opacity">
                          <div className="space-y-3.5 translate-y-0 lg:translate-y-6 lg:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <div className="space-y-2">
                              <span className="text-[11px] md:text-xs font-bold text-white uppercase tracking-wider bg-primary/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full inline-block shadow-sm">
                                {category}
                              </span>
                              <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md leading-tight break-words hyphens-auto">
                                {title}
                              </h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium text-white/90 backdrop-blur-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pt-2">
                              <span
                                className={buttonVariants({
                                  variant: "primary",
                                  size: "sm",
                                  className: "w-full sm:w-auto",
                                })}
                              >
                                <span>{dict.portfolioCta}</span>
                                <CornerArrow
                                  size={16}
                                  className="shrink-0 transition-transform duration-250"
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
