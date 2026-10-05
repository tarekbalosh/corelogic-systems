import React from "react";
import Link from "next/link";
import { ParticleBackground } from "@/components/particle-background";
import { projectsData } from "@/config/work";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function WorkPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Our <span className="text-primary">Featured Work</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-16 leading-relaxed">
          Explore a showcase of custom software and systems we've built for our clients.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <Link 
              key={project.slug} 
              href={`/work/${project.slug}`}
              className="group rounded-3xl overflow-hidden border border-foreground/10 bg-background/50 hover:border-primary/50 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-foreground/5">
                {/* Fallback color if image is missing */}
                <div className="absolute inset-0 bg-primary/10" />
                <Image 
                  src={project.image} 
                  alt={project.title.en} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  {project.category.en}
                </span>
                <h3 className="text-2xl font-bold mb-4">{project.title.en}</h3>
                
                <div className="mt-auto flex items-center justify-between text-sm font-semibold text-foreground/60 group-hover:text-primary transition-colors">
                  <span>View Case Study</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
