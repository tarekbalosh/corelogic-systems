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
  ArrowLeft,
} from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { NeonButton, buttonVariants } from "@/components/neon-button";
import { cn } from "@/lib/utils";
import { sendContactEmail } from "@/app/actions";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/i18n";

export function ContactView({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["contact"];
}) {
  const isArabic = locale === "ar";
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Mail,
      label: dict.emailUs,
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      color: "text-blue-500",
      isLtr: true,
    },
    {
      icon: Phone,
      label: dict.callUs,
      value: siteConfig.phone,
      href: `tel:${siteConfig.phone}`,
      color: "text-emerald-500",
      isLtr: true,
    },
    {
      icon: MapPin,
      label: dict.location,
      value: dict.locationValue,
      href: "https://www.google.com/maps/search/?api=1&query=Menara+IQ+Tun+Razak+Exchange+Kuala+Lumpur",
      color: "text-purple-500",
      isLtr: false,
    },
    {
      icon: Clock,
      label: dict.workingHours,
      value: dict.workingHoursValue,
      href: null,
      color: "text-primary",
      isLtr: false,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formDataObj = new FormData();
    formDataObj.append("fullName", formData.fullName);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("service", formData.service);
    formDataObj.append("message", formData.message);
    formDataObj.append("locale", locale);
    if (honeypot) {
      formDataObj.append("website_url", honeypot);
    }

    const result = await sendContactEmail(formDataObj);

    setLoading(false);
    if (result.success) {
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } else {
      setErrorMessage(`${dict.errorPrefix} ${result.error ?? ""}`.trim());
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Hero */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 shadow-sm border border-primary/20">
            <MessageSquare size={16} />
            <span>{dict.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 break-words hyphens-auto">
            {dict.heroTitle1}{" "}
            <span className="text-primary">{dict.heroTitle2}</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            {dict.heroSubtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 min-w-0"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 sm:p-8 md:p-10 bg-background/60 backdrop-blur-3xl border border-foreground/10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2 text-foreground">
                      {dict.formTitle}
                    </h2>
                    <p className="text-foreground/60 text-sm">
                      {dict.formSubtitle}
                    </p>
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
                    >
                      {errorMessage}
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 relative z-10"
                  >
                    <input
                      type="text"
                      name="website_url"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      style={{ display: "none" }}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label
                          htmlFor="contact-fullName"
                          className="text-sm font-medium text-foreground/80 block"
                        >
                          {dict.fullName}
                        </label>
                        <input
                          id="contact-fullName"
                          required
                          type="text"
                          placeholder={dict.fullNamePlaceholder}
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          className={cn(
                            "w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground placeholder:text-foreground/40 shadow-sm",
                            isArabic && "text-right"
                          )}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label
                          htmlFor="contact-email"
                          className="text-sm font-medium text-foreground/80 block"
                        >
                          {dict.email}
                        </label>
                        <input
                          id="contact-email"
                          required
                          type="email"
                          dir="ltr"
                          placeholder={dict.emailPlaceholder}
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground placeholder:text-foreground/40 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label
                          htmlFor="contact-phone"
                          className="text-sm font-medium text-foreground/80 block"
                        >
                          {dict.phone}{" "}
                          <span className="text-foreground/40 font-normal">
                            ({dict.optional})
                          </span>
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          dir="ltr"
                          placeholder={dict.phonePlaceholder}
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground placeholder:text-foreground/40 shadow-sm"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label
                          htmlFor="contact-service"
                          className="text-sm font-medium text-foreground/80 block"
                        >
                          {dict.service}
                        </label>
                        <select
                          id="contact-service"
                          required
                          value={formData.service}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              service: e.target.value,
                            })
                          }
                          className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground appearance-none shadow-sm cursor-pointer"
                        >
                          <option
                            value=""
                            className="bg-background text-foreground/50"
                          >
                            {dict.selectService}
                          </option>
                          {dict.servicesList.map((s) => (
                            <option
                              key={s}
                              value={s}
                              className="bg-background text-foreground"
                            >
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label
                        htmlFor="contact-message"
                        className="text-sm font-medium text-foreground/80 block"
                      >
                        {dict.message}{" "}
                        <span className="text-foreground/40 font-normal">
                          ({dict.optional})
                        </span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        placeholder={dict.messagePlaceholder}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className={cn(
                          "w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground resize-none placeholder:text-foreground/40 shadow-sm",
                          isArabic && "text-right"
                        )}
                      />
                    </div>

                    <NeonButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={loading}
                      className="w-full mt-4"
                    >
                      <span>{loading ? dict.processing : dict.sendMessage}</span>
                      {!loading && (
                        <Send
                          size={18}
                          className={cn(
                            "shrink-0 transition-transform duration-250",
                            isArabic
                              ? "rotate-180 group-hover:-translate-x-0.5"
                              : "group-hover:translate-x-0.5"
                          )}
                        />
                      )}
                    </NeonButton>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 md:p-12 bg-background/60 backdrop-blur-3xl border border-foreground/10 rounded-[2.5rem] shadow-lg flex flex-col items-center text-center space-y-6 min-h-[440px] justify-center"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight text-foreground">
                    {dict.successTitle}
                  </h3>
                  <p className="text-foreground/60 text-lg max-w-md mx-auto">
                    {dict.successMessage}
                  </p>
                  <NeonButton
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4"
                  >
                    <span>{dict.sendAnother}</span>
                    <ForwardArrow size={16} className="shrink-0" />
                  </NeonButton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info & Connect */}
          <div className="lg:col-span-2 space-y-8 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: isArabic ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid gap-4"
            >
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="p-5 bg-background/60 backdrop-blur-xl border border-foreground/10 rounded-2xl hover:border-primary/30 transition-all flex items-center gap-4 group shadow-sm hover:shadow-md"
                >
                  <div
                    className={cn(
                      "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-foreground/5 shrink-0 transition-colors group-hover:bg-primary/10",
                      info.color
                    )}
                  >
                    <info.icon
                      size={22}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-foreground/50 mb-1">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={
                          info.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          info.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors break-words block"
                      >
                        {info.isLtr ? (
                          <span dir="ltr" className="inline-block break-all">
                            {info.value}
                          </span>
                        ) : (
                          info.value
                        )}
                      </a>
                    ) : (
                      <p className="text-sm sm:text-base font-semibold text-foreground break-words">
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4 pt-2"
            >
              <h3 className="text-sm font-semibold text-foreground/60 px-2">
                {dict.instantConnect}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://wa.me/601169397149"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "md",
                    className: "w-full",
                  })}
                >
                  <MessageSquare
                    size={18}
                    className="shrink-0 text-emerald-600"
                  />
                  <span>{dict.whatsapp}</span>
                </a>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "md",
                    className: "w-full",
                  })}
                >
                  <Phone size={18} className="shrink-0 text-primary" />
                  <span>{dict.callDirect}</span>
                </a>
              </div>
            </motion.div>

            {/* Privacy-friendly 2-click Google Maps placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="aspect-video bg-foreground/5 border border-foreground/10 rounded-[2rem] relative overflow-hidden shadow-sm mt-6"
            >
              {mapLoaded ? (
                <iframe
                  title={dict.locationValue}
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.804961555546!2d101.7183646765792!3d3.1415514968340176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37004f1a5bb5%3A0x633e7922d56a2267!2sMenara%20IQ!5e0!3m2!1s${locale}!2smy!4v1713686915302!5m2!1s${locale}!2smy`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-3 bg-gradient-to-br from-slate-100 to-slate-50">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <p className="font-semibold text-sm text-foreground">
                    {dict.locationValue}
                  </p>
                  <p className="text-xs text-foreground/60 max-w-xs leading-relaxed">
                    {dict.mapConsentNotice}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setMapLoaded(true)}
                      className={buttonVariants({
                        variant: "primary",
                        size: "sm",
                      })}
                    >
                      <span>{dict.loadMapButton}</span>
                    </button>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Menara+IQ+Tun+Razak+Exchange+Kuala+Lumpur"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        variant: "secondary",
                        size: "sm",
                      })}
                    >
                      <span>{dict.openInMaps}</span>
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Why Partner With Us */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-28 md:mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 break-words hyphens-auto">
              {dict.whyPartner}
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              {dict.whyPartnerSubtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {dict.partnerReasons.map((reason, idx) => (
              <div
                key={idx}
                className="p-8 rounded-[2.5rem] border border-foreground/10 bg-background/50 hover:bg-background shadow-sm hover:shadow-xl hover:shadow-foreground/5 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 text-xl font-bold border border-primary/20">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground break-words hyphens-auto">
                  {reason.title}
                </h3>
                <p className="text-foreground/60 text-base leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-28 md:mt-32 p-8 sm:p-12 md:p-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[3rem] border border-primary/10 text-center relative overflow-hidden shadow-sm"
        >
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight break-words hyphens-auto">
              {dict.ctaTitle}
            </h2>
            <p className="text-foreground/70 text-lg md:text-xl">
              {dict.ctaSubtitle}
            </p>
            <div className="pt-4">
              <a
                href="https://wa.me/601169397149"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                <span>{dict.ctaButton}</span>
                <ForwardArrow size={18} className="shrink-0" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
