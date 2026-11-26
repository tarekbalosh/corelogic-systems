import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle } from "lucide-react";
import { projectsData } from "@/config/work";
import { ParticleBackground } from "@/components/particle-background";
import { buttonVariants } from "@/components/neon-button";
import { JsonLd } from "@/components/json-ld";
import { getDictionary, hasLocale } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  localizedPath,
  pageMetadata,
  webPageJsonLd,
} from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projectsData.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) {
    return { title: dict.meta.projectNotFound, robots: { index: false } };
  }

  const title =
    (project.title as Record<string, string>)[locale] ?? project.title.en;
  const metaDescription =
    (project.metaDescription as Record<string, string>)[locale] ??
    project.metaDescription.en;

  const brandSuffixLen = locale === "ar" ? 19 : 20; // " | CoreLogic Systems"
  const withSuffix = `${title} – ${dict.meta.caseStudySuffix}`;
  const pageTitle =
    withSuffix.length + brandSuffixLen <= 60 ? withSuffix : title;

  return pageMetadata({
    path: `/our-projects/${project.slug}`,
    locale,
    title: pageTitle,
    description: metaDescription,
  });
}

export default async function LocalizedCaseStudyPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) notFound();

  const dict = await getDictionary(locale);
  const isArabic = locale === "ar";
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  const title =
    (project.title as Record<string, string>)[locale] ?? project.title.en;
  const category =
    (project.category as Record<string, string>)[locale] ?? project.category.en;
  const tags =
    (project.tags as Record<string, string[]>)[locale] ?? project.tags.en;
  const problem =
    (project.problem as Record<string, string>)[locale] ?? project.problem.en;
  const solution =
    (project.solution as Record<string, string>)[locale] ?? project.solution.en;
  const features =
    (project.features as Record<string, string[]>)[locale] ??
    project.features.en;
  const result =
    (project.result as Record<string, string>)[locale] ?? project.result.en;
  const demoNote = project.demoNote
    ? (project.demoNote as Record<string, string>)[locale] ??
      project.demoNote.en
    : null;

  const metaDescription =
    (project.metaDescription as Record<string, string>)[locale] ??
    project.metaDescription.en;
  const projectPath = localizedPath(`/our-projects/${project.slug}`, locale);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <JsonLd
        data={[
          webPageJsonLd({
            name: title,
            description: metaDescription,
            path: projectPath,
            locale,
          }),
          breadcrumbJsonLd([
            { name: dict.meta.breadcrumbHome, path: localizedPath("/", locale) },
            {
              name: dict.meta.breadcrumbProjects,
              path: localizedPath("/our-projects", locale),
            },
            {
              name: title,
              path: projectPath,
            },
          ]),
        ]}
      />
      <ParticleBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        <Link
          href={localizedPath("/our-projects", locale)}
          className={buttonVariants({
            variant: "secondary",
            size: "sm",
            className: "mb-12",
          })}
        >
          <BackArrow size={16} className="shrink-0" />
          <span>{dict.projectsPage.backToAll}</span>
        </Link>

        <header className="mb-16">
          <span className="text-sm font-bold uppercase tracking-wider text-primary mb-4 block">
            {category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 break-words hyphens-auto">
            {title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-foreground/5 rounded-full text-sm font-medium border border-foreground/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="aspect-video relative rounded-3xl overflow-hidden border border-foreground/10 shadow-2xl">
            <Image
              src={project.image}
              alt={title}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
          </div>

          {project.secondaryImages && project.secondaryImages.length > 0 && (
            <div className="mt-8 space-y-6">
              {project.secondaryImages.map((img) => {
                const alt =
                  (img.alt as Record<string, string>)[locale] ?? img.alt.en;
                return (
                  <div key={img.src} className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/60 block">
                      {alt}
                    </span>
                    <div className="aspect-video relative rounded-3xl overflow-hidden border border-foreground/10 shadow-2xl">
                      <Image
                        src={img.src}
                        alt={alt}
                        fill
                        sizes="(min-width: 896px) 896px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </header>

        <div className="space-y-14 text-lg text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {dict.projectsPage.challengeHeading}
            </h2>
            <p>{problem}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {dict.projectsPage.solutionHeading}
            </h2>
            <p>{solution}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {dict.projectsPage.featuresHeading}
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle
                    className="text-primary mt-1 shrink-0"
                    size={20}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {dict.projectsPage.technologiesHeading}
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg text-sm border border-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-foreground/5 p-6 sm:p-8 rounded-3xl border border-foreground/10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {dict.projectsPage.resultHeading}
            </h2>
            <p>{result}</p>
          </section>

          {project.demoLink && (
            <div className="pt-8 border-t border-foreground/10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div>
                <h3 className="font-bold text-foreground">
                  {dict.projectsPage.demoAvailable}
                </h3>
                {demoNote && (
                  <p className="text-sm text-foreground/60 mt-1">{demoNote}</p>
                )}
              </div>
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                  className: "w-full sm:w-auto shrink-0",
                })}
              >
                <span>{dict.projectsPage.viewLiveDemo}</span>
                <ExternalLink
                  size={18}
                  className={isArabic ? "shrink-0 rotate-180" : "shrink-0"}
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
