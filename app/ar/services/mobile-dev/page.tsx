"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Layers, 
  ShieldCheck, 
  Zap, 
  WifiOff, 
  Bell, 
  ArrowRight,
  MonitorSmartphone,
  Briefcase,
  ShoppingCart,
  Truck,
  GraduationCap,
  ArrowLeft
} from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

const solutions = [
  { title: "تطوير تطبيقات أندرويد", desc: "تطبيقات أصلية عالية الأداء مصممة لنظام أندرويد المتنوع.", icon: Smartphone },
  { title: "تطوير تطبيقات iOS", desc: "تجارب سلسة ومميزة مصممة لأجهزة iPhone و iPad.", icon: MonitorSmartphone },
  { title: "تطبيقات متعددة المنصات", desc: "وحد كود البرمجة الخاص بك وأطلق تطبيقك في كل مكان دون التضحية بالجودة.", icon: Layers },
  { title: "تطبيقات الأعمال", desc: "أدوات داخلية وتطبيقات مؤسسية لتبسيط عملياتك.", icon: Briefcase },
  { title: "تطبيقات التجارة الإلكترونية", desc: "تجارب تسوق غنية بالميزات لزيادة المبيعات والاحتفاظ بالعملاء.", icon: ShoppingCart },
  { title: "حلول مخصصة", desc: "بنى تطبيقات محمولة مصممة خصيصاً لتناسب مجالك الفريد.", icon: Zap },
];

const features = [
  { title: "أداء سريع", desc: "أوقات استجابة محسنة، حركات سلسة، وبناء خفيف الوزن.", icon: Zap },
  { title: "بنية آمنة", desc: "تشفير شامل، مصادقة آمنة، وحماية للبيانات.", icon: ShieldCheck },
  { title: "دعم العمل بدون إنترنت", desc: "حافظ على تفاعل المستخدمين حتى عند فقدان الاتصال بالإنترنت.", icon: WifiOff },
  { title: "إشعارات الدفع (Push)", desc: "زيادة الاحتفاظ بالعملاء من خلال رسائل في الوقت المناسب.", icon: Bell },
];

const processSteps = [
  { num: "01", title: "الفكرة والاستشارة", desc: "نحلل أهداف عملك ونخطط لخارطة الطريق الاستراتيجية." },
  { num: "02", title: "تصميم واجهة وتجربة المستخدم", desc: "صياغة واجهات جميلة وبديهية سيحبها مستخدموك." },
  { num: "03", title: "تطوير التطبيق", desc: "كتابة كود نظيف وقابل للتوسع لإحياء تطبيقك." },
  { num: "04", title: "الاختبار وضمان الجودة", desc: "اختبارات صارمة لضمان تجربة مثالية خالية من الأخطاء." },
  { num: "05", title: "الإطلاق والنشر", desc: "إطلاق تطبيقك بسلاسة على متاجر App Store و Google Play." },
  { num: "06", title: "الصيانة والدعم", desc: "دعم طويل الأمد، تحديثات، ومراقبة ما بعد الإطلاق." },
];

const industries = [
  { name: "المطاعم", icon: ShoppingCart },
  { name: "التجارة الإلكترونية", icon: ShoppingCart },
  { name: "الخدمات اللوجستية", icon: Truck },
  { name: "التعليم", icon: GraduationCap },
  { name: "أتمتة الأعمال", icon: Briefcase },
];

