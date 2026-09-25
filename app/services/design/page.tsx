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
  MonitorPlay,
  Sparkles
} from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

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
    <div className="bg-background min-h-screen text-foreground overflow-hidden font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-48 pb-32 px-6 min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Advanced Mesh Gradient Background */}
        <div className="absolute inset-0 z-0 bg-background">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-pink-500/10 via-rose-400/5 to-transparent blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/10 via-fuchsia-400/5 to-transparent blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-100/40 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none" />
          
          {/* Subtle Dot Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8 text-center lg:text-left">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/80 backdrop-blur-md text-pink-500 text-sm font-semibold shadow-sm border border-pink-500/20 hover:border-pink-500/40 transition-colors">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
              </span>
              <span>Premium Design Studio</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight leading-[1.05]">
              Stunning UI/UX <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Experiences</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/60 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              We design beautiful, intuitive, and user-centered digital interfaces that captivate your audience and drive business conversions.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/contact">
                <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold hover:opacity-90 shadow-[0_8px_30px_rgba(236,72,153,0.2)] hover:shadow-[0_8px_40px_rgba(236,72,153,0.3)] hover:-translate-y-1 transition-all text-lg flex items-center gap-2">
                  Start Your Project
                  <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="#portfolio">
                <button className="px-8 py-4 bg-background/50 backdrop-blur-md text-foreground rounded-2xl font-semibold hover:bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-all text-lg shadow-sm">
                  View Portfolio
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Hero Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative h-[500px]"
          >
            {/* Main Glass Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] aspect-[4/3] bg-background/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-[0_20px_60px_-15px_rgba(236,72,153,0.1)] p-8 flex flex-col gap-6 overflow-hidden">
              <div className="flex justify-between items-center pb-4 border-b border-foreground/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="w-1/2 h-2 bg-foreground/5 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 flex-grow">
                <div className="space-y-4">
                  <div className="w-full h-24 bg-pink-500/10 rounded-2xl" />
                  <div className="w-3/4 h-4 bg-foreground/10 rounded-full" />
                  <div className="w-full h-4 bg-foreground/5 rounded-full" />
                </div>
                <div className="space-y-4">
                  <div className="w-full h-32 bg-purple-500/10 rounded-2xl" />
                  <div className="w-1/2 h-8 bg-pink-500/20 rounded-xl" />
                </div>
              </div>
            </div>
            
            {/* Floating Element 1 */}
            <motion.div 
              animate={{ y: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-pink-500/10 text-pink-500 rounded-full flex items-center justify-center">
                <Heart size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">User Centered</p>
                <p className="text-xs text-foreground/50">Data-driven UX</p>
              </div>
            </motion.div>

            {/* Floating Element 2 */}
            <motion.div 
              animate={{ y: [15, -15, 15] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-purple-500/10 text-purple-600 rounded-full flex items-center justify-center">
                <PenTool size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Pixel Perfect</p>
                <p className="text-xs text-foreground/50">Modern interfaces</p>
              </div>
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* 2. About the Service */}
      <section className="py-24 px-6 relative z-10 bg-foreground/[0.02]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Design That Drives <span className="text-primary">Growth</span></h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-3xl mx-auto">
              Great design is more than just making things look pretty. It’s about solving problems, leading users to their goals, and ultimately driving business success. We focus heavily on the psychology of user experience, ensuring that every button, color, and layout choice serves a clear, conversion-focused purpose.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Our UI/UX Design Services */}
      <section className="py-24 px-6 relative">
        <div className="absolute left-0 top-1/3 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Design Services</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">From initial blueprints to stunning visual identities, we cover the entire UI/UX spectrum.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {services.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background/80 backdrop-blur-3xl p-8 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors mb-6 shadow-sm">
                  <item.icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-foreground/60 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Design Process */}
      <section className="py-24 px-6 relative bg-foreground/[0.01] border-y border-foreground/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Design Process</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">A systematic, research-backed methodology ensuring visual perfection.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background/50 border border-slate-200/60 p-8 rounded-3xl hover:shadow-lg hover:border-primary/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="text-5xl font-bold text-foreground/10 mb-6 group-hover:text-primary/20 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mt-2 mb-3 text-foreground">{step.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Key Benefits & 6. Why Choose Us */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-background p-8 rounded-3xl border border-foreground/10 hover:border-primary/20 hover:shadow-md transition-all duration-300 shadow-sm group">
                <div className="flex items-start gap-5">
                  <div className="mt-1 text-primary group-hover:scale-110 transition-transform">
                    <benefit.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-foreground">{benefit.title}</h4>
                    <p className="text-foreground/60 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose <br/><span className="text-primary">CoreLogic.</span></h2>
              <p className="text-foreground/60 leading-relaxed text-lg">
                We blend creative visual arts with deep psychological research. Our team doesn't just create aesthetics—we design strategic tools aimed purely at achieving your business goals.
              </p>
            </div>
            
            <ul className="space-y-4">
              {["Creative & experienced designers", "Focus on business goals", "User-centered design approach", "Clean and modern aesthetics", "Fast delivery, high quality"].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
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
      <section className="py-24 px-6 bg-foreground/[0.02] border-y border-foreground/5">
         <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Design Showcase</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">Explore a selection of our most recent, high-converting interface designs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
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
                 <div className="relative h-[300px] rounded-3xl overflow-hidden border border-slate-200/60 group-hover:border-primary/50 group-hover:shadow-xl transition-all duration-500 bg-background shadow-sm">
                    <Image 
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                         <span className="text-xs font-bold text-white/80 uppercase tracking-widest">{item.category}</span>
                         <h3 className="text-xl font-bold text-white mt-1">{item.title}</h3>
                      </div>
                    </div>
                 </div>
               </motion.div>
            ))}
          </div>
         </div>
      </section>

      {/* 8. Call To Action Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[3rem] border border-primary/10 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Let's design an experience <br />
                <span className="text-primary">your users will love.</span>
              </h2>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                Don't settle for mediocre design. Start the conversation today and let us craft a premium visual identity for your software.
              </p>
              <div className="pt-4 flex justify-center">
                <Link href="/contact">
                  <button className="px-10 py-5 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2">
                    Get a Free UI/UX Consultation
                    <ArrowRight size={20} />
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
