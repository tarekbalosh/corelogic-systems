"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Layers, 
  ShieldCheck, 
  Zap, 
  WifiOff, 
  Bell, 
  ArrowRight,
  MonitorSmartphone,
  Briefcase,
  ShoppingCart,
  Truck,
  GraduationCap
} from "lucide-react";
import { SectionTitle } from "@/components/section-title";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const solutions = [
  { title: "Android App Development", desc: "Native, high-performance apps built for the diverse Android ecosystem.", icon: Smartphone },
  { title: "iOS App Development", desc: "Premium, seamless experiences crafted for iPhones and iPads.", icon: MonitorSmartphone },
  { title: "Cross-platform Apps", desc: "Unify your codebase and launch everywhere without sacrificing quality.", icon: Layers },
  { title: "Business Apps", desc: "Internal tools and enterprise applications to streamline your operations.", icon: Briefcase },
  { title: "E-commerce Mobile Apps", desc: "Feature-rich shopping experiences that drive sales and retention.", icon: ShoppingCart },
  { title: "Custom Solutions", desc: "Tailored mobile architectures designed specifically for your unique industry.", icon: Zap },
];

const features = [
  { title: "Fast Performance", desc: "Optimized response times, fluid animations, and lightweight builds.", icon: Zap },
  { title: "Secure Architecture", desc: "End-to-end encryption, secure authentication, and data protection.", icon: ShieldCheck },
  { title: "Offline Support", desc: "Keep users engaged even when they lose their internet connection.", icon: WifiOff },
  { title: "Push Notifications", desc: "Increase retention with timely, context-aware user messaging.", icon: Bell },
];

const processSteps = [
  { num: "01", title: "Idea & Consultation", desc: "We analyze your business goals and plan the strategic roadmap." },
  { num: "02", title: "UI/UX Design", desc: "Crafting intuitive, beautiful interfaces that your users will love." },
  { num: "03", title: "App Development", desc: "Writing clean, scalable code to bring your application to life." },
  { num: "04", title: "Testing & QA", desc: "Rigorous testing to ensure a bug-free, perfect experience." },
  { num: "05", title: "Deployment", desc: "Launching your app smoothly to the Apple App Store and Google Play." },
  { num: "06", title: "Maintenance", desc: "Long-term support, updates, and monitoring post-launch." },
];

const industries = [
  { name: "Restaurants", icon: ShoppingCart },
  { name: "E-commerce", icon: ShoppingCart },
  { name: "Logistics", icon: Truck },
  { name: "Education", icon: GraduationCap },
  { name: "Business Automation", icon: Briefcase },
];

export default function MobileAppDevelopmentPage() {
  return (
    <div className="bg-[#050915] min-h-screen text-white overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-48 pb-32 px-6 min-h-[90vh] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/mobile_hero_background.png"
            alt="Futuristic Mobile App UI Concept"
            fill
            className="object-cover opacity-30 mix-blend-screen"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050915]/50 via-[#050915]/80 to-[#050915]" />
          <div className="absolute inset-0 bg-hero-glow opacity-50" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter uppercase leading-[1.1]">
              Mobile App <br />
              <span className="text-gradient drop-shadow-[0_0_20px_rgba(124,58,237,0.5)]">Development</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
              We build powerful, scalable, and user-friendly mobile applications for Android and iOS devices.
            </motion.p>
            <motion.div variants={fadeInUp} className="pt-8">
              <Link href="/contact">
                <button className="group relative px-8 py-4 bg-primary text-white text-lg font-bold tracking-widest uppercase rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                  <span className="relative z-10">Start Your App Project</span>
                  <div className="absolute inset-0 h-full w-0 bg-secondary transition-all duration-300 ease-out group-hover:w-full z-0" />
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
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-bold text-sm tracking-widest uppercase mb-4">
              Why Go Mobile?
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Your Business, In Their Pocket</h2>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
              In today's digital landscape, a mobile app isn't just a piece of software—it's a direct channel to your customers. 
              We craft intuitive mobile experiences designed to solve complex business problems, streamline operations, and drive unmatched growth. Let us transform your vision into an application that users love returning to.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Our Mobile App Solutions */}
      <section className="py-24 px-6 bg-[#03050C]">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Our Mobile Solutions" 
            subtitle="Comprehensive application development tailored to your specific market needs."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {solutions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-10 space-y-6 group rounded-[2rem]"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(124,58,237,0.3)]">
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

      {/* 4. Key Features & 6. Why Choose Us (Combined modern grid) */}
      <section className="py-24 px-6 relative">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Built for <br/><span className="text-gradient">Scale.</span></h2>
              <p className="text-white/60 leading-relaxed font-light">
                Our development team focuses on high-quality design, fast delivery, and future-ready architectures. We don't just build apps; we engineer scalable solutions with long-term support.
              </p>
            </div>
            
            <ul className="space-y-4">
              {["Professional development team", "High-quality design focus", "Fast delivery", "Long-term support"].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <ShieldCheck size={14} />
                  </div>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-primary/40 transition-all duration-300">
                <div className="flex items-start gap-5">
                  <div className="mt-1 text-secondary">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-heading mb-2 text-white">{feature.title}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Development Process */}
      <section className="py-24 px-6 bg-[#03050C] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Our Process" 
            subtitle="A streamlined, transparent development lifecycle from whiteboard to App Store."
          />
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-[45px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="hidden lg:block absolute top-[280px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
            
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-[#050915] border-2 border-white/10 flex items-center justify-center relative z-10 group-hover:border-primary transition-colors shadow-xl">
                  <span className="text-3xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-br from-white to-white/30 group-hover:from-primary group-hover:to-secondary">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-heading mt-6 mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Industries We Serve */}
      <section className="py-24 px-6 bg-[#050915]">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tighter">Industries We Empower</h2>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {industries.map((ind, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-secondary/50 transition-all font-medium text-sm">
                <ind.icon size={16} className="text-secondary" />
                {ind.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call To Action Section */}
      <section className="py-32 px-6 relative bg-gradient-to-b from-[#03050C] to-[#070b1a]">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-20 rounded-[3rem] border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tighter leading-tight drop-shadow-md">
                Turn your idea into a <br />
                <span className="text-gradient">powerful mobile app.</span>
              </h2>
              <div className="pt-4 flex justify-center">
                <Link href="/contact">
                  <button className="group relative px-10 py-5 bg-white text-[#050915] text-lg font-black tracking-widest uppercase rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] flex items-center gap-4">
                    <span className="relative z-10">Get Free Consultation</span>
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