export default function MobileAppDevelopmentPage() {
  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-48 pb-32 px-6 min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Advanced Mesh Gradient Background */}
        <div className="absolute inset-0 z-0 bg-background">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-violet-500/10 via-purple-400/5 to-transparent blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tl from-indigo-500/10 via-blue-400/5 to-transparent blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none" />
          
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8 text-center lg:text-right">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/80 backdrop-blur-md text-violet-600 text-sm font-semibold shadow-sm border border-violet-500/20 hover:border-violet-500/40 transition-colors">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
              </span>
              <span>وكالة تطوير تطبيقات رائدة</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight leading-[1.05]">
              تطوير تطبيقات <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-violet-600 to-indigo-500">الجوال المخصصة</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/60 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              نبني تطبيقات قوية وقابلة للتوسع وآمنة مصممة خصيصاً للشركات والمؤسسات على منصتي Android و iOS.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/ar/contact">
                <button className="px-8 py-4 bg-gradient-to-l from-violet-600 to-indigo-600 text-white rounded-2xl font-semibold hover:opacity-90 shadow-[0_8px_30px_rgba(124,58,237,0.2)] hover:shadow-[0_8px_40px_rgba(124,58,237,0.3)] hover:-translate-y-1 transition-all text-lg flex items-center gap-2">
                  ابدأ مشروع تطبيقك
                  <ArrowLeft size={20} />
                </button>
              </Link>
              <Link href="#solutions">
                <button className="px-8 py-4 bg-background/50 backdrop-blur-md text-foreground rounded-2xl font-semibold hover:bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-all text-lg shadow-sm">
                  استعرض الحلول
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Hero Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:flex relative h-[550px] items-center justify-center"
          >
            {/* Main Phone Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[560px] bg-background/40 backdrop-blur-2xl rounded-[3rem] border-8 border-white/40 shadow-[0_30px_60px_-15px_rgba(124,58,237,0.15)] p-4 flex flex-col overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/40 rounded-b-2xl backdrop-blur-md z-20" />
              
              <div className="flex-1 w-full mt-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600">
                    <Smartphone size={20} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-foreground/5" />
                </div>
                <div className="w-3/4 h-6 bg-foreground/10 rounded-full mt-4" />
                <div className="w-1/2 h-4 bg-foreground/5 rounded-full" />
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="w-full h-24 bg-violet-500/10 rounded-2xl" />
                  <div className="w-full h-24 bg-indigo-500/10 rounded-2xl" />
                </div>
                <div className="w-full h-32 bg-background/80 rounded-2xl border border-foreground/5 mt-auto mb-2" />
              </div>
            </div>
            
            <motion.div 
              animate={{ y: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute top-1/4 -right-4 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-full flex items-center justify-center">
                <Zap size={20} />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">تطبيقات سريعة</p>
                <p className="text-xs text-foreground/50">iOS و Android</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [15, -15, 15] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="absolute bottom-1/4 -left-8 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">أمان عالي</p>
                <p className="text-xs text-foreground/50">بيانات مشفرة</p>
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
              لماذا نذهب إلى الموبايل؟
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">عملك التجاري، في جيبهم</h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-3xl mx-auto">
              في المشهد الرقمي اليوم، لم يعد تطبيق الهاتف المحمول مجرد برنامج—بل هو قناة اتصال مباشرة مع عملائك.
              نحن نصمم تجارب مستخدم بديهية لحل مشاكل الأعمال المعقدة، وتبسيط العمليات، ودفع نمو لا مثيل له. دعنا نحول رؤيتك إلى تطبيق يحب المستخدمون العودة إليه.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Our Mobile App Solutions */}
      <section id="solutions" className="py-24 px-6 relative">
        <div className="absolute right-0 top-1/3 w-[400px] h-[400px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">حلول الموبايل لدينا</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">تطوير تطبيقات شامل مصمم خصيصاً لاحتياجات السوق الخاص بك.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {solutions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background/80 backdrop-blur-3xl p-8 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-violet-500/20 transition-all duration-300 group text-right"
              >
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-violet-600 group-hover:bg-violet-500/10 transition-colors mb-6 shadow-sm mr-auto ml-0 md:ml-auto md:mr-0">
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-background p-8 rounded-3xl border border-foreground/10 hover:border-violet-500/20 hover:shadow-md transition-all duration-300 shadow-sm group">
                <div className="flex items-start gap-5">
                  <div className="mt-1 text-violet-600 group-hover:scale-110 transition-transform">
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

          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2 text-right">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">بنيت من أجل <br/><span className="text-violet-600">التوسع.</span></h2>
              <p className="text-foreground/60 leading-relaxed text-lg">
                يركز فريق التطوير لدينا على التصميم عالي الجودة، والتسليم السريع، والبنى الجاهزة للمستقبل. نحن لا نبني تطبيقات فحسب؛ بل نهندس حلولاً قابلة للتوسع مع دعم طويل الأمد.
              </p>
            </div>
            
            <ul className="space-y-4">
              {["فريق تطوير محترف", "التركيز على الجودة والتصميم", "تسليم سريع", "دعم طويل الأمد"].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600 shrink-0">
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">آلية عملنا</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">دورة تطوير شفافة وسلسة من الفكرة الأولية إلى متجر التطبيقات.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background/50 border border-slate-200/60 p-8 rounded-3xl hover:shadow-lg hover:border-violet-500/20 transition-all group relative overflow-hidden text-right"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/10 transition-colors" />
                <div className="text-5xl font-bold text-foreground/10 mb-6 group-hover:text-violet-500/20 transition-colors">
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
              <div key={i} className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-foreground/10 bg-background text-foreground/80 hover:border-violet-500/30 transition-all font-medium text-sm shadow-sm cursor-default hover:shadow-md">
                <ind.icon size={16} className="text-violet-600" />
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
            className="p-12 md:p-24 bg-gradient-to-bl from-violet-500/10 via-indigo-500/5 to-background rounded-[3rem] border border-violet-500/10 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                حوّل فكرتك إلى <br />
                <span className="text-violet-600">تطبيق جوال قوي.</span>
              </h2>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                هل أنت مستعد لنقل عملك إلى المستوى التالي؟ ابدأ المحادثة اليوم ودعنا نبني تطبيقاً سيحبه مستخدموك.
              </p>
              <div className="pt-4 flex justify-center">
                <Link href="/ar/contact">
                  <button className="px-10 py-5 bg-gradient-to-l from-violet-600 to-indigo-600 text-white rounded-full font-semibold hover:opacity-90 shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2">
                    احصل على استشارة مجانية
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
