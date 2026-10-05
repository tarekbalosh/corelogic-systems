"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Globe, 
  Code2, 
  Database, 
  LayoutTemplate, 
  Rocket, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2,
  Workflow,
  BarChart,
  ShoppingCart
} from "lucide-react";
import { NeonButton } from "@/components/neon-button";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

const solutions = [
  { title: "تطبيقات الويب المخصصة", desc: "أنظمة ويب معقدة مبنية من الصفر لحل تحديات الأعمال الفريدة.", icon: Code2 },
  { title: "منصات التجارة الإلكترونية", desc: "متاجر رقمية ذات أداء عالٍ مُحسّنة لزيادة المبيعات والموثوقية.", icon: ShoppingCart },
  { title: "أنظمة إدارة المحتوى (CMS)", desc: "بنى مرنة وقابلة للتوسع تمنح فريقك التحكم الكامل في المحتوى.", icon: LayoutTemplate },
  { title: "تطوير واجهات برمجة التطبيقات (API)", desc: "أنظمة خلفية (Backend) قوية لربط منصاتك وخدماتك بسلاسة.", icon: Database },
  { title: "تطبيقات الويب التقدمية (PWA)", desc: "تجارب شبيهة بتطبيقات الجوال تعمل مباشرة في متصفح الويب.", icon: Globe },
  { title: "أنظمة المؤسسات (SaaS)", desc: "منصات سحابية متعددة المستأجرين مصممة للاعتمادية والأداء العالي.", icon: Workflow },
];

const features = [
  { title: "أداء فائق السرعة", desc: "أوقات تحميل محسنة تضمن بقاء الزوار وتفاعلهم.", icon: Rocket },
  { title: "أمان متطور", desc: "حماية بياناتك وبيانات عملائك بأحدث بروتوكولات الأمان.", icon: ShieldCheck },
  { title: "معمارية قابلة للتوسع", desc: "أنظمة تنمو وتتوسع مع نمو أعمالك دون إعادة كتابة الكود.", icon: BarChart },
  { title: "تصميم متجاوب", desc: "تجارب مثالية على جميع الأجهزة والشاشات.", icon: LayoutTemplate },
];

const processSteps = [
  { num: "01", title: "الاكتشاف والاستراتيجية", desc: "فهم متطلباتك ورسم خارطة الطريق الفنية." },
  { num: "02", title: "تصميم واجهة المستخدم", desc: "بناء واجهات جذابة ومحسنة لتحسين تجربة الزوار." },
  { num: "03", title: "تطوير الواجهة الأمامية", desc: "برمجة مرئيات متجاوبة وتفاعلية باستخدام أحدث التقنيات." },
  { num: "04", title: "تطوير الواجهة الخلفية", desc: "هندسة قواعد البيانات والخوادم لضمان أداء مستقر." },
  { num: "05", title: "الاختبار الشامل", desc: "فحوصات الجودة للأمان، والأداء، والتوافقية." },
  { num: "06", title: "النشر والإطلاق", desc: "إطلاق ناجح مع مراقبة الأداء وتوفير الدعم المستمر." },
];

const industries = [
  { name: "التجارة الإلكترونية", icon: ShoppingCart },
  { name: "الشركات الناشئة SaaS", icon: Workflow },
  { name: "المؤسسات المالية", icon: ShieldCheck },
  { name: "التعليم الإلكتروني", icon: Globe },
  { name: "العقارات", icon: LayoutTemplate },
];

