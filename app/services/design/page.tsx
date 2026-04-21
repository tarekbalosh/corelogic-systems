"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  PenTool, 
  Layout, 
  Smartphone, 
  Layers, 
  MousePointer2, 
  Eye, 
  TrendingUp, 
  Heart, 
  CheckCircle2,
  ArrowRight,
  MonitorPlay
} from "lucide-react";
import { SectionTitle } from "@/components/section-title";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const services = [
  { title: "Mobile App UI Design", desc: "Intuitive, thumb-friendly interfaces that keep mobile users engaged and converting.", icon: Smartphone },
  { title: "Web App UI Design", desc: "Complex data simplified into beautiful, easily navigable dashboard environments.", icon: Layout },
  { title: "Dashboard & Admin Panels", desc: "Clear data visualizations and management tools tailored for operational speed.", icon: MonitorPlay },
  { title: "Wireframing & Prototyping", desc: "Interactive low and high-fidelity blueprints to test concepts early.", icon: Layers },
  { title: "UX Research", desc: "In-depth user analysis to ensure every design decision is backed by data.", icon: Eye },
  { title: "Design Systems", desc: "Modular, scalable component libraries to keep your brand consistent everywhere.", icon: PenTool },
];

const benefits = [
  { title: "Better User Experience", desc: "Eliminate friction points and make your app a joy to use.", icon: Heart },
  { title: "Higher Conversion Rates", desc: "Strategic layouts designed to guide users toward your business goals.", icon: TrendingUp },
  { title: "Modern Branding", desc: "A sleek, professional visual identity that builds immediate trust.", icon: CheckCircle2 },
  { title: "Easy-to-use Interfaces", desc: "Reduce learning curves and support tickets with clear navigation.", icon: MousePointer2 },
];

const processSteps = [
  { num: "01", title: "User Research", desc: "We study your target audience and competitors to uncover insights." },
  { num: "02", title: "Structure Planning", desc: "Mapping out user flows and creating foundational wireframes." },
  { num: "03", title: "Visual Design", desc: "Applying branding, typography, and color theory to the UI." },
  { num: "04", title: "Prototyping", desc: "Building interactive models to test animations and transitions." },
  { num: "05", title: "Testing & Feedback", desc: "Refining the design based on real user interactions." },
  { num: "06", title: "Final Delivery", desc: "Handing off pixel-perfect assets to the development team." },
];

const portfolioItems = [
  { title: "Fintech Dashboard", category: "Web App UI", image: "/blockchain_ledger_dashboard.png" },
  { title: "Crypto Trading Platform", category: "Mobile UI", image: "/quantum_ml_dashboard.png" },
  { title: "Cloud Infrastructure", category: "Admin Panel", image: "/cloud_infrastructure_dashboard.png" },
];

