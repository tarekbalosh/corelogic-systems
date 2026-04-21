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

const aiServices = [
    { title: "Business Process Automation", icon: Workflow, desc: "Eliminate repetitive tasks and streamline complex operations with intelligent robotic process automation (RPA)." },
    { title: "AI Chatbots & Virtual Assistants", icon: Bot, desc: "Deliver 24/7 hyper-personalized customer support and internal HR assistance using advanced conversational AI orchestration." },
    { title: "Data Analysis & Insights", icon: LineChart, desc: "Transform raw data into actionable intelligence. Our machine learning models detect patterns and predict future trends." },
    { title: "Machine Learning Solutions", icon: BrainCircuit, desc: "Custom-trained neural architectures designed to solve unique organizational challenges and optimize decision workflows." },
    { title: "Workflow Automation Systems", icon: Network, desc: "Connect disparate departments through automated routing, intelligent document processing, and adaptive smart contracts." },
    { title: "API & System Integration", icon: Combine, desc: "Seamlessly inject state-of-the-art AI capabilities into your existing legacy software without costly infrastructure overhauls." }
];

const benefits = [
    { title: "Increase Productivity", icon: TrendingUp, desc: "Multiply your workforce output by letting AI handle the heavy lifting." },
    { title: "Reduce Manual Work", icon: Hand, desc: "Free your team from tedious data entry and administrative bottlenecks." },
    { title: "Faster Decision-Making", icon: Zap, desc: "Rely on predictive analytics to make critical choices with absolute confidence." },
    { title: "Scalable Solutions", icon: Server, desc: "Systems designed to grow infinitely with your business volume." },
    { title: "Customer Experience", icon: SmilePlus, desc: "Provide flawless, instant, and personalized interactions at scale." }
];

const industries = [
    "E-commerce", "Financial Services", "Healthcare", "Logistics & Supply", "Manufacturing", "Customer Service Centers", "Marketing Agencies", "Real Estate"
];

const processSteps = [
    { title: "Consultation & Analysis", icon: MessagesSquare, desc: "We map out your current workflows to identify high-ROI automation targets." },
    { title: "Strategy & Planning", icon: Map, desc: "Architecting a secure roadmap tailored to integrate safely with your data infrastructure." },
    { title: "AI Model Development", icon: Cpu, desc: "Training bespoke neural networks and deploying robust backend orchestration." },
    { title: "System Integration", icon: Blocks, desc: "Embedding our intelligent solutions natively into your preferred operational ecosystem." },
    { title: "Testing & Optimization", icon: TestTubes, desc: "Rigorous staging validation ensuring precision and hallucination-free outputs." },
    { title: "Ongoing Support", icon: LifeBuoy, desc: "Continuous model refinement and 24/7 technical monitoring." }
];

const whyUs = [
    { title: "AI-Focused Expertise", icon: ShieldCheck, desc: "A team entirely dedicated to advanced neural networks and deep learning protocols." },
    { title: "Custom Solutions", icon: Wrench, desc: "We build from the ground up. No rigid templates, no generic out-of-the-box limitations." },
    { title: "Fast Implementation", icon: FastForward, desc: "Agile methodologies ensure swift deployment, reducing critical time-to-market." },
    { title: "Continuous Improvement", icon: Recycle, desc: "Your models continuously learn and evolve to handle newly introduced edge-cases." },
    { title: "Business-Oriented", icon: Briefcase, desc: "We prioritize tangible ROI and strategic growth over flashy, unusable tech experiments." }
];

