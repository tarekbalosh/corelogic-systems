"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Code, 
  TerminalSquare, 
  ShieldCheck, 
  Server, 
  Boxes, 
  ArrowLeft,
  Database,
  Building,
  Monitor,
  Workflow,
  BarChart,
  Users
} from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

const solutions = [
  { title: "أنظمة إدارة الأعمال", desc: "مركز عملياتك التشغيلية باستخدام برمجيات إدارة شاملة ومتكاملة.", icon: Building },
  { title: "أنظمة تخطيط الموارد (ERP)", desc: "وحد مواردك وتخطيطك وأمورك المالية بدون تعقيدات تقنية.", icon: Boxes },
  { title: "أنظمة إدارة العملاء (CRM)", desc: "ابنِ علاقات أقوى مع عملائك بتتبع مخصص ومسارات مبيعات دقيقة.", icon: Users },
  { title: "أتمتة سير العمل", desc: "أتمتة المهام المتكررة واترك لفريقك التركيز على العمل الاستراتيجي.", icon: Workflow },
  { title: "لوحات التحكم الداخلية", desc: "تحليلات فورية وأدوات مراقبة مخصصة لتتبع مؤشرات الأداء الخاصة بك.", icon: BarChart },
  { title: "حلول متخصصة للقطاعات", desc: "بنى رقمية فريدة مصممة لحل المشاكل الخاصة بمجالك وتذليل العقبات.", icon: TerminalSquare },
];

const features = [
  { title: "مخصصة بالكامل", desc: "مبنية بدقة لتلبية متطلباتك الخاصة، بدون قوالب جاهزة ثقيلة.", icon: Code },
  { title: "استقرار عالي", desc: "مُهندسة لتوفير أعلى معدلات استقرار الأداء والسرعات الفائقة.", icon: Server },
  { title: "تكامل سلس", desc: "نربط أنظمتنا بسهولة مع أدواتك الحالية، وواجهات برمجة التطبيقات (APIs)، وقواعد بياناتك.", icon: Database },
  { title: "واجهات بديهية", desc: "تصميم نظيف لواجهة وتجربة المستخدم يضمن تكيّف فريقك بأقل قدر من التدريب.", icon: Monitor },
];

const processSteps = [
  { num: "01", title: "تحليل الأعمال", desc: "نجمع المتطلبات ونفهم عقبات التشغيل في شركتك." },
  { num: "02", title: "تصميم النظام", desc: "تخطيط البنية التقنية وخارطة الطريق الاستراتيجية." },
  { num: "03", title: "تصميم UI/UX", desc: "إنشاء واجهات تركز على المستخدم لتعزيز الكفاءة والسهولة." },
  { num: "04", title: "مرحلة التطوير", desc: "كتابة كود نظيف وقوي لإحياء الحل البرمجي المخصص." },
  { num: "05", title: "الاختبار وضمان الجودة", desc: "تحسين صارم لضمان خلو النظام من الأخطاء وعدم هبوط الأداء." },
  { num: "06", title: "الإطلاق", desc: "عملية نشر سلسة متبوعة بدعم تقني مستمر." },
];

const industries = [
  { name: "المطاعم", icon: Building },
  { name: "البيع بالتجزئة", icon: BarChart },
  { name: "الخدمات اللوجستية", icon: Workflow },
  { name: "الرعاية الصحية", icon: ShieldCheck },
  { name: "التعليم", icon: Users },
  { name: "الشركات", icon: TerminalSquare },
];