export default function UIDesignPage() {
  return (
    <div className="bg-[#050915] min-h-screen text-white overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-48 pb-32 px-6 min-h-[90vh] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/ui_hero_background.png"
            alt="Premium UI/UX Design Agency Background"
            fill
            className="object-cover opacity-40 mix-blend-screen"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050915]/60 via-[#050915]/80 to-[#050915]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-purple-900/10 to-[#050915] pointer-events-none" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.div variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 font-bold text-sm tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              Premium Design Agency
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter uppercase leading-[1.1]">
              UI/UX <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">Design</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
              We design beautiful, intuitive, and user-centered digital experiences that convert users into customers.
            </motion.p>
            <motion.div variants={fadeInUp} className="pt-8">
              <Link href="/contact">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-lg font-bold tracking-widest uppercase rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(236,72,153,0.4)]">
                  <span className="relative z-10">Start Your Design Project</span>
                  <div className="absolute inset-0 h-full w-0 bg-white transition-all duration-300 ease-out group-hover:w-full z-0 opacity-20" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. About the Service */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Design That Drives <span className="text-pink-500">Growth</span></h2>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
              Great design is more than just making things look pretty. It’s about solving problems, leading users to their goals, and ultimately driving business success. We focus heavily on the psychology of user experience, ensuring that every button, color, and layout choice serves a clear, conversion-focused purpose.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Our UI/UX Design Services */}
      <section className="py-24 px-6 bg-[#03050C] relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionTitle 
            title="Our Design Services" 
            subtitle="From initial blueprints to stunning visual identities, we cover the entire UI/UX spectrum."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {services.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-10 space-y-6 group rounded-[2rem] border-white/5 hover:border-pink-500/30 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center text-pink-400 group-hover:from-pink-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(236,72,153,0.3)]">
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-black font-heading capitalize text-white">{item.title}</h3>
                <p className="text-white/50 leading-relaxed font-light text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Design Process */}
      <section className="py-24 px-6 bg-[#050915] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Our Design Process" 
            subtitle="A systematic, research-backed methodology ensuring visual perfection."
          />
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 relative">
            <div className="hidden lg:block absolute top-[45px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />
            <div className="hidden lg:block absolute top-[280px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
            
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-[#050915] border-2 border-white/10 flex items-center justify-center relative z-10 group-hover:border-pink-500 transition-colors shadow-2xl">
                  <span className="text-3xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-br from-white to-white/30 group-hover:from-pink-400 group-hover:to-purple-500">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-heading mt-6 mb-3 group-hover:text-pink-400 transition-colors">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Key Benefits & 6. Why Choose Us */}
      <section className="py-24 px-6 relative bg-[#03050C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-pink-500/40 transition-all duration-300 shadow-xl">
                <div className="flex items-start gap-5">
                  <div className="mt-1 text-pink-500">
                    <benefit.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-heading mb-2 text-white">{benefit.title}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Why Choose <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">CoreLogic.</span></h2>
              <p className="text-white/60 leading-relaxed font-light">
                We blend creative visual arts with deep psychological research. Our team doesn't just create aesthetics—we design strategic tools aimed purely at achieving your business goals.
              </p>
            </div>
            
            <ul className="space-y-4">
              {["Creative & experienced designers", "Focus on business goals", "User-centered design approach", "Clean and modern aesthetics", "Fast delivery, high quality"].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80 font-medium tracking-wide">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                    <CheckCircle2 size={14} />
                  </div>
                  {point}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* 7. Portfolio / Showcase Section */}
      <section className="py-24 px-6 bg-[#050915] border-y border-white/5">
         <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Design Showcase" 
            subtitle="Explore a selection of our most recent, high-converting interface designs."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {portfolioItems.map((item, idx) => (
               <motion.div
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 whileHover={{ y: -10 }}
                 transition={{ duration: 0.4 }}
                 className="group cursor-pointer"
               >
                 <div className="relative h-[300px] rounded-3xl overflow-hidden border border-white/10 group-hover:border-pink-500/50 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-500">
                    <Image 
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050915] via-[#050915]/60 to-transparent p-6 flex flex-col justify-end">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                         <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">{item.category}</span>
                         <h3 className="text-2xl font-black font-heading text-white">{item.title}</h3>
                      </div>
                    </div>
                 </div>
               </motion.div>
            ))}
          </div>
         </div>
      </section>

      {/* 8. Call To Action Section */}
      <section className="py-32 px-6 relative bg-gradient-to-b from-[#050915] to-[#0a0515]">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-20 rounded-[3rem] border border-pink-500/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-600/10 opacity-50" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tighter leading-tight drop-shadow-md">
                Let's design an experience <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">your users will love.</span>
              </h2>
              <div className="pt-4 flex justify-center">
                <Link href="/contact">
                  <button className="group relative px-10 py-5 bg-white text-[#050915] text-lg font-black tracking-widest uppercase rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(236,72,153,0.4)] flex items-center gap-4">
                    <span className="relative z-10">Get a Free UI/UX Consultation</span>
                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                    <div className="absolute inset-0 h-full w-0 bg-gray-200 transition-all duration-300 ease-out group-hover:w-full z-0" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
