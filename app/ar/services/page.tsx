"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Code2,
  Smartphone,
  Layout,
  Terminal,
  Bot,
  Sparkles
} from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

const coreServices = [
  {
    title: "تطوير تطبيقات الويب",
    description: "أنظمة ويب عالية الأداء وقابلة للتوسع مبنية بأحدث الأطر السحابية.",
    icon: Code2,
    details: ["تطبيقات ويب تقدمية", "حلول التجارة الإلكترونية", "لوحات تحكم مؤسسية"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    title: "حلول الذكاء الاصطناعي والأتمتة",
    description: "تنسيق وكلاء أذكياء ونماذج عصبية مخصصة مصممة للكفاءة الصناعية.",
    icon: Bot,
    details: ["التحليلات التنبؤية", "أتمتة العمليات", "البحث العصبي"],
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
  {
    title: "تطوير تطبيقات الجوال",
    description: "تجارب جوال متعددة المنصات بجودة أصلية لأنظمة iOS و Android.",
    icon: Smartphone,
    details: ["iOS و Android", "مزامنة فورية", "تطبيقات تعمل بدون إنترنت"],
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    title: "تطوير البرمجيات المخصصة",
    description: "أنظمة برمجية مصممة خصيصاً لحل تحديات أعمالك الفريدة بدقة.",
    icon: Terminal,
    details: ["ترحيل الأنظمة القديمة", "تكامل API", "خدمات مصغرة"],
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-500",
  },
  {
    title: "تصميم واجهة المستخدم",
    description: "واجهات سينمائية تركز على المستخدم مصممة للتفاعل الحديث والتحويل.",
    icon: Layout,
    details: ["نماذج تفاعلية", "أنظمة تصميم", "بحوث المستخدم"],
    gradient: "from-primary/20 to-primary-foreground/20",
    iconColor: "text-primary",
  },
];

export default function ArabicServicesPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <ParticleBackground />

      <div className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-20"
        >
          {/* Hero Section */}
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2 shadow-sm border border-primary/20">
              <Sparkles size={16} />
              <span>ماذا نقدم</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              خدماتنا <span className="text-primary">المتميزة</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
              نقدم حلولاً رقمية بمستوى صناعي مدعومة بأحدث تقنيات الذكاء الاصطناعي، مصممة بدقة لرفع مستوى أعمالك.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {coreServices.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={cn(
                  "relative group bg-background/80 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-primary/20 transition-all duration-500 overflow-hidden",
                  i === coreServices.length - 1 && coreServices.length % 2 !== 0 ? "lg:col-span-2 lg:w-1/2 lg:mx-auto" : ""
                )}
              >
                {/* Background Glow */}
                <div className={cn("absolute -top-32 -left-32 w-64 h-64 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br", s.gradient)} />

                <div className="relative z-10 flex flex-col gap-8 h-full">
                  <div className="flex items-start justify-between">
                    <div className={cn("w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-foreground/5 shadow-sm transition-transform duration-500 group-hover:scale-110", s.iconColor)}>
                      <s.icon size={32} strokeWidth={1.5} />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-foreground/10 leading-none select-none pointer-events-none transition-all duration-500 group-hover:text-foreground/20">
                      0{i + 1}
                    </div>
                  </div>

                  <div className="space-y-4 flex-grow">
                    <h2 className="text-2xl font-bold tracking-tight">{s.title}</h2>
                    <p className="text-foreground/60 leading-relaxed">{s.description}</p>
                  </div>

                  <div className="space-y-8 mt-auto">
                    <ul className="flex flex-wrap gap-2.5">
                      {s.details.map((detail, idx) => (
                        <li key={idx} className="px-4 py-2 rounded-full bg-foreground/5 border border-foreground/5 text-xs font-medium text-foreground/70 transition-colors group-hover:bg-foreground/10 group-hover:text-foreground">
                          {detail}
                        </li>
                      ))}
                    </ul>

                    <Link href="/ar/contact" className="inline-block w-full sm:w-auto">
                      <button className="flex items-center justify-center sm:justify-start w-full gap-2 px-6 py-3.5 bg-foreground/5 hover:bg-primary hover:text-primary-foreground text-foreground rounded-2xl font-semibold transition-all group/btn shadow-sm">
                        استفسار عن مشروع
                        <ArrowLeft size={18} className="group-hover/btn:-translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div variants={fadeInUp} className="pt-16 text-center">
            <div className="p-12 md:p-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[3rem] border border-primary/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" />
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 relative z-10">غير متأكد من الخدمة المناسبة؟</h3>
              <p className="text-foreground/70 mb-8 max-w-xl mx-auto relative z-10">احجز استشارة مجانية مع خبرائنا لمناقشة متطلباتك وإيجاد الحل التقني المثالي لأعمالك.</p>
              <Link href="/ar/contact" className="relative z-10 inline-block">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">
                  احجز استشارة
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
