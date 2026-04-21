"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = "center",
  className,
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className={cn(
        "mb-16 space-y-4",
        align === "center" && "text-center mx-auto",
        className
      )}
    >
      <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-heading text-gradient underline-offset-8">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-lg md:text-xl text-white/40 font-medium leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
      <div className={cn(
        "h-1 w-20 bg-gradient-to-r from-purple-glow to-cyan-glow rounded-full",
        align === "center" && "mx-auto"
      )} />
    </motion.div>
  );
};
