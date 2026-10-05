"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Monitor, Globe, Smartphone, Bot, LineChart, Wrench } from "lucide-react";
import { GlassCard } from "./glass-card";
import { SectionTitle } from "./section-title";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const services = [
  {
    title: "Custom business software",
    description: "ERP, accounting, POS, inventory, and custom dashboards tailored to your needs.",
    icon: Monitor,
    glow: "purple" as const,
  },
  {
    title: "Web development",
    description: "Company sites, portals, and scalable e-commerce platforms.",
    icon: Globe,
    glow: "cyan" as const,
  },
  {
    title: "Mobile apps",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    icon: Smartphone,
    glow: "amber" as const,
  },
  {
    title: "AI Automation",
    description: "Workflow automation, intelligent chatbots, and document processing.",
    icon: Bot,
    glow: "purple" as const,
  },
  {
    title: "Data and analytics",
    description: "Custom dashboards, reporting systems, and data integrations.",
    icon: LineChart,
    glow: "cyan" as const,
  },
  {
    title: "Maintenance and technical support",
    description: "Ongoing support, updates, and maintenance for your digital assets.",
    icon: Wrench,
    glow: "amber" as const,
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
            <GlassCard
              key={idx}
              glowColor={service.glow}
              delay={idx * 0.1}
              className="h-full group"
            >
              <div className="flex flex-col h-full space-y-6">
                <div className="p-3 rounded-xl bg-foreground/5 border border-foreground/10 w-fit group-hover:bg-primary/20 transition-colors duration-500">
                  <service.icon size={28} className="text-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <div className="space-y-3 flex-1">
                  <h3 className="text-2xl font-bold font-heading">{service.title}</h3>
                  <p className="text-foreground/70 text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 mt-auto border-t border-foreground/10 lg:border-none">
                  <button className="w-full lg:w-auto flex items-center justify-center lg:justify-start gap-2 text-sm font-bold text-foreground bg-foreground/5 lg:bg-transparent py-4 lg:py-0 rounded-full lg:rounded-none hover:bg-foreground/10 lg:hover:bg-transparent lg:group-hover:text-secondary lg:group-hover:translate-x-2 transition-all duration-300">
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
