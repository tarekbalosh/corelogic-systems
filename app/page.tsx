import { Hero } from "@/components/hero";
import { ParticleBackground } from "@/components/particle-background";
import { ServicesGrid } from "@/components/services-grid";
import { PortfolioMasonry } from "@/components/portfolio-masonry";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  locale: "en",
  absoluteTitle: true,
  title: "CoreLogic Systems | Custom Software, Web & Mobile Apps, AI Automation",
  description:
    "We design and build custom business systems, web and mobile apps, and AI-powered automation for growing businesses. Book a free consultation.",
});

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Immersive Particle Background (Fixed) */}
      <ParticleBackground />

      {/* Page Content */}
      <div className="relative z-10 flex flex-col gap-0 pb-32">
        
        {/* Cinematic Hero Region */}
        <Hero />

        {/* Core AI Intelligence Services */}
        <ServicesGrid />

        {/* Technical Showcase Portfolio */}
        <PortfolioMasonry />

      </div>
    </div>
  );
}
