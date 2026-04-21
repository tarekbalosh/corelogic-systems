"use client";

import React from "react";
import { motion } from "framer-motion";
import { NeonButton } from "@/components/neon-button";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { 
    LayoutDashboard, Cloud, Cpu, Layers, Link, 
    Zap, Shield, Smartphone, Database, Users,
    Search, PenTool, Code2, CheckCircle, Rocket, HeartHandshake,
    Star, Timer, Headphones, Smile, ArrowRight
} from "lucide-react";

const solutions = [
    { title: "Custom Web Applications", icon: LayoutDashboard, desc: "Tailor-made web solutions designed from scratch to precisely address your unique business objectives and operational workflows." },
    { title: "SaaS Platforms", icon: Cloud, desc: "Scalable, secure, and multi-tenant cloud-based software architectures offering subscription models and powerful centralized management." },
    { title: "Admin Dashboards", icon: Cpu, desc: "Intuitive, data-rich control panels providing real-time analytics, reporting, and complete administrative oversight." },
    { title: "Business Automation", icon: Layers, desc: "Automate repetitive tasks and streamline internal operations with intelligent web-based systems reducing human error." },
    { title: "API Integrations", icon: Link, desc: "Seamlessly connect disparate tools and third-party services into a unified, high-performing digital ecosystem." }
];

const features = [
    { title: "High Performance", icon: Zap, desc: "Lightning-fast load times and optimized resource delivery ensure your application handles spikes with zero downtime." },
    { title: "Security & Data Protection", icon: Shield, desc: "Enterprise-grade encryption, secure authentication architectures, and strict compliance with global data privacy standards." },
    { title: "Fully Responsive Design", icon: Smartphone, desc: "Flawless user experiences that adapt dynamically to any screen—from ultra-wide monitors down to mobile devices." },
    { title: "Scalable Architecture", icon: Database, desc: "Future-proof databases and serverless architectures structured to grow effortlessly alongside your user base." },
    { title: "User-Friendly Interface", icon: Users, desc: "Cinematic, intuitive UI/UX built on deep psychological research to boost engagement and user retention." }
];

const processSteps = [
    { title: "Planning & Analysis", icon: Search, desc: "Deep diving into your business needs to establish accurate technical requirements and architectural roadmaps." },
    { title: "UI/UX Design", icon: PenTool, desc: "Crafting wireframes, interactive prototypes, and a sleek visual identity to align perfectly with your brand aesthetic." },
    { title: "Development", icon: Code2, desc: "Writing clean, robust code across front-end frameworks and back-end services utilizing modern agile methodologies." },
    { title: "Testing", icon: CheckCircle, desc: "Rigorous automated and manual QA testing to ensure zero critical bugs and optimal performance prior to launch." },
    { title: "Deployment", icon: Rocket, desc: "Smooth provisioning of cloud infrastructure to deliver your application safely to the live production environment." },
    { title: "Support & Maintenance", icon: HeartHandshake, desc: "Continuous monitoring, proactive updates, and instant technical support to keep your app running perfectly." }
];

const whyUs = [
    { title: "Experienced Team", icon: Star, desc: "Industry veterans pushing the boundaries of what's possible." },
    { title: "Fast Delivery", icon: Timer, desc: "Rapid iterative cycles without ever sacrificing code quality." },
    { title: "Ongoing Support", icon: Headphones, desc: "24/7 technical assistance to safeguard your investment." },
    { title: "Client Focused", icon: Smile, desc: "Dedicated partnerships aligning tech with business goals." }
];

