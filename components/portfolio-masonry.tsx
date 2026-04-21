"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { SectionTitle } from "./section-title";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { NeonButton } from "./neon-button";

const projects = [
  {
    title: "NeuroCore Dashboard",
    category: "AI Management",
    image: "/portfolio_dashboard.png",
    tags: ["Real-time", "Neural", "Analytics"],
    span: "col-span-2 md:col-span-2",
  },
  {
    title: "Sentinel Security",
    category: "Automation",
    image: "/cyber_security_dashboard.png",
    tags: ["Cyber", "Defense"],
    span: "col-span-2 md:col-span-1",
  },
  {
    title: "Flux Architecture",
    category: "Infrastructure",
    image: "/cloud_infrastructure_dashboard.png",
    tags: ["Cloud", "Scalable"],
    span: "col-span-2 md:col-span-1",
  },
  {
    title: "Quantum Inference",
    category: "Intelligence",
    image: "/quantum_ml_dashboard.png",
    tags: ["ML", "Speed"],
    span: "col-span-1 md:col-span-1",
  },
  {
    title: "Omega Protocol",
    category: "Blockchain",
    image: "/blockchain_ledger_dashboard.png",
    tags: ["Distributed", "Ledger"],
    span: "col-span-1 md:col-span-1",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 60, damping: 15 }
  }
} as const;

export const PortfolioMasonry = () => {
  return (
    <section id="portfolio" className="py-24 px-6 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <SectionTitle 
          title="Featured Projects" 
          subtitle="A showcase of high-impact AI systems developed for our global enterprise partners."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[320px]"
        >
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className={project.span}
            >
              <Tilt
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                perspective={1000}
                glareEnable={true}
                glareMaxOpacity={0.3}
                glareColor="#ffffff"
                glarePosition="all"
                className="h-full w-full rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div className="relative h-full w-full bg-navy border border-white/5 group-hover:border-primary/40 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-500 rounded-2xl">
                    <Image 
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover opacity-40 saturate-50 group-hover:opacity-100 group-hover:saturate-100 group-hover:scale-110 transition-all duration-700"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent p-6 md:p-8 flex flex-col justify-end">
                        <div className="space-y-4 translate-y-0 lg:translate-y-12 lg:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <div className="space-y-2">
                                <span className="text-[10px] md:text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded inline-block">
                                  {project.category}
                                </span>
                                <h3 className="text-xl md:text-2xl font-black font-heading text-white drop-shadow-md leading-tight">{project.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-bold text-white/70 backdrop-blur-sm">
                                      #{tag}
                                    </span>
                                ))}
                            </div>
                            <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pt-2">
                                <NeonButton size="sm" variant="outline" className="w-full sm:w-auto">View Case Study</NeonButton>
                            </div>
                        </div>
                    </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
