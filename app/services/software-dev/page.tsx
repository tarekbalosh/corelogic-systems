"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Code, 
  TerminalSquare, 
  ShieldCheck, 
  Server, 
  Boxes, 
  ArrowRight,
  Database,
  Building,
  Monitor,
  Workflow,
  BarChart,
  Users
} from "lucide-react";
import { SectionTitle } from "@/components/section-title";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

const solutions = [
  { title: "Business Management Systems", desc: "Centralize your operations with comprehensive, all-in-one management software.", icon: Building },
  { title: "ERP Systems", desc: "Unify your resources, planning, and financials without the technical headache.", icon: Boxes },
  { title: "CRM Systems", desc: "Build stronger customer relationships with tailored tracking and sales funnels.", icon: Users },
  { title: "Workflow Automation", desc: "Automate repetitive tasks and let your team focus on high-impact work.", icon: Workflow },
  { title: "Internal Dashboards", desc: "Real-time analytics and monitoring tools customized to your exact KPIs.", icon: BarChart },
  { title: "Industry-Specific Solutions", desc: "Unique digital architectures designed to solve the specific bottlenecks of your sector.", icon: TerminalSquare },
];

const features = [
  { title: "Fully Customized", desc: "Built perfectly to your bespoke requirements, no bloated templates.", icon: Code },
  { title: "High Stability", desc: "Engineered for maximum uptime and reliable high-speed performance.", icon: Server },
  { title: "Easy Integration", desc: "We connect seamlessly with your existing tools, APIs, and databases.", icon: Database },
  { title: "Intuitive Interfaces", desc: "Clean UI/UX ensuring your team requires minimal training to adapt.", icon: Monitor },
];

const processSteps = [
  { num: "01", title: "Business Analysis", desc: "We gather requirements and understand your operational bottlenecks." },
  { num: "02", title: "System Design", desc: "Mapping out the technical architecture and strategic planning." },
  { num: "03", title: "UI/UX Design", desc: "Creating user-centric interfaces focused on efficiency and ease." },
  { num: "04", title: "Development Phase", desc: "Writing clean, robust code to bring the custom solution to life." },
  { num: "05", title: "Testing & QA", desc: "Rigorous optimization to ensure zero bugs or performance dips." },
  { num: "06", title: "Deployment", desc: "Smooth rollout process followed by ongoing technical support." },
];

const industries = [
  { name: "Restaurants", icon: Building },
  { name: "Retail Businesses", icon: BarChart },
  { name: "Logistics", icon: Workflow },
  { name: "Healthcare", icon: ShieldCheck },
  { name: "Education", icon: Users },
  { name: "Corporate", icon: TerminalSquare },
];

export default function CustomSoftwareDevelopmentPage() {
  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-48 pb-32 px-6 min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Advanced Mesh Gradient Background */}
        <div className="absolute inset-0 z-0 bg-background">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-cyan-400/5 to-transparent blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-primary/10 via-emerald-400/5 to-transparent blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none" />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8 text-center lg:text-left">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/80 backdrop-blur-md text-primary text-sm font-semibold shadow-sm border border-primary/20 hover:border-primary/40 transition-colors">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span>Enterprise-Grade Architecture</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight leading-[1.05]">
              Custom Software <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Development</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/60 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              We engineer scalable, secure, and bespoke software ecosystems designed to automate your workflows and accelerate business growth.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/contact">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold hover:bg-primary/90 shadow-[0_8px_30px_rgba(6,182,212,0.2)] hover:shadow-[0_8px_40px_rgba(6,182,212,0.3)] hover:-translate-y-1 transition-all text-lg flex items-center gap-2">
                  Request Consultation
                  <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="#solutions">
                <button className="px-8 py-4 bg-background/50 backdrop-blur-md text-foreground rounded-2xl font-semibold hover:bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-all text-lg shadow-sm">
                  Explore Solutions
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
            {/* Main Glass Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] aspect-[4/3] bg-background/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center">
                  <Code size={24} />
                </div>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-3/4 h-4 bg-foreground/10 rounded-full" />
                <div className="w-full h-4 bg-foreground/5 rounded-full" />
                <div className="w-5/6 h-4 bg-foreground/5 rounded-full" />
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-24 bg-blue-500/20 rounded-lg" />
                <div className="h-10 w-24 bg-cyan-500/20 rounded-lg" />
              </div>
            </div>
            
            {/* Floating Element 1 */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Secure by Design</p>
                <p className="text-xs text-foreground/50">Enterprise grade</p>
              </div>
            </motion.div>

            {/* Floating Element 2 */}
            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-purple-500/10 text-purple-600 rounded-full flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Scalable Architecture</p>
                <p className="text-xs text-foreground/50">Ready for growth</p>
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
              Not Another Template
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Business Is Unique. <br className="hidden md:block"/>Your Software Should Be Too.</h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-3xl mx-auto">
              Generic software comes with limits. At CoreLogic, we don't believe in forcing your workflow into pre-built templates. 
              We engineer custom enterprise-grade software from the ground up, designed to solve your exact business problems, automate your redundant tasks, and drastically improve your operational efficiency. Let us build the digital backbone your business deserves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Our Custom Software Solutions */}
      <section className="py-24 px-6 relative">
        <div className="absolute left-0 top-1/3 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Enterprise Solutions</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">Tailor-made infrastructure focused on streamlining your business goals.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {solutions.map((item, idx) => (
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

      {/* 4. Key Features & 6. Why Choose Us */}
      <section className="py-24 px-6 relative bg-foreground/[0.01] border-y border-foreground/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-background p-8 rounded-3xl border border-foreground/10 hover:border-primary/20 hover:shadow-md transition-all duration-300 shadow-sm group">
                <div className="flex items-start gap-5">
                  <div className="mt-1 text-primary group-hover:scale-110 transition-transform">
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose <br/><span className="text-primary">CoreLogic.</span></h2>
              <p className="text-foreground/60 leading-relaxed text-lg">
                We are partners in your digitalization journey. Our approach focuses entirely on your business goals, resulting in highly scalable systems that grow with you.
              </p>
            </div>
            
            <ul className="space-y-4">
              {["Fully tailored solutions", "Focus on business goals", "Scalable architecture", "Long-term maintenance", "Fast & efficient delivery"].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Strategy</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">A crystal-clear blueprint to take your software from initial concept to deployment.</p>
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

      {/* 7. Industries We Serve */}
      <section className="py-24 px-6 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Industries We Empower</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {industries.map((ind, i) => (
              <div key={i} className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-foreground/10 bg-background text-foreground/80 hover:border-primary/30 transition-all font-medium text-sm shadow-sm cursor-default hover:shadow-md">
                <ind.icon size={16} className="text-primary" />
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
            className="p-12 md:p-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[3rem] border border-primary/10 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Let's build a system that <br />
                <span className="text-primary">fits your business perfectly.</span>
              </h2>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                Stop relying on generic tools. Start the conversation today to craft a digital solution designed exclusively for your success.
              </p>
              <div className="pt-4 flex justify-center">
                <Link href="/contact">
                  <button className="px-10 py-5 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2">
                    Start Your Project Today
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
