"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle,
  ArrowRight,
  Globe,
  Plus
} from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { SectionTitle } from "@/components/section-title";
import { cn } from "@/lib/utils";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "tarekba850@gmail.com",
    href: "mailto:tarekba850@gmail.com",
    color: "text-blue-400"
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+601169397149",
    href: "tel:+601169397149",
    color: "text-purple-400"
  },
  {
    icon: MapPin,
    label: "Our Location",
    value: "Lot C7, TRX, Kuala Lumpur",
    href: "https://goo.gl/maps/example",
    color: "text-cyan-400"
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Fri: 9:00 AM - 6:00 PM",
    href: null,
    color: "text-brand-orange"
  }
];

const services = [
  "Web Application Development",
  "AI Solutions & Automation",
  "Mobile App Development",
  "Custom Software Development",
  "UI/UX Design"
];

const reasons = [
  { title: "Fast Response Time", description: "Receive a response within 24 business hours from our technical team." },
  { title: "Professional Consultation", description: "Direct access to senior developers and AI architects for your queries." },
  { title: "Free Initial Discussion", description: "Start with a 15-minute discovery call to explore your project's potential." }
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Format message for WhatsApp
    const whatsappMessage = encodeURIComponent(
      `*New Inquiry from CoreLogic Systems*\n\n` +
      `👤 *Name:* ${formData.fullName}\n` +
      `📧 *Email:* ${formData.email}\n` +
      `📱 *Phone:* ${formData.phone || "Not provided"}\n` +
      `🛠️ *Service:* ${formData.service}\n\n` +
      `📝 *Message:* ${formData.message || "No message provided"}`
    );

    const whatsappUrl = `https://wa.me/601169397149?text=${whatsappMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");

    // Simulate completion
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      });
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-navy text-white selection:bg-brand-orange/30 overflow-hidden">
      {/* Immersive Particle Background */}
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* --- Hero Section --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <SectionTitle 
            title="Contact Us" 
            subtitle="Let’s discuss your project and bring your ideas to life" 
            align="center"
          />
          <p className="mt-6 text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Whether you have a specific project in mind or just want to explore the possibilities of AI and modern software, 
            our experts are ready to guide you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* --- Left Column: Contact Form --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-8 md:p-10 bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative group overflow-hidden"
                >
                  {/* Subtle Glow Accents */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-orange/10 blur-[80px] rounded-full pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-white/50">Full Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-orange/50 transition-colors text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-white/50">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-orange/50 transition-colors text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-white/50">Phone Number (Optional)</label>
                        <input 
                          type="tel" 
                          placeholder="+60..."
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-orange/50 transition-colors text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-white/50">Service</label>
                        <select 
                          required
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-orange/50 transition-colors text-white appearance-none"
                        >
                          <option value="" className="bg-navy">Select a service</option>
                          {services.map(s => <option key={s} value={s} className="bg-navy">{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-white/50">Message (Optional)</label>
                      <textarea 
                        rows={5}
                        placeholder="Tell us about your project goals..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-orange/50 transition-colors text-white resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "w-full py-4 bg-brand-orange text-navy font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all transform active:scale-[0.98]",
                        loading && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {loading ? "Processing..." : "Send Message"}
                      {!loading && <Send size={18} />}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic">Message Sent!</h3>
                  <p className="text-white/60 text-lg">
                    Thank you for reaching out. A specialist from CoreLogic Systems will contact you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-brand-orange font-bold uppercase tracking-widest text-sm hover:text-white transition-colors flex items-center gap-2"
                  >
                    Send Another Message <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* --- Right Column: Info & Connect --- */}
          <div className="space-y-12">
            {/* Contact Details Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid sm:grid-cols-2 gap-6"
            >
              {contactInfo.map((info, idx) => (
                <div 
                  key={info.label}
                  className="p-6 bg-white/5 border border-white/5 hover:border-white/20 transition-all flex flex-col gap-4 group"
                >
                  <div className={cn("w-10 h-10 flex items-center justify-center mb-2", info.color)}>
                    <info.icon size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-base font-bold text-white hover:text-brand-orange transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-base font-bold text-white">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Quick Contact Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              <h4 className="text-xl font-black uppercase tracking-tight italic">Instant Connect</h4>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://wa.me/601169397149" 
                  target="_blank" 
                  className="flex-1 min-w-[140px] px-6 py-4 bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366] hover:text-black transition-all flex items-center justify-center gap-3 font-bold uppercase text-[11px] tracking-widest"
                >
                  <MessageSquare size={16} /> WhatsApp
                </a>
                <a 
                  href="tel:+601169397149" 
                  className="flex-1 min-w-[140px] px-6 py-4 bg-brand-orange/10 border border-brand-orange/20 hover:bg-brand-orange hover:text-navy transition-all flex items-center justify-center gap-3 font-bold uppercase text-[11px] tracking-widest"
                >
                  <Phone size={16} /> Call Direct
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="aspect-video bg-white/5 border border-white/10 relative overflow-hidden group"
            >
              <div className="absolute inset-0 grayscale opacity-40 group-hover:opacity-80 transition-all duration-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.804961555546!2d101.7183646765792!3d3.1415514968340176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37004f1a5bb5%3A0x633e7922d56a2267!2sMenara%20IQ!5e0!3m2!1sen!2smy!4v1713686915302!5m2!1sen!2smy" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="absolute inset-0 hidden lg:flex items-center justify-center flex-col gap-3 p-8 text-center bg-navy/60 backdrop-blur-[2px] group-hover:opacity-0 transition-opacity duration-500 pointer-events-none">
                <MapPin className="text-brand-orange mb-2" size={32} />
                <p className="font-bold text-sm leading-relaxed max-w-[200px]">
                  Lot C7, Menara IQ, Tun Razak Exchange, Kuala Lumpur
                </p>
                <div className="text-[10px] font-black uppercase tracking-widest text-brand-orange">
                  Use two fingers to move the map
                </div>
              </div>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Menara+IQ+Tun+Razak+Exchange+Kuala+Lumpur" 
                target="_blank"
                className="absolute bottom-4 right-4 z-20 px-6 py-3 bg-brand-orange text-navy text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl flex items-center gap-2"
              >
                <span>View on Maps</span>
                <ArrowRight size={14} />
              </a>
            </motion.div>
          </div>
        </div>

        {/* --- Why Contact Us Section --- */}
        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-32 grid md:grid-cols-3 gap-8"
        >
          {reasons.map((reason, idx) => (
            <div key={reason.title} className="p-8 border border-white/5 bg-white/2 hover:bg-white/5 transition-colors group relative">
              <div className="absolute top-0 left-0 w-1 h-0 bg-brand-orange group-hover:h-full transition-all duration-500" />
              <div className="text-brand-orange font-black text-2xl mb-4 italic opacity-20">0{idx + 1}</div>
              <h5 className="text-xl font-bold mb-4 uppercase tracking-tight">{reason.title}</h5>
              <p className="text-white/50 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* --- Final CTA --- */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="mt-32 p-12 md:p-20 bg-gradient-to-br from-brand-orange to-brand-orange/80 text-navy text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
              Ready to start<br />your project?
            </h2>
            <p className="text-navy/70 max-w-xl mx-auto font-bold text-lg">
              Stop waiting for the right moment. Let's start the conversation today and build something extraordinary.
            </p>
            <button className="px-10 py-5 bg-navy text-white font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all transform hover:-translate-y-1 shadow-2xl">
              Get Free Consultation
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
