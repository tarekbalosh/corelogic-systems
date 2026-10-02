"use client";

import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Cpu, Zap, MessageSquare, Camera, Settings, Database, ArrowLeft } from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { Typewriter } from "@/components/typewriter";
import { NeonButton } from "@/components/neon-button";
import { GlassCard } from "@/components/glass-card";
import { SectionTitle } from "@/components/section-title";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: 12, suffix: "+", label: "عملاء نشطون", color: "purple" },
  { value: 99.9, suffix: "%", label: "وقت التشغيل المستهدف", color: "cyan", decimals: 1 },
  { value: 10, suffix: "K+", label: "طلبات API/ثانية", color: "amber" },
];

const services = [
  { title: "تحليلات الذكاء الاصطناعي", description: "نمذجة تنبؤية متعمقة وتحليل بيانات فوري لمرونة المؤسسات.", icon: Cpu, glow: "purple" as const },
  { title: "التعلم الآلي", description: "بنيات شبكات عصبية مخصصة مدربة على مجموعات بيانات صناعية لدقة عالية.", icon: Zap, glow: "cyan" as const },
  { title: "معالجة اللغات الطبيعية", description: "فهم دلالي متقدم ومعالجة متعددة اللغات لذكاء شبيه بالبشر.", icon: MessageSquare, glow: "purple" as const },
  { title: "الرؤية الحاسوبية", description: "كشف الأجسام والتحليل المكاني والإدراك الحسي للروبوتات المستقلة.", icon: Camera, glow: "amber" as const },
  { title: "الأتمتة الذكية", description: "تنسيق الوكلاء الأذكياء لتبسيط سير العمل المعقد عبر الأقسام.", icon: Settings, glow: "cyan" as const },
  { title: "ذكاء البيانات", description: "تكامل آمن لبحيرات البيانات مع حوكمة آلية وحواجز أخلاقية للذكاء الاصطناعي.", icon: Database, glow: "amber" as const },
];

const projects = [
  {
    title: "نظام المحاسبة الاحترافي",
    category: "نظام مالي",
    image: "/accounting_pro_dashboard.png",
    tags: ["محاسبة", "مطاعم", "مالي"],
    link: "https://account-systems.vercel.app/login",
    span: "col-span-2 md:col-span-2",
  },
  {
    title: "نظام نقاط البيع",
    category: "نقاط بيع المطاعم",
    image: "/pos_system_dashboard.png",
    tags: ["نقاط البيع", "مطاعم"],
    link: "https://system-pos-resturant.vercel.app/pos",
    span: "col-span-2 md:col-span-1",
  },
  {
    title: "نظام إدارة الطلاب",
    category: "تعليم",
    image: "/student_management_dashboard.png",
    tags: ["طلاب", "إدارة"],
    link: "https://management-students.vercel.app/dashboard",
    span: "col-span-2 md:col-span-1",
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

function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden bg-white border-y border-gray-100">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-[120px]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {stats.map((stat, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="text-5xl md:text-7xl font-bold font-heading tracking-tight flex items-baseline justify-center">
                  <span className="text-foreground">
                    {inView ? (
                      <CountUp end={stat.value} duration={2.5} decimals={stat.decimals || 0} useEasing={true} />
                    ) : (
                      <span>0</span>
                    )}
                  </span>
                  <span className="text-primary text-3xl md:text-5xl mr-1">{stat.suffix}</span>
                </div>
                <div className="h-1 w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent mx-auto mt-4 rounded-full" />
              </div>
              <p className="text-sm md:text-base font-bold text-foreground/50 tracking-[0.2em] uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

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
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-heading leading-none">
                  ابنِ المستقبل <br />
                  <span className="text-gradient">بالذكاء الاصطناعي</span>
                </h1>
                <div className="text-2xl md:text-3xl font-medium text-foreground/70 flex items-center gap-2">
                  <span>مُمَكَّنون لـ</span>
                  <Typewriter words={["الأتمتة", "التحليل", "التسريع"]} />
                </div>
              </motion.div>

              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/60 max-w-lg leading-relaxed">
                كورلوجيك سيستمز توفر بنية تحتية عالية الأداء وهندسة عصبية متقدمة للجيل القادم من الحوسبة على المستوى الصناعي.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6">
                <Link href="/ar/contact">
                  <NeonButton size="lg" variant="primary">ابدأ الآن</NeonButton>
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
              <div className="animate-float" style={{ mixBlendMode: "screen" }}>
                <Image
                  src="/ai_brain_hologram_1776488427249.png"
                  alt="دماغ ذكاء اصطناعي هولوغرامي"
                  width={600}
                  height={600}
                  className="drop-shadow-[0_0_50px_rgba(124,58,237,0.5)]"
                  priority
                />
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

        {/* Stats */}
        <StatsSection />

        {/* Services */}
        <section id="services" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <SectionTitle
              title="خدمات ذكية"
              subtitle="تمكين مؤسستك ببنية تحتية متطورة للذكاء الاصطناعي وهندسة معرفية حديثة."
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {services.map((service, idx) => (
                <GlassCard key={idx} glowColor={service.glow} delay={idx * 0.1} className="h-full group">
                  <div className="flex flex-col h-full space-y-6">
                    <div className="p-3 rounded-xl bg-foreground/5 border border-foreground/10 w-fit group-hover:bg-primary/20 transition-colors duration-500">
                      <service.icon size={28} className="text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <h3 className="text-2xl font-bold font-heading">{service.title}</h3>
                      <p className="text-foreground/70 text-base leading-relaxed">{service.description}</p>
                    </div>
                    <div className="pt-6 mt-auto border-t border-foreground/10 lg:border-none">
                      <button className="w-full lg:w-auto flex items-center justify-center lg:justify-start gap-2 text-sm font-bold text-foreground bg-foreground/5 lg:bg-transparent py-4 lg:py-0 rounded-full lg:rounded-none hover:bg-foreground/10 lg:hover:bg-transparent lg:group-hover:text-secondary lg:group-hover:-translate-x-2 transition-all duration-300">
                        اعرف المزيد <ArrowLeft size={16} className="text-primary lg:text-inherit" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="py-24 px-6 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <SectionTitle
              title="مشاريع مميزة"
              subtitle="عرض لأنظمة ذكاء اصطناعي عالية التأثير تم تطويرها لشركائنا العالميين."
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
                  <Link href={project.link || "#"} className="block h-full w-full">
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
                              عرض دراسة الحالة
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
