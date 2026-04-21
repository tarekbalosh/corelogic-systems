"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Users, 
  MapPin, 
  Clock, 
  Briefcase, 
  ArrowRight,
  Heart,
  Globe,
  Coffee
} from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const jobs = [
  { title: "Senior AI Engineer", type: "Full-Time", location: "Global / Remote", team: "Engineering" },
  { title: "Infrastructure Architect", type: "Full-Time", location: "Singapore / Hybrid", team: "Platform" },
  { title: "UI/UX Product Designer", type: "Full-Time", location: "London / Hybrid", team: "Design" },
  { title: "DevOps specialist", type: "Contract", location: "Remote", team: "Platform" },
];

export default function CareersPage() {
  return (
    <div className="bg-brand-cream min-h-screen text-brand-teal selection:bg-brand-orange/30">
      {/* 1. Hero Portions */}
      <section className="pt-48 pb-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-8"
            >
                <motion.div variants={fadeInUp} className="space-y-4">
                    <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-sm">Join the Collective</span>
                    <h1 className="text-6xl md:text-8xl font-black font-heading tracking-tighter uppercase leading-[0.9]">
                        Design the <br />
                        <span className="text-brand-orange">Future.</span>
                    </h1>
                </motion.div>
                <motion.p variants={fadeInUp} className="text-lg text-brand-teal/40 leading-relaxed max-w-lg">
                    CoreLogic Systems is a group of architects, engineers, and thinkers dedicated to bridging the gap between raw compute and cognitive intelligence. We are looking for extraordinary people to join our global missions.
                </motion.p>
                <motion.div variants={fadeInUp}>
                    <button className="bg-brand-teal text-white px-10 py-5 rounded-full font-black tracking-widest uppercase text-sm hover:bg-brand-orange transition-all hover:scale-105 shadow-xl">
                        View Open Positions
                    </button>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
            >
                <div className="absolute inset-0 bg-brand-orange/10 blur-[120px] rounded-full" />
                <Image 
                    src="/careers_hero_visual.png"
                    alt="CoreLogic Collaborative Culture"
                    width={800}
                    height={800}
                    className="relative z-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)]"
                />
            </motion.div>
        </div>
      </section>

      {/* 2. Perks / Culture Section */}
      <section className="py-32 bg-brand-teal text-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                   { title: "Remote-First", desc: "Work from anywhere in the world with our globally distributed cloud architecture.", icon: Globe },
                   { title: "Health & Care", desc: "Comprehensive health, dental, and wellness support for you and your family.", icon: Heart },
                   { title: "Modern Setup", desc: "We provide the latest industrial hardware (NVIDIA workstations, Mac Studios) to power your work.", icon: Coffee }
                ].map((p, i) => (
                    <div key={i} className="space-y-6 p-10 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-white/10 transition-colors">
                        <div className="text-brand-orange"><p.icon size={32} /></div>
                        <h3 className="text-2xl font-bold font-heading uppercase">{p.title}</h3>
                        <p className="text-white/40 leading-relaxed font-light">{p.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 3. Job Listings Grid */}
      <section className="py-32 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <h2 className="text-5xl font-black font-heading tracking-tighter uppercase">Active <br />Openings</h2>
              <div className="flex items-center gap-4 text-brand-teal/40 font-bold uppercase text-xs tracking-widest">
                  <span className="text-brand-orange">4</span> Total positions available
              </div>
          </div>

          <div className="space-y-4">
              {jobs.map((j, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex flex-col md:flex-row md:items-center justify-between p-10 bg-white border border-brand-teal/5 rounded-3xl hover:border-brand-orange hover:shadow-2xl transition-all duration-300 gap-8"
                  >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange px-3 py-1 bg-brand-orange/10 rounded-full">
                                    {j.team}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black font-heading tracking-tighter uppercase group-hover:text-brand-orange transition-colors">
                                {j.title}
                            </h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-8 text-brand-teal/40 font-bold text-xs tracking-widest uppercase">
                            <div className="flex items-center gap-2"><MapPin size={16} className="text-brand-orange" /> {j.location}</div>
                            <div className="flex items-center gap-2"><Clock size={16} className="text-brand-orange" /> {j.type}</div>
                            <button className="w-12 h-12 rounded-full border border-brand-teal/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange transition-all">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                  </motion.div>
              ))}
          </div>
      </section>
    </div>
  );
}
