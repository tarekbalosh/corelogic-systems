"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typewriter } from "./typewriter";
import { NeonButton } from "./neon-button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 px-6 min-h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-10 z-10"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-heading leading-none">
              Build the Future <br />
              <span className="text-gradient">with AI</span>
            </h1>
            <div className="text-2xl md:text-3xl font-medium text-white/50 flex items-center gap-2">
              <span>Empowered to</span>
              <Typewriter words={["Automate", "Analyze", "Accelerate"]} />
            </div>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/40 max-w-lg leading-relaxed">
            CoreLogic Systems provides high-performance infrastructure and neural architectures 
            for the next generation of industrial-scale compute.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6">
            <Link href="/contact">
              <NeonButton size="lg" variant="primary">Get Started Now</NeonButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side: 3D Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative flex items-center justify-center p-8 mix-blend-screen"
        >
          {/* Animated 3D Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[120%] h-[120%] border-2 border-primary/20 rounded-full animate-[spin_8s_linear_infinite] [transform-style:preserve-3d] [transform:rotateX(60deg)]" />
            <div className="absolute w-[100%] h-[100%] border-2 border-secondary/20 rounded-full animate-[spin_12s_linear_infinite_reverse] [transform-style:preserve-3d] [transform:rotateX(-45deg)]" />
            <div className="absolute w-[80%] h-[80%] border-t-2 border-primary/40 rounded-full animate-[spin_6s_linear_infinite] [transform-style:preserve-3d] [transform:rotateX(30deg)]" />
          </div>

          {/* Hologram Pulse Effect */}
          <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />

          {/* Floating Brain Image */}
          <div className="animate-float" style={{ mixBlendMode: "screen" }}>
            <Image
              src="/ai_brain_hologram_1776488427249.png"
              alt="AI Neural Brain Hologram"
              width={600}
              height={600}
              className="drop-shadow-[0_0_50px_rgba(124,58,237,0.5)]"
              priority
            />
          </div>

          {/* Background Geometric Shapes */}
          <motion.div 
            animate={{ 
                rotate: 360,
                y: [0, -20, 0]
            }}
            transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-10 -right-10 w-24 h-24 border border-white/5 rounded-lg opacity-20" 
          />
          <motion.div 
            animate={{ 
                rotate: -360,
                y: [0, 20, 0]
            }}
            transition={{
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -bottom-10 -left-10 w-32 h-32 border border-white/5 rounded-full opacity-20" 
          />
        </motion.div>
      </div>
    </section>
  );
};
