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
  ArrowLeft
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { SectionTitle } from "@/components/section-title";
import { NeonButton } from "@/components/neon-button";
import { ParticleBackground } from "@/components/particle-background";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const values = [
  { title: "الابتكار", description: "دفع حدود الممكن مع الهندسة العصبية المتقدمة.", icon: Lightbulb, glow: "purple" as const },
  { title: "الجودة", description: "معايير هندسية لا تقبل المساومة لأنظمة بمستوى صناعي.", icon: Award, glow: "cyan" as const },
  { title: "الأداء", description: "زمن استجابة فائق السرعة وإنتاجية ضخمة مُحسّنة للتوسع.", icon: Zap, glow: "amber" as const },
  { title: "نجاح العملاء", description: "ملتزمون بدفع النمو والأتمتة لشركائنا حول العالم.", icon: TrendingUp, glow: "purple" as const },
];

const reasons = [
  { title: "تسليم سريع", description: "دورات نشر سريعة مدعومة بأنظمة CI/CD آلية.", icon: Zap },
  { title: "أنظمة قابلة للتوسع", description: "بنيات مصممة للنمو ديناميكياً مع احتياجات بياناتك.", icon: TrendingUp },
  { title: "مدعوم بالذكاء الاصطناعي", description: "نهج يعتمد الذكاء أولاً لحل مشاكل الأعمال المعقدة.", icon: Cpu },
];

export default function ArabicAboutPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
      <ParticleBackground />

      <div className="relative z-10 pt-40 pb-32">
        {/* 1. Hero Section */}
        <section className="px-6 mb-32">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-heading leading-tight">
                  من نحن <br />
                  <span className="text-gradient">شركتنا</span>
                </h1>
                <p className="text-2xl text-foreground/60 font-medium">
                  نبني حلولاً برمجية ذكية مدعومة بالذكاء الاصطناعي.
                </p>
              </motion.div>
              <motion.p variants={fadeInUp} className="text-lg text-foreground/70 max-w-lg leading-relaxed">
                كورلوجيك سيستمز هي شركة تقنية رائدة مكرّسة لسد الفجوة بين الحوسبة الخام والذكاء المعرفي.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
              <Image
                src="/about_ai_dashboard.png"
                alt="واجهة لوحة تحكم الذكاء الاصطناعي"
                width={700}
                height={700}
                className="relative z-10 drop-shadow-[0_0_50px_rgba(124,58,237,0.15)] animate-float"
              />
            </motion.div>
          </div>
        </section>

        {/* 2. Company Overview */}
        <section className="px-6 mb-40">
          <div className="max-w-7xl mx-auto">
            <GlassCard className="p-12 md:p-20 border-primary/20 bg-primary/5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                <div className="lg:col-span-1">
                  <h2 className="text-4xl font-black font-heading tracking-tighter">من نحن</h2>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <p className="text-xl text-foreground/70 leading-relaxed font-light">
                    تأسست عند تقاطع البنية التحتية والذكاء الاصطناعي. كورلوجيك سيستمز تعمل كمختبر عالي الأداء للمستقبل. نحن متخصصون في تطوير <strong>تطبيقات الويب</strong> و<strong>هندسة الذكاء الاصطناعي المخصصة</strong> و<strong>حلول البرمجيات المؤسسية</strong> التي تعطي الأولوية للسرعة والأمان وقابلية التوسع.
                  </p>
                  <p className="text-xl text-foreground/70 leading-relaxed font-light">
                    مهمتنا هي تمكين الصناعات العالمية من خلال <strong>الابتكار</strong> المستمر و<strong>الأتمتة</strong> الاستراتيجية و<strong>النمو</strong> المستدام.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 3. Mission & Vision */}
        <section className="px-6 mb-40">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard glowColor="purple">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Target size={32} />
                </div>
                <h3 className="text-3xl font-bold font-heading">مهمتنا</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  تقديم حلول رقمية ذكية وقابلة للتوسع وحديثة تحل أعقد التحديات التقنية في القرن الحادي والعشرين.
                </p>
              </div>
            </GlassCard>
            <GlassCard glowColor="cyan">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Eye size={32} />
                </div>
                <h3 className="text-3xl font-bold font-heading">رؤيتنا</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  أن نصبح مزوداً عالمياً رائداً للذكاء الاصطناعي، ونضع معايير الذكاء الأخلاقي والبرمجيات العصبية عالية الأداء.
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 4. Our Values */}
        <section className="px-6 mb-40 relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter font-heading mb-4">قيمنا <span className="text-primary">الجوهرية</span></h2>
              <p className="text-foreground/60 max-w-2xl mx-auto text-lg">المبادئ التي تقود عملياتنا الهندسية والإبداعية.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {values.map((v, i) => (
                <div key={i} className="group relative bg-white border border-slate-200/60 p-8 rounded-[2rem] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-primary/20">
                      <v.icon size={28} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-xl font-bold mb-3">{v.title}</h4>
                    <p className="text-foreground/60 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Why Choose Us */}
        <section className="px-6 mb-40 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter font-heading mb-4">لماذا <span className="text-secondary">تختارنا</span></h2>
              <p className="text-foreground/60 max-w-2xl mx-auto text-lg">نقدم حلولاً ذكية تدفع أعمالك إلى الأمام.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {reasons.map((r, i) => (
                <div key={i} className="relative p-10 bg-white border border-slate-200/80 rounded-[2.5rem] overflow-hidden group hover:border-secondary/40 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] text-right">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors duration-500 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500 self-start">
                      <r.icon size={30} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-2xl font-bold tracking-tight">{r.title}</h4>
                      <p className="text-foreground/60 leading-relaxed text-base">{r.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Call To Action */}
        <section className="px-6 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden bg-slate-950 text-white py-24 px-8 md:px-20 text-center shadow-2xl"
            >
              {/* Background effects */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/30 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/30 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/2 pointer-events-none" />
              
              <div className="relative z-10 space-y-10">
                <h2 className="text-5xl md:text-7xl font-black font-heading tracking-tighter leading-tight">
                  جاهز لتحويل <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-secondary">رؤيتك إلى واقع؟</span>
                </h2>
                <p className="text-white/70 text-xl max-w-2xl mx-auto font-medium">
                  دعنا نناقش كيف يمكن لخبراتنا في البرمجيات والذكاء الاصطناعي تسريع نمو أعمالك وتحقيق أهدافك الاستراتيجية.
                </p>
                <div className="flex justify-center pt-4">
                  <Link href="/ar/contact">
                    <button className="px-10 py-5 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-primary hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(124,58,237,0.4)] flex items-center gap-3 group">
                      ابدأ مشروعك الآن
                      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
