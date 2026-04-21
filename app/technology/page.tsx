"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Server, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Layers,
  Infinity,
  Database
} from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const techSpecs = [
  { title: "Neural Architecture", desc: "Custom-trained multi-modal transformers optimized for low-latency inference.", icon: Cpu },
  { title: "Edge Computing", desc: "Distributed compute nodes ensuring rapid processing at the point of action.", icon: Activity },
  { title: "Ethical AI", desc: "Built-in bias detection and automated governance layers for safe intelligence.", icon: ShieldCheck },
  { title: "Massive Throughput", desc: "Infrastructure designed to handle 50M+ API requests daily without friction.", icon: Zap },
];

export default function TechnologyPage() {
  return (
    <div className="bg-brand-cream min-h-screen text-brand-teal selection:bg-brand-orange/30">
      {/* 1. Hero Section */}
      <section className="pt-48 pb-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-8"
            >
                <motion.div variants={fadeInUp} className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black font-heading tracking-tighter uppercase leading-[0.9]">
                        CoreLogic <br />
                        <span className="text-brand-orange">Technology</span>
                    </h1>
                    <p className="text-xl text-brand-teal/60 font-medium">
                        The neural scaffolding for the next generation of industrial intelligence.
                    </p>
                </motion.div>
                <motion.p variants={fadeInUp} className="text-lg text-brand-teal/40 leading-relaxed max-w-lg">
                    Our infrastructure is defined by its resilience, its speed, and its ability to learn at scale. We combine the latest in high-performance compute with bespoke cognitive models.
                </motion.p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
            >
                <div className="absolute inset-0 bg-brand-orange/10 blur-[120px] rounded-full" />
                <Image 
                    src="/technology_hero_visual.png"
                    alt="CoreLogic AI Infrastructure"
                    width={800}
                    height={800}
                    className="relative z-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)]"
                />
            </motion.div>
        </div>
      </section>

      {/* 2. Infrastructure Grid */}
      <section className="py-32 bg-brand-teal text-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div className="space-y-4">
                    <h2 className="text-5xl font-black font-heading tracking-tighter uppercase">High-Performance <br />Infrastructure</h2>
                </div>
                <p className="max-w-md text-white/50 text-lg">
                    We leverage NVIDIA H100 GPU clusters and custom silicon to power our most demanding neural operations.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {techSpecs.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-10 border border-white/10 rounded-[2.5rem] hover:border-brand-orange/50 transition-colors group space-y-6"
                    >
                        <div className="text-brand-orange group-hover:scale-110 transition-transform duration-500">
                            <s.icon size={48} />
                        </div>
                        <h3 className="text-2xl font-bold font-heading uppercase tracking-tight">{s.title}</h3>
                        <p className="text-white/40 leading-relaxed text-sm">
                            {s.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* 3. Tech Stack Section */}
      <section className="py-32 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
              <div className="lg:col-span-1 space-y-6">
                  <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-sm">Our Stack</span>
                  <h2 className="text-5xl font-black font-heading tracking-tighter uppercase">Built on the Best.</h2>
                  <p className="text-brand-teal/50 leading-relaxed">
                      We utilize a modern, highly decoupled architecture that ensures maximum uptime and developer velocity.
                  </p>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {["Next.js", "React", "TypeScript", "Python", "PyTorch", "Terraform", "Docker", "Kubernetes", "Redis"].map((tech, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl flex items-center justify-center font-black tracking-tight border border-brand-teal/5 shadow-sm text-brand-teal/80 hover:text-brand-orange hover:shadow-lg transition-all cursor-default">
                          {tech}
                      </div>
                  ))}
              </div>
          </div>
      </section>
    </div>
  );
}
