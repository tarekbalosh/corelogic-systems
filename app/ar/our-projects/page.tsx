import React from "react";
import Link from "next/link";
import { ParticleBackground } from "@/components/particle-background";
import { projectsData } from "@/config/work";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function ArabicWorkPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans" dir="rtl">
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          أعمالنا <span className="text-primary">المميزة</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-16 leading-relaxed">
          استكشف مجموعة من الأنظمة والتطبيقات المخصصة التي طورناها لعملائنا.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <a 
              key={project.slug} 
              href={project.demoLink || `/ar/our-projects/${project.slug}`}
              target={project.demoLink ? "_blank" : undefined}
              rel={project.demoLink ? "noopener noreferrer" : undefined}
              className="group rounded-3xl overflow-hidden border border-foreground/10 bg-background hover:border-primary/50 transition-all duration-500 flex flex-col shadow-sm hover:shadow-2xl hover:-translate-y-2"
            >
              {/* صورة المنتج */}
              <div className="aspect-video relative overflow-hidden bg-foreground/5 border-b border-foreground/10">
                <Image 
                  src={project.image} 
                  alt={project.title.ar} 
                  fill 
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* التصنيف */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 text-xs font-bold bg-background/90 backdrop-blur-md text-foreground rounded-full shadow-sm">
                    {project.category.ar}
                  </span>
                </div>
              </div>

              {/* المحتوى */}
              <div className="p-6 md:p-8 flex flex-col flex-1 bg-gradient-to-b from-background to-foreground/[0.02]">
                <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {project.title.ar}
                </h3>
                
                <p className="text-sm md:text-base text-foreground/70 mb-6 line-clamp-2 leading-relaxed">
                  {project.solution.ar}
                </p>
                
                {/* أبرز المميزات */}
                <ul className="space-y-2 mb-8 flex-1">
                  {project.features.ar.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary ml-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* زر الإجراء */}
                <div className="mt-auto pt-5 border-t border-foreground/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.demoLink ? "عرض النظام الحي" : "دراسة الحالة"}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
