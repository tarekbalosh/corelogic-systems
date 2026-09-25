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
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

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
    <div className="bg-background min-h-screen text-foreground overflow-hidden font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-48 pb-32 px-6 min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Advanced Mesh Gradient Background */}
        <div className="absolute inset-0 z-0 bg-background">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-violet-500/10 via-purple-400/5 to-transparent blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/10 via-blue-400/5 to-transparent blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none" />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8 text-center lg:text-left">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/80 backdrop-blur-md text-violet-600 text-sm font-semibold shadow-sm border border-violet-500/20 hover:border-violet-500/40 transition-colors">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
              </span>
              <span>Top-Rated Mobile Agency</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight leading-[1.05]">
              Custom Mobile App <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">Development</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/60 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              We build powerful, scalable, and secure applications tailored for global B2B enterprises on both Android and iOS platforms.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/contact">
                <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-semibold hover:opacity-90 shadow-[0_8px_30px_rgba(124,58,237,0.2)] hover:shadow-[0_8px_40px_rgba(124,58,237,0.3)] hover:-translate-y-1 transition-all text-lg flex items-center gap-2">
                  Start Your App Project
                  <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="#solutions">
                <button className="px-8 py-4 bg-background/50 backdrop-blur-md text-foreground rounded-2xl font-semibold hover:bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-all text-lg shadow-sm">
                  View Solutions
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Hero Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative h-[550px] flex items-center justify-center"
          >
            {/* Main Phone Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[560px] bg-background/40 backdrop-blur-2xl rounded-[3rem] border-8 border-white/40 shadow-[0_30px_60px_-15px_rgba(124,58,237,0.15)] p-4 flex flex-col overflow-hidden">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/40 rounded-b-2xl backdrop-blur-md z-20" />
              
              {/* App Content */}
              <div className="flex-1 w-full mt-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600">
                    <Smartphone size={20} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-foreground/5" />
                </div>
                <div className="w-3/4 h-6 bg-foreground/10 rounded-full mt-4" />
                <div className="w-1/2 h-4 bg-foreground/5 rounded-full" />
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="w-full h-24 bg-violet-500/10 rounded-2xl" />
                  <div className="w-full h-24 bg-indigo-500/10 rounded-2xl" />
                </div>
                <div className="w-full h-32 bg-background/80 rounded-2xl border border-foreground/5 mt-auto mb-2" />
              </div>
            </div>
            
            {/* Floating Element 1 */}
            <motion.div 
              animate={{ y: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute top-1/4 -right-4 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-full flex items-center justify-center">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Fast Native Apps</p>
                <p className="text-xs text-foreground/50">iOS & Android</p>
              </div>
            </motion.div>

            {/* Floating Element 2 */}
            <motion.div 
              animate={{ y: [15, -15, 15] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="absolute bottom-1/4 -left-8 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Highly Secure</p>
                <p className="text-xs text-foreground/50">Encrypted data</p>
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
            <div className="inline-block px-4 py-1.5 rounded-full border border-foreground/10 bg-background text-foreground/70 font-semibold text-sm mb-2 shadow-sm">
              Why Go Mobile?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Business, In Their Pocket</h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-3xl mx-auto">
              In today's digital landscape, a mobile app isn't just a piece of software—it's a direct channel to your customers. 
              We craft intuitive mobile experiences designed to solve complex business problems, streamline operations, and drive unmatched growth. Let us transform your vision into an application that users love returning to.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Our Mobile App Solutions */}
      <section id="solutions" className="py-24 px-6 relative">
        <div className="absolute left-0 top-1/3 w-[400px] h-[400px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Mobile Solutions</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">Comprehensive application development tailored to your specific market needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {solutions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background/80 backdrop-blur-3xl p-8 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-violet-500/20 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-violet-600 group-hover:bg-violet-500/10 transition-colors mb-6 shadow-sm">
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

      {/* 4. Key Features & Why Choose Us */}
      <section className="py-24 px-6 relative bg-foreground/[0.01] border-y border-foreground/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-background p-8 rounded-3xl border border-foreground/10 hover:border-violet-500/20 hover:shadow-md transition-all duration-300 shadow-sm group">
                <div className="flex items-start gap-5">
                  <div className="mt-1 text-violet-600 group-hover:scale-110 transition-transform">
                    <feature.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h4>
                    <p className="text-foreground/60 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built for <br/><span className="text-violet-600">Scale.</span></h2>
              <p className="text-foreground/60 leading-relaxed text-lg">
                Our development team focuses on high-quality design, fast delivery, and future-ready architectures. We don't just build apps; we engineer scalable solutions with long-term support.
              </p>
            </div>
            
            <ul className="space-y-4">
              {["Professional development team", "High-quality design focus", "Fast delivery", "Long-term support"].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600 shrink-0">
                    <ShieldCheck size={14} />
                  </div>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Development Process */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Process</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">A streamlined, transparent development lifecycle from whiteboard to App Store.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background/50 border border-slate-200/60 p-8 rounded-3xl hover:shadow-lg hover:border-violet-500/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/10 transition-colors" />
                <div className="text-5xl font-bold text-foreground/10 mb-6 group-hover:text-violet-500/20 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mt-2 mb-3 text-foreground">{step.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Industries We Serve */}
      <section className="py-24 px-6 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Industries We Empower</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {industries.map((ind, i) => (
              <div key={i} className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-foreground/10 bg-background text-foreground/80 hover:border-violet-500/30 transition-all font-medium text-sm shadow-sm cursor-default hover:shadow-md">
                <ind.icon size={16} className="text-violet-600" />
                {ind.name}
              </div>
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
            className="p-12 md:p-24 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-background rounded-[3rem] border border-violet-500/10 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Turn your idea into a <br />
                <span className="text-violet-600">powerful mobile app.</span>
              </h2>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                Ready to take your business to the next level? Start the conversation today and let us build an application your users will love.
              </p>
              <div className="pt-4 flex justify-center">
                <Link href="/contact">
                  <button className="px-10 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-semibold hover:opacity-90 shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2">
                    Get Free Consultation
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