export default function WebDevelopmentPage() {
  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-48 pb-32 px-6 min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-background">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-cyan-500/10 via-blue-400/5 to-transparent blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tl from-teal-500/10 via-emerald-400/5 to-transparent blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-100/40 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none" />
          
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8 text-center lg:text-right">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/80 backdrop-blur-md text-cyan-600 text-sm font-semibold shadow-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span>تطوير ويب بمستوى عالمي</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight leading-[1.05]">
              تطوير تطبيقات <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-600 to-blue-500">الويب المتقدمة</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/60 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              نبني منصات وتطبيقات ويب سريعة، آمنة، وقابلة للتوسع مُصممة لرفع أداء أعمالك وتوفير تجربة مستخدم استثنائية.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/ar/contact">
                <button className="px-8 py-4 bg-gradient-to-l from-cyan-600 to-blue-600 text-white rounded-2xl font-semibold hover:opacity-90 shadow-[0_8px_30px_rgba(6,182,212,0.2)] hover:shadow-[0_8px_40px_rgba(6,182,212,0.3)] hover:-translate-y-1 transition-all text-lg flex items-center gap-2">
                  ابدأ مشروع الويب
                  <ArrowLeft size={20} />
                </button>
              </Link>
              <Link href="#solutions">
                <button className="px-8 py-4 bg-background/50 backdrop-blur-md text-foreground rounded-2xl font-semibold hover:bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-all text-lg shadow-sm">
                  استكشف الحلول
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Hero Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative h-[500px]"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] aspect-video bg-background/40 backdrop-blur-2xl rounded-[2rem] border-8 border-white/40 shadow-[0_30px_60px_-15px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden text-left">
              <div className="h-10 bg-white/40 backdrop-blur-md border-b border-foreground/5 flex items-center px-4 gap-2">
                 <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 flex-1 h-5 bg-background/50 rounded-md border border-foreground/5" />
              </div>
              
              <div className="flex-1 p-6 flex gap-6">
                 <div className="w-1/3 space-y-4">
                    <div className="w-full h-8 bg-cyan-500/10 rounded-lg" />
                    <div className="w-3/4 h-4 bg-foreground/5 rounded-full" />
                    <div className="w-5/6 h-4 bg-foreground/5 rounded-full" />
                    <div className="w-2/3 h-4 bg-foreground/5 rounded-full" />
                 </div>
                 <div className="flex-1 space-y-4">
                    <div className="w-full h-32 bg-blue-500/10 rounded-xl" />
                    <div className="flex gap-4">
                       <div className="flex-1 h-20 bg-emerald-500/10 rounded-xl" />
                       <div className="flex-1 h-20 bg-purple-500/10 rounded-xl" />
                    </div>
                 </div>
              </div>
            </div>
            
            <motion.div 
              animate={{ y: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4 text-right"
            >
              <div className="w-10 h-10 bg-cyan-500/10 text-cyan-600 rounded-full flex items-center justify-center">
                <Rocket size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">أداء فائق</p>
                <p className="text-xs text-foreground/50">Next.js & React</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [15, -15, 15] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4 text-right"
            >
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">بنية خلفية قوية</p>
                <p className="text-xs text-foreground/50">آمنة وقابلة للتوسع</p>
              </div>
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* 2. About the Service */}
      <section className="py-24 px-6 relative z-10 bg-foreground/[0.02]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-foreground/10 bg-background text-foreground/70 font-semibold text-sm mb-2 shadow-sm">
              مستقبل الويب
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">منصات ويب تبني الثقة وتزيد الأرباح</h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-3xl mx-auto">
              في العصر الرقمي، موقعك الإلكتروني هو المقر الرئيسي لعملك. نحن لا نبني مجرد صفحات إنترنت؛ نحن نهندس منصات ويب تفاعلية ومعقدة توفر تجربة مستخدم لا تُنسى، وتتكامل بسلاسة مع أدوات عملك لزيادة الإنتاجية والوصول لآفاق جديدة.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Our Web Solutions */}
      <section id="solutions" className="py-24 px-6 relative">
        <div className="absolute right-0 top-1/3 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">حلول الويب لدينا</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">بنية تحتية متطورة تلبي جميع أهدافك الرقمية.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-right">
            {solutions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background/80 backdrop-blur-3xl p-8 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-cyan-500/20 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500/10 transition-colors mb-6 shadow-sm mr-auto ml-0 md:ml-auto md:mr-0">
                  <item.icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-foreground/60 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Key Features & Why Choose Us */}
      <section className="py-24 px-6 relative bg-foreground/[0.01] border-y border-foreground/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center text-right">
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-background p-8 rounded-3xl border border-foreground/10 hover:border-cyan-500/20 hover:shadow-md transition-all duration-300 shadow-sm group">
                <div className="flex items-start gap-5 flex-row-reverse">
                  <div className="mt-1 text-cyan-600 group-hover:scale-110 transition-transform">
                    <feature.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h4>
                    <p className="text-foreground/60 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">تقنيات <br/><span className="text-cyan-600">متطورة.</span></h2>
              <p className="text-foreground/60 leading-relaxed text-lg">
                نستخدم أحدث التقنيات وأطر العمل لبناء أنظمة سريعة وآمنة قادرة على التوسع مع أعمالك، لنمنحك ميزة تنافسية حقيقية في السوق.
              </p>
            </div>
            
            <ul className="space-y-4">
              {["تقنيات حديثة (React, Next.js)", "قواعد بيانات متدرجة", "بنية تحتية سحابية", "تسليم في الوقت المحدد"].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-600 shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Development Process */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">خطوات التنفيذ</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">عملية تطوير مدروسة تضمن خروج مشروعك بأعلى جودة ممكنة.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative text-right">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background/50 border border-slate-200/60 p-8 rounded-3xl hover:shadow-lg hover:border-cyan-500/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
                <div className="text-5xl font-bold text-foreground/10 mb-6 group-hover:text-cyan-500/20 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mt-2 mb-3 text-foreground">{step.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Industries We Serve */}
      <section className="py-24 px-6 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">مجالات نتميز بها</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {industries.map((ind, i) => (
              <div key={i} className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-foreground/10 bg-background text-foreground/80 hover:border-cyan-500/30 transition-all font-medium text-sm shadow-sm cursor-default hover:shadow-md">
                <ind.icon size={16} className="text-cyan-600" />
                {ind.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call To Action Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-24 bg-gradient-to-bl from-cyan-500/10 via-blue-500/5 to-background rounded-[3rem] border border-cyan-500/10 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                ارتقِ بأعمالك عبر <br />
                <span className="text-cyan-600">منصة ويب احترافية.</span>
              </h2>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                لا تدع منافسيك يسبقونك. تواصل معنا اليوم لتحويل رؤيتك الرقمية إلى منصة ويب قوية ومتطورة.
              </p>
              <div className="pt-4 flex justify-center">
                <a href="https://wa.me/601169397149" target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-gradient-to-l from-cyan-600 to-blue-600 text-white rounded-full font-semibold hover:opacity-90 shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2">
                  احصل على استشارة مجانية
                  <ArrowLeft size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
