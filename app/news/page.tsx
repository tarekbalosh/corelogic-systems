"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Search, Filter } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const articles = [
  {
    category: "Insights",
    title: "The Impact of Generative AI on Enterprise Middleware",
    date: "April 15, 2026",
    excerpt: "Exploring how LLMs are redefining the layer between applications and core data infrastructure."
  },
  {
    category: "Announcements",
    title: "Series B Funding: Scaling the Neural Backbone",
    date: "March 28, 2026",
    excerpt: "CoreLogic Systems secures $45M to accelerate deployment of regional AI compute clusters."
  },
  {
    category: "Technical",
    title: "Optimizing PyTorch for NVIDIA H100 GPU Clusters",
    date: "February 12, 2026",
    excerpt: "A deep dive into kernel-level performance tuning for the latest industrial hardware."
  },
  {
    category: "Whitepapers",
    title: "Ethical Intelligence: The CoreLogic Governance Framework",
    date: "January 05, 2026",
    excerpt: "Our comprehensive approach to building safe, transparent, and bias-free AI models."
  }
];

export default function NewsPage() {
  return (
    <div className="bg-brand-cream min-h-screen text-brand-teal selection:bg-brand-orange/30">
      <div className="pt-40 pb-32 max-w-7xl mx-auto px-6">
        <motion.div
           initial="hidden"
           animate="visible"
           variants={staggerContainer}
           className="space-y-20"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-6">
                <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-sm">Resources & News</span>
                <h1 className="text-6xl md:text-8xl font-black font-heading tracking-tighter uppercase leading-none">
                    Industrial <br /><span className="text-brand-orange">Insights</span>
                </h1>
            </div>
            <div className="flex gap-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-teal/30 group-focus-within:text-brand-orange transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search resources..." 
                        className="pl-12 pr-6 py-4 bg-white border border-brand-teal/5 rounded-2xl w-64 focus:outline-none focus:border-brand-orange focus:shadow-lg transition-all text-sm"
                    />
                </div>
                <button className="p-4 bg-white border border-brand-teal/5 rounded-2xl hover:bg-brand-orange hover:text-white transition-all shadow-sm">
                    <Filter size={20} />
                </button>
            </div>
          </motion.div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((a, i) => (
                <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="group"
                >
                    <div className="bg-white p-10 rounded-[2.5rem] border border-brand-teal/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col justify-between space-y-8">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="px-4 py-1.5 rounded-full bg-brand-teal/5 text-[11px] font-black uppercase tracking-widest text-brand-orange border border-brand-orange/10">
                                    {a.category}
                                </span>
                                <span className="text-[12px] font-bold text-brand-teal/30 tracking-wider">
                                    {a.date}
                                </span>
                            </div>
                            <h2 className="text-3xl font-black font-heading tracking-tighter uppercase group-hover:text-brand-orange transition-colors duration-300">
                                {a.title}
                            </h2>
                            <p className="text-brand-teal/50 leading-relaxed font-light">
                                {a.excerpt}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-brand-teal font-black text-sm tracking-widest uppercase group-hover:gap-4 transition-all">
                            Read Full Article <ArrowUpRight size={20} className="text-brand-orange" />
                        </div>
                    </div>
                </motion.div>
            ))}
          </div>

          {/* CTA Footer for News */}
          <motion.div variants={fadeInUp} className="bg-brand-teal rounded-[3rem] p-16 text-center text-white space-y-8">
             <h2 className="text-4xl font-black font-heading tracking-tighter uppercase">Stay Ahead of the Curve</h2>
             <p className="text-white/50 max-w-lg mx-auto leading-relaxed">
                 Subscribe to our monthly technical digest to receive the latest updates on industrial AI and modern software architecture.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                 <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 px-8 py-4 rounded-full flex-1 focus:outline-none focus:border-brand-orange" />
                 <button className="bg-brand-orange px-10 py-4 rounded-full font-black tracking-widest uppercase text-brand-teal text-sm hover:scale-105 transition-transform">Subscribe</button>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
