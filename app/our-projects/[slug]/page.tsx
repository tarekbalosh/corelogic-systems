import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { projectsData } from "@/config/work";
import { ParticleBackground } from "@/components/particle-background";
import { ArrowLeft, ExternalLink, CheckCircle } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = projectsData.find(p => p.slug === params.slug);
  if (!project) return { title: "Project Not Found" };
  
  return {
    title: `${project.title.en} | Case Study`,
    description: project.problem.en,
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = projectsData.find(p => p.slug === params.slug);
  
  if (!project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <ParticleBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        <Link href="/our-projects" className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-12">
          <ArrowLeft size={16} /> Back to all work
        </Link>

        <header className="mb-16">
          <span className="text-sm font-bold uppercase tracking-wider text-primary mb-4 block">
            {project.category.en}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
            {project.title.en}
          </h1>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.en.map(tag => (
              <span key={tag} className="px-3 py-1 bg-foreground/5 rounded-full text-sm font-medium border border-foreground/10">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="aspect-video relative rounded-3xl overflow-hidden border border-foreground/10 shadow-2xl">
            <Image 
              src={project.image} 
              alt={project.title.en} 
              fill 
              className="object-cover" 
            />
          </div>
        </header>

        <div className="space-y-16 text-lg text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">The Challenge</h2>
            <p>{project.problem.en}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Solution</h2>
            <p>{project.solution.en}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Key Features</h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {project.features.en.map(feature => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-1 shrink-0" size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span key={tech} className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg text-sm border border-primary/20">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-foreground/5 p-8 rounded-3xl border border-foreground/10">
            <h2 className="text-2xl font-bold text-foreground mb-4">The Result</h2>
            <p>{project.result.en}</p>
          </section>

          {project.demoLink && (
            <div className="pt-8 border-t border-foreground/10 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div>
                <h3 className="font-bold text-foreground">Live Demo Available</h3>
                {project.demoNote && <p className="text-sm text-foreground/60">{project.demoNote.en}</p>}
              </div>
              <a 
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                View Live Demo <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
