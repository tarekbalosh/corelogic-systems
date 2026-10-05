import React from "react";
import { ParticleBackground } from "@/components/particle-background";

export default function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <ParticleBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-foreground/80 leading-relaxed text-lg">
          <p>
            At <strong>CoreLogic Systems</strong>, we are committed to protecting the privacy of our clients and website visitors. This policy outlines how we collect, use, and safeguard your personal information.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. Information We Collect</h2>
          <p>
            We may collect basic information when you visit our website or contact us, such as your name, email address, and phone number, in order to better provide our services and respond to your inquiries.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">2. How We Use Your Information</h2>
          <p>
            The information we collect is used to communicate with you regarding your projects, improve user experience on our site, and provide technical support or custom consultations. We do not sell or rent your information to any third parties.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">3. Data Security</h2>
          <p>
            We take all reasonable and appropriate security measures to protect your data from unauthorized access, alteration, or disclosure. Our servers and systems are protected by modern security technologies.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">4. Changes to This Policy</h2>
          <p>
            We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page, and we encourage you to review it periodically.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">5. Contact Us</h2>
          <p>
            If you have any questions or concerns about our Privacy Policy, please feel free to reach out to us via our Contact page or email.
          </p>
        </div>
      </div>
    </div>
  );
}
