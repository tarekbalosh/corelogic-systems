"use client";

import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Monitor, Globe, Smartphone, Bot, LineChart, Wrench } from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { Typewriter } from "@/components/typewriter";
import { NeonButton } from "@/components/neon-button";
import { GlassCard } from "@/components/glass-card";
import { SectionTitle } from "@/components/section-title";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const services = [
  { title: "برمجيات الأعمال المخصصة", description: "تخطيط موارد المؤسسات، المحاسبة، نقاط البيع، المخزون، ولوحات التحكم المخصصة.", icon: Monitor, glow: "purple" as const, href: "/ar/services/software-dev" },
  { title: "تطوير الويب", description: "مواقع الشركات، البوابات الإلكترونية، ومنصات التجارة الإلكترونية القابلة للتوسع.", icon: Globe, glow: "cyan" as const, href: "/ar/services/web-dev" },
  { title: "تطبيقات الجوال", description: "تطبيقات جوال أصلية ومتعددة المنصات لنظامي iOS و Android.", icon: Smartphone, glow: "purple" as const, href: "/ar/services/mobile-dev" },
  { title: "الأتمتة بالذكاء الاصطناعي", description: "أتمتة سير العمل، روبوتات المحادثة الذكية، ومعالجة المستندات.", icon: Bot, glow: "cyan" as const, href: "/ar/services/ai-automation" },
  { title: "البيانات والتحليلات", description: "لوحات تحكم مخصصة، أنظمة تقارير، وتكامل البيانات.", icon: LineChart, glow: "purple" as const, href: "/ar/services/ai-automation" },
  { title: "الصيانة والدعم الفني", description: "دعم مستمر، تحديثات، وصيانة لأصولك الرقمية.", icon: Wrench, glow: "cyan" as const, href: "/ar/contact" },
];

const projects = [
  {
    title: "نظام المحاسبة الاحترافي",
    category: "نظام مالي",
    image: "/accounting_pro_dashboard.png",
    tags: ["محاسبة", "مطاعم", "مالي"],
    link: "https://account-systems.vercel.app/",
    span: "col-span-2 md:col-span-2",
  },
  {
    title: "نظام نقاط البيع",
    category: "نقاط بيع المطاعم",
    image: "/pos_system_dashboard.png",
    tags: ["نقاط البيع", "مطاعم"],
    link: "https://system-pos-resturant.vercel.app/login",
    span: "col-span-2 md:col-span-1",
  },
  {
    title: "نظام إدارة الطلاب",
    category: "تعليم",
    image: "/student_management_dashboard.png",
    tags: ["طلاب", "إدارة"],
    link: "https://management-students.vercel.app/login",
    span: "col-span-2 md:col-span-1",
  },
  {
    title: "نظام حجوزات بوك إيز",
    category: "منصة حجوزات",
    image: "/bookease_dashboard.png",
    tags: ["حجوزات", "مواعيد", "نظام سحابي"],
    link: "https://book-ease-red.vercel.app/",
    span: "col-span-2 md:col-span-1 lg:col-span-2",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 60, damping: 15 },
  },
} as const;



export default function ArabicHome() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col gap-0 pb-32">
        {/* Hero */}
        <section className="relative pt-40 pb-20 px-6 min-h-screen flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Right Side Content (RTL) */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-10 z-10"
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-heading leading-tight">
                  برمجيات مخصصة وأتمتة <br className="hidden md:block" />
                  <span className="text-gradient">بالذكاء الاصطناعي</span> للأعمال النامية
                </h1>
                <div className="text-xl md:text-2xl font-medium text-foreground/70">
                  نصمم ونبني أنظمة الأعمال وتطبيقات الويب والجوال وحلول الأتمتة بالذكاء الاصطناعي، من الفكرة حتى التشغيل والدعم.
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 pt-4">
                <Link href="/ar/contact">
                  <NeonButton size="lg" variant="primary">احجز استشارة مجانية</NeonButton>
                </Link>
                <Link href="#portfolio" className="flex items-center justify-center font-semibold hover:text-primary transition-colors px-6 py-3">
                  شاهد أعمالنا
                </Link>
              </motion.div>
            </motion.div>

            {/* Left Side: 3D Visual */}
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
              <motion.div
                animate={{ rotate: 360, y: [0, -20, 0] }}
                transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute -top-10 -left-10 w-24 h-24 border border-foreground/10 rounded-lg opacity-20"
              />
              <motion.div
                animate={{ rotate: -360, y: [0, 20, 0] }}
                transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute -bottom-10 -right-10 w-32 h-32 border border-foreground/10 rounded-full opacity-20"
              />
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <SectionTitle
              title="خدماتنا"
              subtitle="حلول متكاملة تلبي كافة احتياجات أعمالك الرقمية."
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {services.map((service, idx) => (
                <Link href={service.href} key={idx} className="block h-full">
                  <GlassCard glowColor={service.glow} delay={idx * 0.1} className="h-full group cursor-pointer">
                    <div className="flex flex-col h-full space-y-6">
                      <div className="p-3 rounded-xl bg-foreground/5 border border-foreground/10 w-fit group-hover:bg-primary/20 transition-colors duration-500">
                        <service.icon size={28} className="text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <h3 className="text-2xl font-bold font-heading">{service.title}</h3>
                        <p className="text-foreground/70 text-base leading-relaxed">{service.description}</p>
                      </div>
                      <div className="pt-6 mt-auto border-t border-foreground/10 lg:border-none">
                        <div className="w-full lg:w-auto flex items-center justify-center lg:justify-start gap-2 text-sm font-bold text-foreground bg-foreground/5 lg:bg-transparent py-4 lg:py-0 rounded-full lg:rounded-none group-hover:bg-foreground/10 lg:group-hover:bg-transparent lg:group-hover:text-secondary lg:group-hover:-translate-x-2 transition-all duration-300">
                          اعرف المزيد <ArrowLeft size={16} className="text-primary lg:text-inherit" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="py-24 px-6 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <SectionTitle
              title="مشاريع مميزة"
              subtitle="مجموعة من الأنظمة والتطبيقات المخصصة التي طورناها لعملائنا."
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[320px]"
            >
              {projects.map((project, idx) => (
                <motion.div key={idx} variants={cardVariants} whileHover={{ y: -10 }} className={project.span}>
                  <a href={project.link || "#"} target="_blank" rel="noopener noreferrer" className="block h-full w-full group">
                    <div className="relative h-full w-full bg-background rounded-3xl border border-foreground/10 group-hover:border-primary/30 group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-8 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                        <div className="space-y-4 translate-y-0 lg:translate-y-8 lg:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <div className="space-y-2">
                            <span className="text-[11px] md:text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 backdrop-blur-md border border-primary/20 px-3 py-1 rounded-full inline-block shadow-sm">
                              {project.category}
                            </span>
                            <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md leading-tight">{project.title}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium text-white/90 backdrop-blur-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pt-3">
                            <button className="w-full sm:w-auto px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-md text-sm">
                              عرض النظام
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