export default function AiSolutionsPage() {
    return (
        <div className="bg-background min-h-screen text-foreground overflow-hidden">
            {/* 1. Hero Section */}
            <section className="relative pt-40 pb-20 px-6 min-h-[95vh] flex items-center">
                <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
                <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black font-heading tracking-tighter leading-[1.1]">
                            AI Solutions <br />
                            <span className="text-gradient">& Automation</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/50 max-w-lg leading-relaxed font-medium">
                            Transform your business with intelligent automation and bespoke AI-powered systems. Achieve unparalleled operational speed and accuracy.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 pt-4">
                            <Link href="/contact">
                                <NeonButton size="lg" variant="primary">Start Your AI Journey</NeonButton>
                            </Link>
                            <Link href="/contact">
                                <NeonButton size="lg" variant="outline">Consult an Expert</NeonButton>
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative flex items-center justify-center p-8 h-[400px] lg:h-[500px]"
                    >
                         {/* We recycle the transparent brain holographic image from the earlier task to provide visual continuity */}
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
            <section className="py-24 px-6 relative border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-secondary mb-4">Value Proposition</h2>
                        <h3 className="text-3xl md:text-5xl font-black font-heading tracking-tight leading-tight">
                            Cut Costs. <span className="text-gradient">Accelerate Growth.</span>
                        </h3>
                    </motion.div>
                    <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-lg md:text-xl text-white/60 leading-relaxed max-w-4xl mx-auto">
                        Integrating Artificial Intelligence isn’t about replacing humans; it’s about elevating them. By intelligently automating repetitive manual workflows and deploying rapid data analysis, we allow your core team to pivot away from administrative drudgery and squarely onto high-impact strategic initiatives.
                    </motion.p>
                </div>
            </section>

            {/* 3. Our AI Services */}
            <section className="py-32 px-6 relative">
                <div className="absolute top-1/2 left-0 w-1/3 h-[500px] bg-primary/10 blur-[150px] pointer-events-none -translate-y-1/2" />
                <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center">
                        <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Our AI <span className="text-gradient">Services</span></h2>
                        <p className="text-white/50 mt-4 text-lg">Sophisticated architectures converted into practical business tools.</p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {aiServices.map((sol, i) => (
                            <motion.div 
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } } }}
                                className="glass-card p-8 rounded-[2rem] group hover:border-secondary/30 transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                    <sol.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold font-heading tracking-tight mb-4 group-hover:text-secondary transition-colors">{sol.title}</h3>
                                <p className="text-white/60 leading-relaxed text-sm">{sol.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Key Benefits & 5. Use Cases Combined Layout */}
            <section className="py-32 px-6 bg-surface border-y border-white/5 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                   
                   {/* Left: Benefits */}
                   <div className="space-y-12">
                       <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Key <span className="text-gradient">Benefits</span></h2>
                        </motion.div>

                        <div className="space-y-8">
                            {benefits.map((feat, i) => (
                                <motion.div 
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { delay: i * 0.1 } } }}
                                    className="flex gap-4 items-start group"
                                >
                                    <div className="shrink-0 p-3 rounded-xl bg-white/5 text-primary group-hover:text-secondary transition-colors">
                                        <feat.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold font-heading mb-1">{feat.title}</h3>
                                        <p className="text-white/50 text-sm leading-relaxed">{feat.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Use Cases */}
                    <div className="space-y-12">
                         <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                            <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tighter text-white">Targeted <span className="text-primary">Use Cases</span></h2>
                            <p className="text-white/50 mt-4">We deliver pre-trained foundational success across multiple domains.</p>
                        </motion.div>
                        
                        <div className="flex flex-wrap gap-4">
                            {industries.map((industry, i) => (
                                <motion.div
                                     key={i}
                                     initial="hidden"
                                     whileInView="visible"
                                     viewport={{ once: true }}
                                     variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.05 } } }}
                                     className="px-6 py-3 rounded-full border border-white/10 bg-white/5 text-sm font-semibold tracking-wide flex items-center gap-2 hover:bg-white/10 hover:border-white/30 transition-all cursor-default"
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
            <section className="py-32 px-6 max-w-7xl mx-auto lg:px-8">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">How It <span className="text-gradient">Works</span></h2>
                    <p className="text-white/50 mt-4 text-lg">A zero-friction integration strategy.</p>
                </motion.div>

                <div className="relative border-l-2 border-white/10 ml-6 md:ml-12 pl-10 md:pl-16 space-y-20">
                    {processSteps.map((step, i) => (
                         <motion.div 
                            key={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
                            className="relative group"
                         >
                            <div className="absolute -left-[45px] md:-left-[71px] top-1 w-6 h-6 rounded-full bg-background border-2 border-secondary group-hover:bg-secondary group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300 z-10" />
                            <div className="hidden md:block absolute -left-[56px] top-4 w-10 h-0.5 bg-white/10 group-hover:bg-secondary/50 transition-colors" />
                            
                            <div className="glass-card p-8 rounded-2xl border-white/5 hover:border-secondary/20 transition-colors duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                     <div className="p-3 rounded-lg bg-white/5 text-secondary">
                                        <step.icon size={24} />
                                     </div>
                                     <h3 className="text-2xl font-bold font-heading tracking-tight text-white/90">{step.title}</h3>
                                </div>
                                <p className="text-white/60 leading-relaxed">{step.desc}</p>
                            </div>
                         </motion.div>
                    ))}
                </div>
            </section>

            {/* 7. Why Choose Us */}
            <section className="py-24 px-6 bg-surface border-t border-white/5">
                 <div className="max-w-7xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Why Choose <span className="text-primary">CoreLogic</span></h2>
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
                                <p className="text-white/50 text-[13px]">{reason.desc}</p>
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
                        className="glass-dark p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(6,182,212,0.1)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-primary/20 opacity-50" />
                        
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tighter text-white">Ready to <span className="text-gradient">Automate?</span></h2>
                            <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">
                                Leap ahead of the competition by unleashing the full power of Artificial Intelligence within your organization today.
                            </p>
                            <div className="pt-6 flex justify-center">
                                <Link href="/contact">
                                    <NeonButton size="lg" variant="primary" className="pl-6 group px-10">
                                        Get Free Consultation 
                                        <ArrowRight size={20} className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                                    </NeonButton>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                 </div>
            </section>
        </div>
    );
}
