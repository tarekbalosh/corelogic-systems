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
    ShieldCheck, Wrench, FastForward, Recycle, Briefcase, ArrowRight, CheckCircle2
} from "lucide-react";

// You can translate the rest of the arrays as needed.
const aiServices = [
    { title: "أتمتة العمليات التجارية", icon: Workflow, desc: "تخلص من المهام المتكررة وبسّط العمليات المعقدة." },
    { title: "روبوتات المحادثة الذكية", icon: Bot, desc: "وفر دعم عملاء فائق التخصيص على مدار الساعة." },
    // ...
];

export default function ArabicAiSolutionsPage() {
    return (
        <div className="bg-background min-h-screen text-foreground overflow-hidden">
            {/* 1. Hero Section */}
            <section className="relative pt-40 pb-20 px-6 min-h-[95vh] flex items-center">
                <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
                <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black font-heading tracking-tighter leading-[1.1]">
                            حلول الأتمتة <br />
                            <span className="text-gradient">والذكاء الاصطناعي للشركات</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/50 max-w-lg leading-relaxed font-medium">
                            في ظل التطور التقني المتسارع، لم يعد الاعتماد على الإدارة التقليدية كافياً. في Corelogic Systems، نقدم <strong>حلول الأتمتة بالذكاء الاصطناعي</strong> المصممة خصيصاً للارتقاء بكفاءة الشركات وأتمتة المهام الروتينية. سواء كنت تدير شركة ناشئة في الرياض أو مؤسسة في ماليزيا، فإن فريقنا من الخبراء جاهز لتصميم أنظمة ذكية تلبي تطلعاتك. ابدأ رحلة التحول الرقمي معنا اليوم.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 pt-4">
                            <Link href="/ar/contact" className="w-full sm:w-auto">
                                <NeonButton size="lg" variant="primary" className="w-full">ابدأ رحلة الذكاء الاصطناعي</NeonButton>
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
            
            {/* The rest of the page components follow similarly... */}
            <section className="py-24 px-6 relative border-y border-foreground/5 bg-white/[0.02]">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-secondary mb-4">القيمة المضافة</h2>
                        <h3 className="text-3xl md:text-5xl font-black font-heading tracking-tight leading-tight">
                            قلل التكاليف. <span className="text-gradient">سرّع النمو.</span>
                        </h3>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
