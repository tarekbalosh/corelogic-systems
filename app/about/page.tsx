"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Target, 
  Eye, 
  Lightbulb, 
  Award, 
  TrendingUp, 
  Cpu,
  Zap, 
  ArrowRight
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { SectionTitle } from "@/components/section-title";
import { NeonButton } from "@/components/neon-button";
import { ParticleBackground } from "@/components/particle-background";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const values = [
  { title: "Innovation", description: "Pushing the boundaries of what's possible with neural architectures.", icon: Lightbulb, glow: "purple" as const },
  { title: "Quality", description: "Uncompromising engineering standards for industrial-grade systems.", icon: Award, glow: "cyan" as const },
  { title: "Performance", description: "Ultra-low latency and massive throughput optimized for scale.", icon: Zap, glow: "amber" as const },
  { title: "Client Success", description: "Dedicated to driving growth and automation for our global partners.", icon: TrendingUp, glow: "purple" as const },
];


const reasons = [
  { title: "Fast Delivery", description: "Rapid deployment cycles powered by automated CI/CD pipelines.", icon: Zap },
  { title: "Scalable Systems", description: "Architectures designed to grow dynamically with your data needs.", icon: TrendingUp },
  { title: "AI-Powered", description: "Intelligence-first approach to solving complex business problems.", icon: Cpu },
];

export default function AboutPage() {
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
                  About Our <br />
                  <span className="text-gradient">Company</span>
                </h1>
                <p className="text-2xl text-foreground/60 font-medium">
                  We build intelligent software solutions powered by AI.
                </p>
              </motion.div>
              <motion.p variants={fadeInUp} className="text-lg text-foreground/70 max-w-lg leading-relaxed">
                CoreLogic Systems is a frontier technology firm dedicated to bridging the gap between raw compute and cognitive intelligence.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
              <Image 
                src="/about_ai_dashboard.png"
                alt="AI Dashboard Interface"
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
                        <h2 className="text-4xl font-black font-heading tracking-tighter">Who We Are</h2>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <p className="text-xl text-foreground/70 leading-relaxed font-light">
                            Founded at the intersection of infrastructure and artificial intelligence, CoreLogic Systems operates as a high-performance lab for the future. We specialize in developing **Web Applications**, **Custom AI Architectures**, and **Enterprise Software Solutions** that prioritize speed, security, and scalability.
                        </p>
                        <p className="text-xl text-foreground/70 leading-relaxed font-light">
                            Our mission is to empower global industries through relentless **Innovation**, strategic **Automation**, and sustainable **Growth**.
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
                        <h3 className="text-3xl font-bold font-heading">Our Mission</h3>
                        <p className="text-foreground/70 text-lg leading-relaxed">
                            Deliver smart, scalable, and modern digital solutions that solve the most complex technical challenges of the 21st century.
                        </p>
                    </div>
                </GlassCard>
                <GlassCard glowColor="cyan">
                    <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                            <Eye size={32} />
                        </div>
                        <h3 className="text-3xl font-bold font-heading">Our Vision</h3>
                        <p className="text-foreground/70 text-lg leading-relaxed">
                            Become a leading global AI provider, setting the standard for ethical intelligence and high-performance neural software.
                        </p>
                    </div>
                </GlassCard>
            </div>
        </section>

        {/* 4. Our Values */}
        <section className="px-6 mb-32 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
           <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Our Core Values</h2>
                    <p className="text-foreground/60 max-w-2xl mx-auto text-lg">The principles that drive our engineering and creative processes.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                    {values.map((v, i) => (
                        <div key={i} className="bg-background/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/10 transition-colors shadow-sm">
                                <v.icon size={26} strokeWidth={1.5} />
                            </div>
                            <h4 className="text-xl font-bold mb-3">{v.title}</h4>
                            <p className="text-foreground/60 text-sm leading-relaxed">{v.description}</p>
                        </div>
                    ))}
                </div>
           </div>
        </section>


        {/* 7. Why Choose Us */}
        <section className="px-6 mb-40 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Why Choose Us</h2>
                    <p className="text-foreground/60 max-w-2xl mx-auto text-lg">We deliver intelligent solutions that push your business forward.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {reasons.map((r, i) => (
                        <div key={i} className="relative p-10 bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-[2.5rem] overflow-hidden group hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)] transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                            
                            <div className="flex items-start gap-6 relative z-10">
                                <div className="w-16 h-16 shrink-0 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
                                    <r.icon size={28} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-3 pt-2">
                                    <h4 className="text-2xl font-bold tracking-tight">{r.title}</h4>
                                    <p className="text-foreground/60 leading-relaxed text-sm">{r.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 8. Call To Action */}
        <section className="px-6">
            <div className="max-w-5xl mx-auto">
                <GlassCard className="text-center py-20 bg-gradient-to-br from-primary/5 via-white to-secondary/5 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-10"
                    >
                        <h2 className="text-5xl md:text-7xl font-black font-heading tracking-tighter">
                            Start Your Project <br />
                            <span className="text-gradient">With Us</span>
                        </h2>
                        <div className="flex justify-center">
                            <NeonButton size="lg" variant="primary">Contact Us</NeonButton>
                        </div>
                    </motion.div>
                </GlassCard>
            </div>
        </section>
      </div>
    </div>
  );
}