export default function CustomSoftwareDevelopmentPage() {
  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-48 pb-32 px-6 min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-background">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-500/10 via-cyan-400/5 to-transparent blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tl from-primary/10 via-emerald-400/5 to-transparent blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none" />
          
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8 text-center lg:text-right">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/80 backdrop-blur-md text-primary text-sm font-semibold shadow-sm border border-primary/20 hover:border-primary/40 transition-colors">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span>بنية برمجية بمستوى الشركات</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight leading-[1.05]">
              تطوير البرمجيات <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-cyan-500">المخصصة</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/60 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              نهندس أنظمة برمجية مخصصة، آمنة، وقابلة للتوسع مصممة لأتمتة عملياتك وتسريع نمو أعمالك.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/ar/contact">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold hover:bg-primary/90 shadow-[0_8px_30px_rgba(6,182,212,0.2)] hover:shadow-[0_8px_40px_rgba(6,182,212,0.3)] hover:-translate-y-1 transition-all text-lg flex items-center gap-2">
                  اطلب استشارة
                  <ArrowLeft size={20} />
                </button>
              </Link>
              <Link href="#solutions">
                <button className="px-8 py-4 bg-background/50 backdrop-blur-md text-foreground rounded-2xl font-semibold hover:bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-all text-lg shadow-sm">
                  اكتشف الحلول
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] aspect-[4/3] bg-background/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 flex flex-col justify-between text-left">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center">
                  <Code size={24} />
                </div>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-3/4 h-4 bg-foreground/10 rounded-full" />
                <div className="w-full h-4 bg-foreground/5 rounded-full" />
                <div className="w-5/6 h-4 bg-foreground/5 rounded-full" />
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-24 bg-blue-500/20 rounded-lg" />
                <div className="h-10 w-24 bg-cyan-500/20 rounded-lg" />
              </div>
            </div>
            
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4 text-right"
            >
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">آمن من الأساس</p>
                <p className="text-xs text-foreground/50">درجة المؤسسات</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4 text-right"
            >
              <div className="w-10 h-10 bg-purple-500/10 text-purple-600 rounded-full flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">بنية قابلة للتوسع</p>
                <p className="text-xs text-foreground/50">جاهز للنمو</p>
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
              ليس مجرد قالب آخر
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">عملك التجاري فريد من نوعه. <br className="hidden md:block"/>برمجياتك يجب أن تكون كذلك.</h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-3xl mx-auto">
              البرمجيات الجاهزة تأتي مع قيود. في CoreLogic، لا نؤمن بإجبار سير عملك ليتناسب مع قوالب مسبقة الصنع.
              نقوم بهندسة برمجيات مخصصة للشركات من الصفر، مصممة لحل مشاكل عملك الدقيقة، وأتمتة مهامك المتكررة، وتحسين كفاءتك التشغيلية بشكل جذري. دعنا نبني العمود الفقري الرقمي الذي تستحقه شركتك.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Our Custom Software Solutions */}
      <section id="solutions" className="py-24 px-6 relative">
        <div className="absolute right-0 top-1/3 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">حلول المؤسسات</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">بنية تحتية مصممة خصيصاً لتبسيط أهداف عملك.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-right">
            {solutions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background/80 backdrop-blur-3xl p-8 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors mb-6 shadow-sm mr-auto ml-0 md:ml-auto md:mr-0">
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

      {/* 4. Key Features & 6. Why Choose Us */}
      <section className="py-24 px-6 relative bg-foreground/[0.01] border-y border-foreground/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center text-right">
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-background p-8 rounded-3xl border border-foreground/10 hover:border-primary/20 hover:shadow-md transition-all duration-300 shadow-sm group">
                <div className="flex items-start gap-5 flex-row-reverse">
                  <div className="mt-1 text-primary group-hover:scale-110 transition-transform">
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">لماذا تختار <br/><span className="text-primary">CoreLogic</span></h2>
              <p className="text-foreground/60 leading-relaxed text-lg">
                نحن شركاء في رحلة تحولك الرقمي. نهجنا يركز بالكامل على أهداف عملك، مما يؤدي إلى أنظمة قابلة للتوسع تنمو معك.
              </p>
            </div>
            
            <ul className="space-y-4">
              {["حلول مخصصة بالكامل", "التركيز على أهداف الأعمال", "بنية قابلة للتوسع", "صيانة ودعم طويل الأمد", "تسليم سريع وفعال"].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <ShieldCheck size={14} />
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">استراتيجيتنا</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">خارطة طريق واضحة لنقل برمجياتك من الفكرة الأولية إلى الإطلاق.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative text-right">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background/50 border border-slate-200/60 p-8 rounded-3xl hover:shadow-lg hover:border-primary/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="text-5xl font-bold text-foreground/10 mb-6 group-hover:text-primary/20 transition-colors">
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">قطاعات نخدمها</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {industries.map((ind, i) => (
              <div key={i} className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-foreground/10 bg-background text-foreground/80 hover:border-primary/30 transition-all font-medium text-sm shadow-sm cursor-default hover:shadow-md">
                <ind.icon size={16} className="text-primary" />
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
            className="p-12 md:p-24 bg-gradient-to-bl from-primary/10 via-primary/5 to-background rounded-[3rem] border border-primary/10 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                دعنا نبني نظاماً <br />
                <span className="text-primary">يناسب عملك تماماً.</span>
              </h2>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                توقف عن الاعتماد على الأدوات العامة الجاهزة. ابدأ المحادثة اليوم لتصميم حل رقمي حصري لنجاحك.
              </p>
              <div className="pt-4 flex justify-center">
                <Link href="/ar/contact">
                  <button className="px-10 py-5 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2">
                    ابدأ مشروعك اليوم
                    <ArrowLeft size={20} />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
