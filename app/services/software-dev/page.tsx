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
    <div className="bg-[#050915] min-h-screen text-white overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-48 pb-32 px-6 min-h-[90vh] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/software_hero_background.png"
            alt="Futuristic Enterprise Software Architecture Concept"
            fill
            className="object-cover opacity-25 mix-blend-screen"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050915]/60 via-[#050915]/80 to-[#050915]" />
          <div className="absolute inset-0 bg-hero-glow opacity-60" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter uppercase leading-[1.1]">
              Custom Software <br />
              <span className="text-gradient drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">Development</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
              We build tailor-made software solutions designed specifically for your business needs.
            </motion.p>
            <motion.div variants={fadeInUp} className="pt-8">
              <Link href="/contact">
                <button className="group relative px-8 py-4 bg-secondary text-white text-lg font-bold tracking-widest uppercase rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                  <span className="relative z-10">Request a Free Consultation</span>
                  <div className="absolute inset-0 h-full w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full z-0" />
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
            <div className="inline-block px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 text-secondary font-bold text-sm tracking-widest uppercase mb-4">
              Not Another Template
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Your Business Is Unique. <br/>Your Software Should Be Too.</h2>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
              Generic software comes with limits. At CoreLogic, we don't believe in forcing your workflow into pre-built templates. 
              We engineer custom enterprise-grade software from the ground up, designed to solve your exact business problems, automate your redundant tasks, and drastically improve your operational efficiency. Let us build the digital backbone your business deserves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Our Custom Software Solutions */}
      <section className="py-24 px-6 bg-[#02040a]">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Enterprise Solutions" 
            subtitle="Tailor-made infrastructure focused on streamlining your business goals."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {solutions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-10 space-y-6 group rounded-[2rem] border-white/5 hover:border-secondary/30"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(6,182,212,0.3)]">
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

      {/* 4. Key Features & 6. Why Choose Us */}
      <section className="py-24 px-6 relative">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-secondary/40 transition-all duration-300 shadow-xl">
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

          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Why Choose <br/><span className="text-gradient">CoreLogic.</span></h2>
              <p className="text-white/60 leading-relaxed font-light">
                We are partners in your digitalization journey. Our approach focuses entirely on your business goals, resulting in highly scalable systems that grow with you.
              </p>
            </div>
            
            <ul className="space-y-4">
              {["Fully tailored solutions", "Focus on business goals", "Scalable architecture", "Long-term maintenance", "Fast & efficient delivery"].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80 font-medium tracking-wide">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
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
      <section className="py-24 px-6 bg-[#02040a] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Our Strategy" 
            subtitle="A crystal-clear blueprint to take your software from initial concept to deployment."
          />
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 relative">
            <div className="hidden lg:block absolute top-[45px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
            <div className="hidden lg:block absolute top-[280px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-[#050915] border-2 border-white/10 flex items-center justify-center relative z-10 group-hover:border-secondary transition-colors shadow-2xl">
                  <span className="text-3xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-br from-white to-white/30 group-hover:from-secondary group-hover:to-primary">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-heading mt-6 mb-3 group-hover:text-secondary transition-colors">{step.title}</h3>
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
              <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all font-medium text-sm cursor-default">
                <ind.icon size={16} className="text-primary" />
                {ind.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call To Action Section */}
      <section className="py-32 px-6 relative bg-gradient-to-b from-[#02040a] to-[#040814]">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-20 rounded-[3rem] border border-secondary/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 opacity-50" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tighter leading-tight drop-shadow-md">
                Let's build a system that <br />
                <span className="text-gradient">fits your business perfectly.</span>
              </h2>
              <div className="pt-4 flex justify-center">
                <Link href="/contact">
                  <button className="group relative px-10 py-5 bg-white text-[#050915] text-lg font-black tracking-widest uppercase rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] flex items-center gap-4">
                    <span className="relative z-10">Start Your Project Today</span>
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
