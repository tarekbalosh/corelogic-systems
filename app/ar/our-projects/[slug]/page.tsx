import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { projectsData } from "@/config/work";
import { ParticleBackground } from "@/components/particle-background";
import { ArrowRight, ExternalLink, CheckCircle } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = projectsData.find(p => p.slug === params.slug);
  if (!project) return { title: "المشروع غير موجود" };
  
  return {
    title: `${project.title.ar} | دراسة حالة`,
    description: project.problem.ar,
  };
}

export default function ArabicCaseStudyPage({ params }: { params: { slug: string } }) {
  const project = projectsData.find(p => p.slug === params.slug);
  
  if (!project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans" dir="rtl">
      <ParticleBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        <Link href="/ar/our-projects" className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-12">
          <ArrowRight size={16} /> العودة إلى جميع الأعمال
        </Link>

        <header className="mb-16">
          <span className="text-sm font-bold uppercase tracking-wider text-primary mb-4 block">
            {project.category.ar}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
            {project.title.ar}
          </h1>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.ar.map(tag => (
              <span key={tag} className="px-3 py-1 bg-foreground/5 rounded-full text-sm font-medium border border-foreground/10">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="aspect-video relative rounded-3xl overflow-hidden border border-foreground/10 shadow-2xl">
            <Image 
              src={project.image} 
              alt={project.title.ar} 
              fill 
              className="object-cover" 
            />
          </div>
        </header>

        <div className="space-y-16 text-lg text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">التحدي</h2>
            <p>{project.problem.ar}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">الحل</h2>
            <p>{project.solution.ar}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">الميزات الرئيسية</h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {project.features.ar.map(feature => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-1 shrink-0" size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">التقنيات المستخدمة</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span key={tech} className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg text-sm border border-primary/20">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-foreground/5 p-8 rounded-3xl border border-foreground/10">
            <h2 className="text-2xl font-bold text-foreground mb-4">النتيجة</h2>
            <p>{project.result.ar}</p>
          </section>

          {project.demoLink && (
            <div className="pt-8 border-t border-foreground/10 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div>
                <h3 className="font-bold text-foreground">النسخة التجريبية متاحة</h3>
                {project.demoNote && <p className="text-sm text-foreground/60">{project.demoNote.ar}</p>}
              </div>
              <a 
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                عرض النسخة التجريبية <ExternalLink size={16} className="rotate-180" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
