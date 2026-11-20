"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { SectionTitle } from "./section-title";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { NeonButton } from "./neon-button";

const projects = [
  {
    title: "Accounting Pro",
    category: "Financial System",
    image: "/accounting_pro_dashboard.png",
    tags: ["Accounting", "Restaurant", "Financial"],
    link: "/our-projects/accounting-pro",
    span: "col-span-2 md:col-span-1 lg:col-span-2",
  },
  {
    title: "POS System project",
    category: "Restaurant POS",
    image: "/pos_system_dashboard.png",
    tags: ["POS", "Restaurant"],
    link: "/our-projects/pos-system",
    span: "col-span-2 md:col-span-1 lg:col-span-1",
  },
  {
    title: "Management Student Systems",
    category: "Education",
    image: "/student_management_dashboard.png",
    tags: ["Students", "Management"],
    link: "/our-projects/student-management",
    span: "col-span-2 md:col-span-1 lg:col-span-1",
  },
  {
    title: "BookEase Platform",
    category: "Scheduling Platform",
    image: "/bookease_dashboard.png",
    tags: ["Scheduling", "Appointments", "SaaS"],
    link: "/our-projects/book-ease",
    span: "col-span-2 md:col-span-1 lg:col-span-1",
  },
  {
    title: "Hospital Management System",
    category: "Healthcare",
    description: "A comprehensive full-stack healthcare management platform featuring real-time operational analytics, patient & doctor records, pharmacy inventory alerts, and billing.",
    image: "/projects/hospital-management.jpg",
    tags: ["Healthcare", "Management", "SaaS", "Full-Stack"],
    link: "/our-projects/hospital-management",
    demoLink: "https://hospital-management-nine-delta.vercel.app/login",
    span: "col-span-2 md:col-span-1 lg:col-span-1",
  },
  {
    title: "Car Rental Platform",
    category: "Automotive",
    description: "A modern, high-performance car rental platform built for the Malaysian market, featuring an elegant UI/UX, advanced filtering, and seamless booking capabilities.",
    image: "/car-rental-platform.jpg",
    tags: ["Automotive", "E-commerce", "UI/UX", "Full-Stack"],
    link: "/our-projects/car-rental-platform",
    demoLink: "https://cars-alrayees.vercel.app/en",
    span: "col-span-2 md:col-span-1 lg:col-span-1",
  },
  {
    title: "Corelogic CRM",
    category: "Enterprise SaaS",
    description: "An all-in-one Customer Relationship Management platform designed to streamline sales pipelines, track leads, and automate daily team tasks.",
    image: "/projects/corelogic-crm.png",
    tags: ["Enterprise SaaS", "CRM", "Sales Pipeline", "Analytics"],
    link: "/our-projects/corelogic-crm",
    demoLink: "https://corelogic-crm.vercel.app/",
    span: "col-span-2 md:col-span-1 lg:col-span-1",
  },
  {
    title: "Al Rayees Trading Platform",
    category: "Global Trading",
    description: "A corporate global commodity trading platform for Al Rayees SDN BHD, showcasing agricultural products, vegetable oils, and international quote workflows.",
    image: "/projects/alrayees-trading.jpg",
    tags: ["Global Trading", "B2B", "Commodities", "PWA"],
    link: "/our-projects/alrayees-trading",
    demoLink: "https://alrayees.vercel.app/",
    span: "col-span-2 md:col-span-1 lg:col-span-1",
  },
  {
    title: "Consultation Booking Platform",
    category: "Booking & Scheduling",
    description: "A bilingual consultation booking and scheduling system featuring a 3-step client booking flow, admin approval workflows, and WhatsApp/Google Meet integration.",
    image: "/projects/consultation-booking.jpg",
    tags: ["Booking & Scheduling", "Consultations", "Bilingual", "Full-Stack"],
    link: "/our-projects/consultation-booking",
    demoLink: "https://booking-systembro.vercel.app/en",
    span: "col-span-2 md:col-span-1 lg:col-span-1",
  },
  {
    title: "ShopLink WhatsApp Storefront",
    category: "E-Commerce",
    description: "A modern digital product catalog and ordering storefront that lets local shops and bakeries showcase menus, manage carts, and receive instant orders directly via WhatsApp.",
    image: "/projects/shoplink-storefront.jpg",
    tags: ["E-Commerce", "WhatsApp Ordering", "Digital Catalog", "Retail"],
    link: "/our-projects/shoplink-storefront",
    demoLink: "https://shope-link.vercel.app/",
    span: "col-span-2 md:col-span-1 lg:col-span-2",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 60, damping: 15 }
  }
} as const;

export const PortfolioMasonry = () => {
  return (
    <section id="portfolio" className="py-24 px-6 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Featured Projects"
          subtitle="A showcase of custom software and systems we've built for our clients."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[320px]"
        >
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className={project.span}
            >
              <Link href={project.link} className="block h-full w-full group">
                <div className="relative h-full w-full bg-background rounded-3xl border border-foreground/10 group-hover:border-primary/30 group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                  />

                  {/* Dark Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-8 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                    <div className="space-y-4 translate-y-0 lg:translate-y-8 lg:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="space-y-2">
                        <span className="text-[11px] md:text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 backdrop-blur-md border border-primary/20 px-3 py-1 rounded-full inline-block shadow-sm">
                          {project.category}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md leading-tight">{project.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium text-white/90 backdrop-blur-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pt-3">
                        <button className="w-full sm:w-auto px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-md text-sm">
                          Live Demo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
