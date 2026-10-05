"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { NeonButton } from "@/components/neon-button";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { 
    Bot, Workflow, LineChart, BrainCircuit, Network, Combine,
    TrendingUp, Hand, Zap, Server, SmilePlus,
    MessagesSquare, Map, Cpu, Blocks, TestTubes, LifeBuoy,
    ShieldCheck, Wrench, FastForward, Recycle, Briefcase, ArrowLeft, CheckCircle2
} from "lucide-react";

const aiServices = [
    { title: "أتمتة العمليات التجارية", icon: Workflow, desc: "تخلص من المهام المتكررة وبسّط العمليات المعقدة باستخدام أتمتة العمليات الروبوتية الذكية (RPA)." },
    { title: "روبوتات المحادثة الذكية", icon: Bot, desc: "وفر دعماً فائق التخصيص للعملاء على مدار الساعة، ومساعدين داخليين للشركة باستخدام الذكاء الاصطناعي." },
    { title: "تحليل البيانات واستخراج الرؤى", icon: LineChart, desc: "حوّل بياناتك الخام إلى معلومات قابلة للتنفيذ. نماذجنا تكتشف الأنماط وتتوقع الاتجاهات المستقبلية." },
    { title: "حلول تعلم الآلة (Machine Learning)", icon: BrainCircuit, desc: "بنى عصبية مدربة خصيصاً لحل تحدياتك التنظيمية الفريدة وتحسين سير اتخاذ القرار." },
    { title: "أنظمة أتمتة سير العمل", icon: Network, desc: "ربط الأقسام المختلفة من خلال التوجيه الآلي، والمعالجة الذكية للمستندات، والعقود الذكية." },
    { title: "تكامل واجهات برمجة التطبيقات", icon: Combine, desc: "أدخل قدرات الذكاء الاصطناعي المتطورة بسلاسة في برمجياتك الحالية دون بنية تحتية باهظة." }
];

const benefits = [
    { title: "زيادة الإنتاجية", icon: TrendingUp, desc: "ضاعف إنتاجية فريقك بترك الذكاء الاصطناعي يقوم بالأعمال الروتينية الشاقة." },
    { title: "تقليل العمل اليدوي", desc: "حرر فريقك من إدخال البيانات الممل والاختناقات الإدارية.", icon: Hand },
    { title: "اتخاذ قرارات أسرع", desc: "اعتمد على التحليلات التنبؤية لاتخاذ خيارات حاسمة بثقة تامة.", icon: Zap },
    { title: "حلول قابلة للتوسع", desc: "أنظمة مصممة لتنمو بلا حدود مع زيادة حجم أعمالك.", icon: Server },
    { title: "تحسين تجربة العملاء", desc: "توفير تفاعلات خالية من العيوب، فورية، ومخصصة على نطاق واسع.", icon: SmilePlus }
];

const industries = [
    "التجارة الإلكترونية", "الخدمات المالية", "الرعاية الصحية", "الخدمات اللوجستية والتوريد", "التصنيع", "مراكز خدمة العملاء", "وكالات التسويق", "العقارات"
];

const processSteps = [
    { title: "الاستشارة والتحليل", icon: MessagesSquare, desc: "نرسم سير العمل الحالي الخاص بك لتحديد أهداف الأتمتة ذات العائد المرتفع." },
    { title: "الاستراتيجية والتخطيط", icon: Map, desc: "هندسة خارطة طريق آمنة مصممة للتكامل بأمان مع بنيتك التحتية للبيانات." },
    { title: "تطوير نموذج الذكاء الاصطناعي", icon: Cpu, desc: "تدريب شبكات عصبية مخصصة ونشر أنظمة خلفية قوية." },
    { title: "تكامل النظام", icon: Blocks, desc: "تضمين حلولنا الذكية بشكل أصلي في بيئة عملك المفضلة." },
    { title: "الاختبار والتحسين", icon: TestTubes, desc: "اختبار صارم لضمان الدقة وخلو المخرجات من الأخطاء." },
    { title: "الدعم المستمر", icon: LifeBuoy, desc: "التحسين المستمر للنموذج والمراقبة الفنية على مدار الساعة." }
];

const whyUs = [
    { title: "خبرة متخصصة في الذكاء الاصطناعي", icon: ShieldCheck, desc: "فريق مكرس بالكامل للشبكات العصبية المتقدمة وبروتوكولات التعلم العميق." },
    { title: "حلول مخصصة", icon: Wrench, desc: "نحن نبني من الصفر. لا قوالب جاهزة صلبة، ولا قيود تقنية." },
    { title: "تنفيذ سريع", icon: FastForward, desc: "منهجيات مرنة تضمن النشر السريع، مما يقلل وقت الوصول إلى السوق." },
    { title: "تحسين مستمر", icon: Recycle, desc: "نماذجك تتعلم وتتطور باستمرار للتعامل مع الحالات الجديدة." },
    { title: "التركيز على الأعمال", icon: Briefcase, desc: "نعطي الأولوية لعائد الاستثمار الملموس والنمو الاستراتيجي على التجارب التقنية الخيالية." }
];

