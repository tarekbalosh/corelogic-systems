"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "purple" | "cyan" | "amber";
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  glowColor = "purple",
  delay = 0 
}) => {
  const glowClasses = {
    purple: "group-hover:shadow-[0_12px_40px_rgba(79,70,229,0.12)] group-hover:border-primary/30",
    cyan: "group-hover:shadow-[0_12px_40px_rgba(14,165,233,0.12)] group-hover:border-secondary/30",
    amber: "group-hover:shadow-[0_12px_40px_rgba(245,158,11,0.12)] group-hover:border-accent/30",
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      transition={{ delay }}
      className="group relative h-full"
    >
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 rounded-3xl transition-all duration-500 blur-2xl -z-10",
        "opacity-0 group-hover:opacity-100",
        glowColor === "purple" && "bg-primary/15",
        glowColor === "cyan" && "bg-secondary/15",
        glowColor === "amber" && "bg-accent/15"
      )} />

      <div className={cn(
        "relative rounded-3xl p-8 transition-all duration-300",
        "bg-white/90 backdrop-blur-xl",
        "border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.04)]",
        "group-hover:-translate-y-1 group-hover:bg-white",
        glowClasses[glowColor],
        className
      )}>
        {children}
      </div>
    </motion.div>
  );
};
