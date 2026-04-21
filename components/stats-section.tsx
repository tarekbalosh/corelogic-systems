"use client";

import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const stats = [
  {
    value: 12,
    suffix: "+",
    label: "Active Clients",
    color: "purple",
  },
  {
    value: 99.9,
    suffix: "%",
    label: "Target Uptime",
    color: "cyan",
    decimals: 1,
  },
  {
    value: 10,
    suffix: "K+",
    label: "API Calls/sec",
    color: "amber",
  },
];

export const StatsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="relative">
                <div className="text-6xl md:text-8xl font-black font-heading tracking-tighter tabular-nums flex items-baseline">
                  {inView ? (
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      decimals={stat.decimals || 0}
                      useEasing={true}
                    />
                  ) : (
                    <span>0</span>
                  )}
                  <span className="text-primary text-4xl md:text-6xl">{stat.suffix}</span>
                </div>
                {/* Decorative line */}
                <div className="h-1.5 w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mt-2 rounded-full" />
              </div>
              <p className="text-lg font-bold text-white/50 tracking-widest uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
