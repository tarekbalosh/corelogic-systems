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
    purple: "group-hover:shadow-[0_0_40px_rgba(124,58,237,0.2)] group-hover:border-purple-glow/30",
    cyan: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] group-hover:border-cyan-glow/30",
    amber: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] group-hover:border-accent/30",
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      transition={{ delay }}
      className="group relative"
    >
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 blur-2xl -z-10",
        glowColor === "purple" && "bg-purple-glow/10",
        glowColor === "cyan" && "bg-cyan-glow/10",
        glowColor === "amber" && "bg-accent/10"
      )} />

      <div className={cn(
        "relative rounded-2xl p-6 transition-all duration-300",
        "bg-white/5 backdrop-blur-[20px]",
        "border border-white/10",
        glowClasses[glowColor],
        className
      )}>
        {children}
      </div>
    </motion.div>
  );
};
