"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Monitor, Globe, Smartphone, Bot, LineChart, Wrench } from "lucide-react";
import { GlassCard } from "./glass-card";
import { SectionTitle } from "./section-title";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import Link from "next/link";

const services = [
  {
    title: "Custom business software",
    description: "ERP, accounting, POS, inventory, and custom dashboards tailored to your needs.",
    icon: Monitor,
    glow: "purple" as const,
    href: "/services/software-dev",
  },
  {
    title: "Web development",
    description: "Company sites, portals, and scalable e-commerce platforms.",
    icon: Globe,
    glow: "cyan" as const,
    href: "/services/web-dev",
  },
  {
    title: "Mobile apps",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    icon: Smartphone,
    glow: "purple" as const,
    href: "/services/mobile-dev",
  },
  {
    title: "AI Automation",
    description: "Workflow automation, intelligent chatbots, and document processing.",
    icon: Bot,
    glow: "cyan" as const,
    href: "/services/ai-automation",
  },
  {
    title: "Data and analytics",
    description: "Custom dashboards, reporting systems, and data integrations.",
    icon: LineChart,
    glow: "purple" as const,
    href: "/services/ai-automation",
  },
  {
    title: "Maintenance and technical support",
    description: "Ongoing support, updates, and maintenance for your digital assets.",
    icon: Wrench,
    glow: "cyan" as const,
    href: "/contact",
  },
];

export const ServicesGrid = () => {
  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <SectionTitle 
          title="Our Services" 
          subtitle="Comprehensive solutions for your business needs."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, idx) => (
            <Link href={service.href} key={idx} className="block h-full">
              <GlassCard
                glowColor={service.glow}
                delay={idx * 0.1}
                className="h-full group cursor-pointer"
              >
                <div className="flex flex-col h-full space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <service.icon size={26} />
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <h3 className="text-2xl font-bold font-heading text-slate-900 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-slate-600 text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-auto border-t border-slate-100">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:translate-x-1.5 transition-transform duration-300">
                      <span>Learn More</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