export default function AiSolutionsPage() {
    return (
        <div className="bg-background min-h-screen text-foreground overflow-hidden font-sans">
            {/* 1. Hero Section */}
            <section className="relative pt-40 pb-20 px-6 min-h-[95vh] flex items-center">
                <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
                <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8 text-center lg:text-right">
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black font-heading tracking-tighter leading-[1.1]">
                            حلول الأتمتة <br />
                            <span className="text-gradient">والذكاء الاصطناعي للمؤسسات</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/50 max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
                            في ظل التطور التقني المتسارع، لم يعد الاعتماد على العمليات اليدوية كافياً. في Corelogic، نقدم <strong>حلول الأتمتة بالذكاء الاصطناعي</strong> المصممة خصيصاً للارتقاء بكفاءة الشركات وأتمتة المهام الروتينية وتقليل التكاليف التشغيلية. من روبوتات المحادثة الذكية إلى التحليلات التنبؤية، يقوم فريقنا ببناء أنظمة قابلة للتوسع تعمل على مدار الساعة. ابدأ رحلة التحول الرقمي معنا اليوم لتبقى في صدارة المنافسة العالمية.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 pt-4 justify-center lg:justify-start">
                            <Link href="/ar/contact" className="w-full sm:w-auto">
                                <NeonButton size="lg" variant="primary" className="w-full pl-6 group">
                                    ابدأ رحلة الذكاء الاصطناعي
                                    <ArrowLeft size={20} className="mr-2 inline-block group-hover:-translate-x-1 transition-transform" />
                                </NeonButton>
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative flex items-center justify-center p-8 h-[400px] lg:h-[500px]"
                    >
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[120%] h-[120%] border-t-2 border-primary/20 rounded-full animate-[spin_8s_linear_infinite] [transform-style:preserve-3d] [transform:rotateX(60deg)]" />
                            <div className="absolute w-[100%] h-[100%] border-2 border-secondary/10 rounded-full animate-[spin_4s_linear_infinite_reverse] [transform-style:preserve-3d] [transform:rotateX(-45deg)]" />
                        </div>
                        <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                        
                        <div className="animate-float" style={{ mixBlendMode: "screen" }}>
                            <Image
                                src="/ai_brain_hologram_1776488427249.png"
                                alt="AI Neural Data Processor"
                                width={550}
                                height={550}
                                className="drop-shadow-[0_0_80px_rgba(6,182,212,0.6)]"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. About the Service */}
            <section className="py-24 px-6 relative border-y border-foreground/5 bg-white/[0.02]">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-secondary mb-4">القيمة المضافة</h2>
                        <h3 className="text-3xl md:text-5xl font-black font-heading tracking-tight leading-tight">
                            قلل التكاليف. <span className="text-gradient">سرّع النمو.</span>
                        </h3>
                    </motion.div>
                    <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-lg md:text-xl text-foreground/60 leading-relaxed max-w-4xl mx-auto">
                        دمج الذكاء الاصطناعي لا يهدف إلى استبدال البشر؛ بل إلى الارتقاء بهم. من خلال الأتمتة الذكية لسير العمل اليدوي المتكرر والتحليل السريع للبيانات، نسمح لفريقك الأساسي بالابتعاد عن العمل الإداري المرهق والتركيز بشكل مباشر على المبادرات الاستراتيجية عالية التأثير.
                    </motion.p>
                </div>
            </section>

            {/* 3. Our AI Services */}
            <section className="py-32 px-6 relative">
                <div className="absolute top-1/2 right-0 w-1/3 h-[500px] bg-primary/10 blur-[150px] pointer-events-none -translate-y-1/2" />
                <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center">
                        <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">خدمات <span className="text-gradient">الذكاء الاصطناعي</span></h2>
                        <p className="text-foreground/50 mt-4 text-lg">بنى تقنية متطورة محوّلة إلى أدوات أعمال عملية.</p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-right">
                        {aiServices.map((sol, i) => (
                            <motion.div 
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } } }}
                                className="glass-card p-8 rounded-[2rem] group hover:border-secondary/30 transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-foreground transition-all duration-300 mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)] mr-auto ml-0 md:ml-auto md:mr-0">
                                    <sol.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold font-heading tracking-tight mb-4 group-hover:text-secondary transition-colors">{sol.title}</h3>
                                <p className="text-foreground/60 leading-relaxed text-sm">{sol.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Key Benefits & 5. Use Cases Combined Layout */}
            <section className="py-32 px-6 bg-surface border-y border-foreground/5 relative text-right">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                   
                   {/* Left: Benefits */}
                   <div className="space-y-12">
                       <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">الفوائد <span className="text-gradient">الرئيسية</span></h2>
                        </motion.div>

                        <div className="space-y-8">
                            {benefits.map((feat, i) => (
                                <motion.div 
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { delay: i * 0.1 } } }}
                                    className="flex gap-4 items-start group flex-row-reverse"
                                >
                                    <div className="shrink-0 p-3 rounded-xl bg-foreground/5 text-primary group-hover:text-secondary transition-colors">
                                        <feat.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold font-heading mb-1">{feat.title}</h3>
                                        <p className="text-foreground/50 text-sm leading-relaxed">{feat.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Use Cases */}
                    <div className="space-y-12">
                         <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                            <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tighter text-foreground">حالات استخدام <span className="text-primary">مستهدفة</span></h2>
                            <p className="text-foreground/50 mt-4">نقدم أسس نجاح مُدربة مسبقاً عبر عدة قطاعات.</p>
                        </motion.div>
                        
                        <div className="flex flex-wrap gap-4 justify-end">
                            {industries.map((industry, i) => (
                                <motion.div
                                     key={i}
                                     initial="hidden"
                                     whileInView="visible"
                                     viewport={{ once: true }}
                                     variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.05 } } }}
                                     className="px-6 py-3 rounded-full border border-foreground/10 bg-foreground/5 text-sm font-semibold tracking-wide flex items-center gap-2 hover:bg-foreground/10 hover:border-foreground/30 transition-all cursor-default flex-row-reverse"
                                >
                                    <CheckCircle2 size={16} className="text-secondary" />
                                    {industry}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* 6. How It Works (Process) */}
            <section className="py-32 px-6 max-w-7xl mx-auto lg:px-8 text-right">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">آلية <span className="text-gradient">العمل</span></h2>
                    <p className="text-foreground/50 mt-4 text-lg">استراتيجية تكامل خالية من التعقيد.</p>
                </motion.div>

                <div className="relative border-r-2 border-foreground/10 mr-6 md:mr-12 pr-10 md:pr-16 space-y-20">
                    {processSteps.map((step, i) => (
                         <motion.div 
                            key={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
                            className="relative group"
                         >
                            <div className="absolute -right-[45px] md:-right-[71px] top-1 w-6 h-6 rounded-full bg-background border-2 border-secondary group-hover:bg-secondary group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300 z-10" />
                            <div className="hidden md:block absolute -right-[56px] top-4 w-10 h-0.5 bg-foreground/10 group-hover:bg-secondary/50 transition-colors" />
                            
                            <div className="glass-card p-8 rounded-2xl border-foreground/5 hover:border-secondary/20 transition-colors duration-300">
                                <div className="flex items-center gap-4 mb-4 flex-row-reverse">
                                     <div className="p-3 rounded-lg bg-foreground/5 text-secondary">
                                        <step.icon size={24} />
                                     </div>
                                     <h3 className="text-2xl font-bold font-heading tracking-tight text-foreground/90">{step.title}</h3>
                                </div>
                                <p className="text-foreground/60 leading-relaxed">{step.desc}</p>
                            </div>
                         </motion.div>
                    ))}
                </div>
            </section>

            {/* 7. Why Choose Us */}
            <section className="py-24 px-6 bg-surface border-t border-foreground/5">
                 <div className="max-w-7xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">لماذا تختار <span className="text-primary">CoreLogic</span></h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {whyUs.map((reason, i) => (
                             <motion.div 
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.1 } } }}
                                className="glass-card p-6 text-center rounded-2xl group hover:-translate-y-2"
                            >
                                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(124,58,237,0.1)]">
                                    <reason.icon size={24} />
                                </div>
                                <h4 className="font-bold font-heading text-[15px] mb-2">{reason.title}</h4>
                                <p className="text-foreground/50 text-[13px]">{reason.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                 </div>
            </section>

            {/* 8. Call To Action Section */}
            <section className="py-32 px-6">
                 <div className="max-w-5xl mx-auto">
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true }} 
                        variants={fadeInUp}
                        className="glass-dark p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden border border-foreground/10 shadow-[0_0_60px_rgba(6,182,212,0.1)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-primary/20 opacity-50" />
                        
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tighter text-foreground">جاهز <span className="text-gradient">للأتمتة؟</span></h2>
                            <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
                                اسبق منافسيك بخطوات من خلال إطلاق العنان للقوة الكاملة للذكاء الاصطناعي داخل مؤسستك اليوم.
                            </p>
                            <div className="pt-6 flex justify-center">
                                <a href="https://wa.me/601169397149" target="_blank" rel="noopener noreferrer">
                                    <NeonButton size="lg" variant="primary" className="pl-6 group px-10">
                                        احصل على استشارة مجانية
                                        <ArrowLeft size={20} className="mr-2 inline-block group-hover:-translate-x-1 transition-transform" />
                                    </NeonButton>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                 </div>
            </section>
        </div>
    );
}
