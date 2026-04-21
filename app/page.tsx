"use client";

import { motion } from "framer-motion";
import { Hero } from "@/components/hero";
import { ParticleBackground } from "@/components/particle-background";
import { StatsSection } from "@/components/stats-section";
import { ServicesGrid } from "@/components/services-grid";
import { PortfolioMasonry } from "@/components/portfolio-masonry";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-navy text-white selection:bg-primary/30">
      {/* Immersive Particle Background (Fixed) */}
      <ParticleBackground />

      {/* Page Content */}
      <div className="relative z-10 flex flex-col gap-0 pb-32">
        
        {/* Cinematic Hero Region */}
        <Hero />

        {/* Global Performance Statistics */}
        <StatsSection />

        {/* Core AI Intelligence Services */}
        <ServicesGrid />

        {/* Technical Showcase Portfolio */}
        <PortfolioMasonry />

      </div>
    </div>
  );
}