export default function WebDevServicePage() {
    return (
        <div className="bg-background min-h-screen text-foreground overflow-hidden">
            {/* 1. Hero Section */}
            <section className="relative pt-40 pb-20 px-6 min-h-[90vh] flex items-center">
                <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
                <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black font-heading tracking-tighter leading-[1.1]">
                            Web Application <br />
                            <span className="text-gradient">Development</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/50 max-w-lg leading-relaxed font-medium">
                            We engineer fast, scalable, and secure web applications built on state-of-the-art infrastructure to accelerate your digital transformation.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 pt-4">
                            <Link href="/contact" className="w-full sm:w-auto">
                                <NeonButton size="lg" variant="primary" className="w-full">Request a Quote</NeonButton>
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative flex items-center justify-center p-8 h-[400px] lg:h-[500px]"
                    >
                        {/* Abstract 3D Tech Background */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none perspective-[1000px]">
                            <div className="w-[110%] h-[110%] border border-primary/30 rounded-full animate-[spin_10s_linear_infinite] transform-gpu rotate-y-45 rotate-x-60" />
                            <div className="absolute w-[90%] h-[90%] border-2 border-secondary/20 rounded-full animate-[spin_15s_linear_infinite_reverse] transform-gpu -rotate-y-30 rotate-x-45" />
                            <div className="absolute w-[70%] h-[70%] border-t-[3px] border-accent/40 rounded-full animate-[spin_8s_linear_infinite] transform-gpu rotate-y-60 rotate-x-30" />
                            <div className="absolute w-[40%] h-[40%] bg-primary/10 rounded-full blur-[80px] animate-pulse" />
                        </div>
                        {/* Dashboard Hologram Concept */}
                        <motion.div 
                            className="relative z-10 glass-card p-6 w-full max-w-md animate-float rounded-2xl border-t border-primary/50 shadow-[0_0_50px_rgba(124,58,237,0.2)]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="w-1/3 h-2 bg-white/10 rounded-full" />
                            </div>
                            <div className="space-y-4">
                                <div className="h-8 bg-white/5 rounded-lg w-3/4" />
                                <div className="h-4 bg-white/5 rounded w-1/2" />
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="h-20 bg-primary/20 rounded-xl" />
                                    <div className="h-20 bg-secondary/20 rounded-xl" />
                                </div>
                                <div className="h-4 bg-white/5 rounded w-full mt-4" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 2. About the Service */}
            <section className="py-24 px-6 relative border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-secondary mb-4">About the Service</h2>
                        <h3 className="text-3xl md:text-5xl font-black font-heading tracking-tight leading-tight">
                            More than code. We build <span className="text-accent text-glow">business engines.</span>
                        </h3>
                    </motion.div>
                    <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-lg md:text-xl text-white/60 leading-relaxed">
                        Custom web application development is about creating powerful digital ecosystems that solve tangible operational pain points. We bypass complex jargon and focus purely on results—building scalable SaaS platforms, automated internal tools, and revenue-driving portals that empower your workforce and delight your customers.
                    </motion.p>
                </div>
            </section>

            {/* 3. Our Solutions */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center">
                        <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Our <span className="text-gradient">Solutions</span></h2>
                        <p className="text-white/50 mt-4 text-lg">Comprehensive tech architectures tailored to your operational demands.</p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {solutions.map((sol, i) => (
                            <motion.div 
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } } }}
                                className="glass-card p-8 rounded-[2rem] group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6">
                                    <sol.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold font-heading tracking-tight mb-4 group-hover:text-primary transition-colors">{sol.title}</h3>
                                <p className="text-white/60 leading-relaxed text-sm">{sol.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Key Features */}
            <section className="py-32 px-6 bg-surface border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-secondary/10 blur-[150px] pointer-events-none" />
                <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                   <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Key <span className="text-gradient">Features</span></h2>
                        <p className="text-white/50 mt-4 text-lg">The foundational pillars that guarantee long-term stability and success.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {features.map((feat, i) => (
                            <motion.div 
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { delay: i * 0.1 } } }}
                                className="flex gap-6 items-start"
                            >
                                <div className="shrink-0 p-4 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                    <feat.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-heading mb-3">{feat.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{feat.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Development Process */}
            <section className="py-32 px-6 max-w-7xl mx-auto lg:px-8">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Our <span className="text-gradient">Design Process</span></h2>
                    <p className="text-white/50 mt-4 text-lg">A systematic, risk-free methodology delivering production-ready platforms.</p>
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
                            {/* Node Dot */}
                            <div className="absolute -left-[45px] md:-left-[71px] top-1 w-6 h-6 rounded-full bg-background border-2 border-primary group-hover:bg-primary group-hover:shadow-[0_0_15px_rgba(124,58,237,0.6)] transition-all duration-300 z-10" />
                            {/* Horizontal Connector Line (desktop) */}
                            <div className="hidden md:block absolute -left-[56px] top-4 w-10 h-0.5 bg-white/10 group-hover:bg-primary/50 transition-colors" />
                            
                            <div className="glass-card p-8 rounded-2xl border-white/5 hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                     <div className="p-3 rounded-lg bg-white/5 text-primary">
                                        <step.icon size={24} />
                                     </div>
                                     <h3 className="text-2xl font-bold font-heading tracking-tight">{step.title}</h3>
                                </div>
                                <p className="text-white/60 leading-relaxed">{step.desc}</p>
                            </div>
                         </motion.div>
                    ))}
                </div>
            </section>

            {/* 6. Why Choose Us */}
            <section className="py-24 px-6 bg-surface">
                 <div className="max-w-7xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Why Choose <span className="text-accent">Us</span></h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyUs.map((reason, i) => (
                             <motion.div 
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.1 } } }}
                                className="glass-card p-6 text-center rounded-2xl group hover:border-accent/40"
                            >
                                <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                                    <reason.icon size={24} />
                                </div>
                                <h4 className="font-bold font-heading text-lg mb-2">{reason.title}</h4>
                                <p className="text-white/50 text-sm">{reason.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                 </div>
            </section>

            {/* 7. Call To Action Section */}
            <section className="py-32 px-6">
                 <div className="max-w-5xl mx-auto">
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true }} 
                        variants={fadeInUp}
                        className="glass-dark p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden border border-white/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-50" />
                        
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tighter">Ready to <span className="text-gradient">Innovate?</span></h2>
                            <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">
                                Partner with our elite engineering team to architect web applications that don't just exist—they lead markets.
                            </p>
                            <div className="pt-6 flex justify-center">
                                <NeonButton size="lg" variant="primary" className="pl-6 group">
                                    Start Your Project 
                                    <ArrowRight size={20} className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                                </NeonButton>
                            </div>
                        </div>
                    </motion.div>
                 </div>
            </section>
        </div>
    );
}
