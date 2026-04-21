"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Zap, 
  MessageSquare, 
  Camera, 
  Settings, 
  Database, 
  ArrowRight,
  Code,
  Smartphone,
  Layout,
  Terminal
} from "lucide-react";
import { SectionTitle } from "@/components/section-title";
import { GlassCard } from "@/components/glass-card";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const coreServices = [
  {
    title: "Web Application Development",
    description: "High-performance, scalable web systems built with Next.js and robust cloud architectures.",
    icon: Code,
    details: ["Progressive Web Apps", "E-commerce Solutions", "Enterprise Dashboards"]
  },
  {
    title: "AI Solutions & Automation",
    description: "Intelligent agent orchestration and custom neural models designed for industrial efficiency.",
    icon: Cpu,
    details: ["Predictive Analytics", "Process Automation", "Neural Search"]
  },
  {
    title: "Mobile App Development",
    description: "Native-quality cross-platform mobile experiences for iOS and Android.",
    icon: Smartphone,
    details: ["iOS & Android", "Real-time Sync", "Offline-first Apps"]
  },
  {
    title: "Custom Software Development",
    description: "Tailored software ecosystems that solve unique business challenges with precision code.",
    icon: Terminal,
    details: ["Legacy Migration", "API Integration", "Microservices"]
  },
  {
    title: "UI/UX Design",
    description: "Cinematic, user-centric interfaces designed for modern engagement and conversion.",
    icon: Layout,
    details: ["Interactive Mockups", "Design Systems", "User Research"]
  }
];

export default function ServicesPage() {
  return (
    <div className="bg-brand-cream min-h-screen text-brand-teal selection:bg-brand-orange/30">
      <div className="pt-40 pb-32 max-w-7xl mx-auto px-6">
        <motion.div
           initial="hidden"
           animate="visible"
           variants={staggerContainer}
           className="space-y-20"
        >
          {/* Hero Portion */}
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-6xl md:text-8xl font-black font-heading tracking-tighter uppercase leading-none">
              Our <span className="text-brand-orange">Services</span>
            </h1>
            <p className="text-xl text-brand-teal/60 font-medium">
              We deliver industrial-grade digital solutions powered by state-of-the-art AI.
            </p>
          </motion.div>

          {/* Detailed Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {coreServices.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white p-12 rounded-[2rem] border border-brand-teal/5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] group hover:shadow-[0_20px_80px_rgba(229,154,53,0.1)] transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-brand-teal/5 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">
                        <s.icon size={32} />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black font-heading tracking-tighter uppercase">{s.title}</h2>
                        <p className="text-lg text-brand-teal/50 leading-relaxed">
                            {s.description}
                        </p>
                        <ul className="flex flex-wrap gap-3">
                            {s.details.map((detail, idx) => (
                                <li key={idx} className="px-4 py-1.5 rounded-full bg-brand-teal/5 text-[13px] font-bold tracking-wider uppercase text-brand-teal/60">
                                    {detail}
                                </li>
                            ))}
                        </ul>
                        <Link href="/contact">
                          <button className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-brand-orange mt-6 group/btn">
                             Project Inquiry <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                          </button>
                        </Link>
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
