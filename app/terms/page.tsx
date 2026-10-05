import React from "react";
import { ParticleBackground } from "@/components/particle-background";

export default function TermsOfService() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <ParticleBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        <div className="space-y-6 text-foreground/80 leading-relaxed text-lg">
          <p>
            Welcome to <strong>CoreLogic Systems</strong>. By using our website and services, you agree to be bound by the following terms and conditions:
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing this website or using our software development and AI services, you acknowledge that you have read, understood, and agreed to these terms in their entirety.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">2. Services Provided</h2>
          <p>
            We provide technical services including web design, mobile app development, automation solutions, and artificial intelligence. Specific projects may be subject to additional, separate agreements and contracts that detail the scope of work and deliverables.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">3. Intellectual Property</h2>
          <p>
            All content displayed on this website, including text, designs, and logos, is the property of CoreLogic Systems and may not be used or copied without prior permission. Intellectual property rights for client projects are determined according to the respective contracts.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">4. Disclaimer of Liability</h2>
          <p>
            We always strive to provide high-quality services; however, we do not provide absolute guarantees that the website or services will be free of occasional technical errors. We are not liable for any indirect damages that may arise from the use of our services.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">5. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Your continued use of the website following any changes constitutes your acceptance of the new terms.
          </p>
        </div>
      </div>
    </div>
  );
}
