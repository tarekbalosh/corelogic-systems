"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, MessageSquare, Camera, Settings, Database, ArrowRight } from "lucide-react";
import { GlassCard } from "./glass-card";
import { SectionTitle } from "./section-title";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const services = [
  {
    title: "AI Analytics",
    description: "Deep-dive predictive modeling and real-time data stream analysis for enterprise agility.",
    icon: Cpu,
    glow: "purple" as const,
  },
  {
    title: "Machine Learning",
    description: "Custom neural network architectures trained on industrial-scale datasets for high precision.",
    icon: Zap,
    glow: "cyan" as const,
  },
  {
    title: "NLP Processing",
    description: "Advanced semantic understanding and multi-lingual processing for human-like intelligence.",
    icon: MessageSquare,
    glow: "purple" as const,
  },
  {
    title: "Computer Vision",
    description: "Object detection, spatial analysis, and sensory perception for autonomous robotics.",
    icon: Camera,
    glow: "amber" as const,
  },
  {
    title: "IA Automation",
    description: "Intelligent agent orchestration to streamline complex cross-departmental workflows.",
    icon: Settings,
    glow: "cyan" as const,
  },
  {
    title: "Data Intelligence",
    description: "Secure data lake integration with automated governance and ethical AI guardrails.",
    icon: Database,
    glow: "amber" as const,
  },
];

export const ServicesGrid = () => {
  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <SectionTitle 
          title="Intelligent Services" 
          subtitle="Empowering your enterprise with state-of-the-art AI infrastructure and cognitive architectures."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, idx) => (
            <GlassCard
              key={idx}
              glowColor={service.glow}
              delay={idx * 0.1}
              className="h-full group"
            >
              <div className="flex flex-col h-full space-y-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 w-fit group-hover:bg-primary/20 transition-colors duration-500">
                  <service.icon size={28} className="text-white group-hover:text-primary transition-colors" />
                </div>
                
                <div className="space-y-3 flex-1">
                  <h3 className="text-2xl font-bold font-heading">{service.title}</h3>
                  <p className="text-white/50 text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 mt-auto border-t border-white/5 lg:border-none">
                  <button className="w-full lg:w-auto flex items-center justify-center lg:justify-start gap-2 text-sm font-bold text-white bg-white/5 lg:bg-transparent py-4 lg:py-0 rounded-full lg:rounded-none hover:bg-white/10 lg:hover:bg-transparent lg:group-hover:text-secondary lg:group-hover:translate-x-2 transition-all duration-300">
                    Learn More <ArrowRight size={16} className="text-primary lg:text-inherit" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
