import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { JsonLd } from "@/components/json-ld";
import { projectsData } from "@/config/work";
import { getDictionary, hasLocale } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  localizedPath,
  pageMetadata,
  webPageJsonLd,
} from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return pageMetadata({
    path: "/our-projects",
    locale,
    title: dict.meta.projectsTitle,
    description: dict.meta.projectsDescription,
  });
}

export default async function LocalizedProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const isArabic = locale === "ar";
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <JsonLd
        data={[
          webPageJsonLd({
            name: dict.meta.projectsTitle,
            description: dict.meta.projectsDescription,
            path: localizedPath("/our-projects", locale),
            locale,
          }),
          breadcrumbJsonLd([
            { name: dict.meta.breadcrumbHome, path: localizedPath("/", locale) },
            {
              name: dict.meta.breadcrumbProjects,
              path: localizedPath("/our-projects", locale),
            },
          ]),
        ]}
      />
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 break-words hyphens-auto">
          {dict.projectsPage.heroTitle1}{" "}
          <span className="text-primary">{dict.projectsPage.heroTitle2}</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-16 leading-relaxed">
          {dict.projectsPage.heroSubtitle}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => {
            const title =
              (project.title as Record<string, string>)[locale] ??
              project.title.en;
            const category =
              (project.category as Record<string, string>)[locale] ??
              project.category.en;
            const solution =
              (project.solution as Record<string, string>)[locale] ??
              project.solution.en;
            const features =
              (project.features as Record<string, string[]>)[locale] ??
              project.features.en;

            return (
              <Link
                key={project.slug}
                href={localizedPath(`/our-projects/${project.slug}`, locale)}
                className="group rounded-3xl overflow-hidden border border-foreground/10 bg-background hover:border-primary/50 transition-all duration-500 flex flex-col shadow-sm hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="aspect-video relative overflow-hidden bg-foreground/5 border-b border-foreground/10">
                  <Image
                    src={project.image}
                    alt={title}
                    fill
                    loading={index < 2 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : undefined}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div
                    className={`absolute top-4 ${isArabic ? "right-4" : "left-4"} z-10`}
                  >
                    <span className="px-3 py-1 text-xs font-bold bg-background/90 backdrop-blur-md text-foreground rounded-full shadow-sm">
                      {category}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1 bg-gradient-to-b from-background to-foreground/[0.02] min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors break-words hyphens-auto">
                    {title}
                  </h2>
                  <p className="text-sm md:text-base text-foreground/70 mb-6 line-clamp-2 leading-relaxed">
                    {solution}
                  </p>

                  <ul className="space-y-2 mb-8 flex-1">
                    {features.slice(0, 3).map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-foreground/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5 border-t border-foreground/10 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {dict.projectsPage.viewCaseStudy}
                    </span>
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white transition-all duration-300">
                      <ForwardArrow size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
