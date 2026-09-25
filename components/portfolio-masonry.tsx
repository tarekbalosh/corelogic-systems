"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { SectionTitle } from "./section-title";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { NeonButton } from "./neon-button";

const projects = [
  {
    title: "Accounting Pro",
    category: "Financial System",
    image: "/accounting_pro_dashboard.png",
    tags: ["Accounting", "Restaurant", "Financial"],
    link: "https://account-systems.vercel.app/login",
    span: "col-span-2 md:col-span-2",
  },
  {
    title: "POS System project",
    category: "Restaurant POS",
    image: "/pos_system_dashboard.png",
    tags: ["POS", "Restaurant"],
    link: "https://system-pos-resturant.vercel.app/pos",
    span: "col-span-2 md:col-span-1",
  },
  {
    title: "Management Student Systems",
    category: "Education",
    image: "/student_management_dashboard.png",
    tags: ["Students", "Management"],
    link: "https://management-students.vercel.app/dashboard",
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
    <section id="portfolio" className="py-24 px-6 bg-white border-t border-gray-100">
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
              <Link href={project.link || "#"} className="block h-full w-full">
                <div className="relative h-full w-full bg-background rounded-3xl border border-foreground/10 group-hover:border-primary/30 group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <Image 
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                    />
                    
                    {/* Dark Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-8 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                        <div className="space-y-4 translate-y-0 lg:translate-y-8 lg:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <div className="space-y-2">
                                <span className="text-[11px] md:text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 backdrop-blur-md border border-primary/20 px-3 py-1 rounded-full inline-block shadow-sm">
                                  {project.category}
                                </span>
                                <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md leading-tight">{project.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium text-white/90 backdrop-blur-md">
                                      {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pt-3">
                                <button className="w-full sm:w-auto px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-md text-sm">
                                  View Case Study
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
