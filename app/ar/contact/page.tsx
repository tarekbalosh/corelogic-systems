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
  ArrowLeft,
  Globe,
  Plus
} from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { cn } from "@/lib/utils";

const contactInfo = [
  { icon: Mail, label: "راسلنا", value: "contact@corelogic-system.my", href: "mailto:contact@corelogic-system.my", color: "text-blue-500", isLtr: true },
  { icon: Phone, label: "اتصل بنا", value: "+601169397149", href: "tel:+601169397149", color: "text-emerald-500", isLtr: true },
  { icon: MapPin, label: "موقعنا", value: "لوت C7، TRX، كوالالمبور", href: "https://goo.gl/maps/example", color: "text-purple-500" },
  { icon: Clock, label: "ساعات العمل", value: "الاثنين - الجمعة: 9:00 ص - 6:00 م", href: null, color: "text-primary" },
];

const services = [
  "تطوير تطبيقات الويب",
  "حلول الذكاء الاصطناعي والأتمتة",
  "تطوير تطبيقات الجوال",
  "تطوير البرمجيات المخصصة",
  "تصميم واجهة المستخدم"
];

const reasons = [
  { title: "وقت استجابة سريع", description: "احصل على رد خلال 24 ساعة عمل من فريقنا التقني." },
  { title: "استشارة احترافية", description: "وصول مباشر لكبار المطورين ومهندسي الذكاء الاصطناعي لاستفساراتك." },
  { title: "مناقشة أولية مجانية", description: "ابدأ بمكالمة اكتشاف لمدة 15 دقيقة لاستكشاف إمكانيات مشروعك." },
];

export default function ArabicContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const whatsappMessage = encodeURIComponent(
      `*استفسار جديد من كورلوجيك سيستمز*\n\n` +
      `👤 *الاسم:* ${formData.fullName}\n` +
      `📧 *البريد:* ${formData.email}\n` +
      `📱 *الهاتف:* ${formData.phone || "غير متوفر"}\n` +
      `🛠️ *الخدمة:* ${formData.service}\n\n` +
      `📝 *الرسالة:* ${formData.message || "لم يتم تقديم رسالة"}`
    );

    const whatsappUrl = `https://wa.me/601169397149?text=${whatsappMessage}`;
    window.open(whatsappUrl, "_blank");

    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      setFormData({ fullName: "", email: "", phone: "", service: "", message: "" });
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 shadow-sm border border-primary/20">
            <MessageSquare size={16} />
            <span>تواصل معنا</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            لنناقش مشروعك <span className="text-primary">الكبير القادم</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            سواء كان لديك مشروع محدد في ذهنك أو تريد فقط استكشاف إمكانيات الذكاء الاصطناعي والبرمجيات الحديثة، خبراؤنا مستعدون لإرشادك.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-8 md:p-10 bg-background/60 backdrop-blur-3xl border border-foreground/10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/3" />

                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold mb-2 text-foreground">أرسل لنا رسالة</h3>
                    <p className="text-foreground/60 text-sm">املأ النموذج أدناه وسنعود إليك قريباً.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-foreground/80">الاسم الكامل</label>
                        <input
                          required
                          type="text"
                          placeholder="محمد أحمد"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground placeholder:text-foreground/40 shadow-sm text-right"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-foreground/80">البريد الإلكتروني</label>
                        <input
                          required
                          type="email"
                          placeholder="mohammed@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground placeholder:text-foreground/40 shadow-sm"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-foreground/80">رقم الهاتف <span className="text-foreground/40 font-normal">(اختياري)</span></label>
                        <input
                          type="tel"
                          placeholder="+966..."
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground placeholder:text-foreground/40 shadow-sm"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-foreground/80">الخدمة المطلوبة</label>
                        <select
                          required
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground appearance-none shadow-sm cursor-pointer"
                        >
                          <option value="" className="bg-background text-foreground/50">اختر خدمة</option>
                          {services.map((s) => (
                            <option key={s} value={s} className="bg-background text-foreground">{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-sm font-medium text-foreground/80">الرسالة <span className="text-foreground/40 font-normal">(اختياري)</span></label>
                      <textarea
                        rows={4}
                        placeholder="أخبرنا قليلاً عن أهداف مشروعك..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground resize-none placeholder:text-foreground/40 shadow-sm text-right"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] mt-4",
                        loading && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {loading ? "جارٍ المعالجة..." : "إرسال الرسالة"}
                      {!loading && <Send size={18} className="mr-1 rotate-180" />}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 bg-background/60 backdrop-blur-3xl border border-foreground/10 rounded-[2.5rem] shadow-lg flex flex-col items-center text-center space-y-6 min-h-[500px] justify-center"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight text-foreground">تم إرسال الرسالة!</h3>
                  <p className="text-foreground/60 text-lg max-w-md mx-auto">
                    شكراً لتواصلك معنا. سيتواصل معك أحد متخصصي كورلوجيك سيستمز خلال 24 ساعة.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 px-8 py-3 bg-foreground/5 hover:bg-foreground/10 rounded-full text-foreground font-medium transition-colors flex items-center gap-2 border border-foreground/10"
                  >
                    إرسال رسالة أخرى <ArrowLeft size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info & Connect */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid gap-4"
            >
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="p-5 bg-background/60 backdrop-blur-xl border border-foreground/10 rounded-2xl hover:border-primary/30 transition-all flex items-center gap-5 group shadow-sm hover:shadow-md"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-foreground/5 shrink-0 transition-colors group-hover:bg-primary/10", info.color)}>
                    <info.icon size={22} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-[13px] font-medium text-foreground/50 mb-1">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                        {info.isLtr ? <span dir="ltr" className="inline-block">{info.value}</span> : info.value}
                      </a>
                    ) : (
                      <p className="text-base font-semibold text-foreground">
                        {info.isLtr ? <span dir="ltr" className="inline-block">{info.value}</span> : info.value}
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
              className="space-y-4 pt-4"
            >
              <h4 className="text-sm font-semibold text-foreground/60 px-2">تواصل فوري</h4>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://wa.me/601169397149"
                  target="_blank"
                  className="px-4 py-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all flex items-center justify-center gap-2 font-medium text-sm text-foreground shadow-sm"
                >
                  <MessageSquare size={18} /> واتساب
                </a>
                <a
                  href="tel:+601169397149"
                  className="px-4 py-4 bg-primary/10 border border-primary/20 rounded-2xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-2 font-medium text-sm text-foreground shadow-sm"
                >
                  <Phone size={18} /> اتصال مباشر
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="aspect-video bg-foreground/5 border border-foreground/10 rounded-[2rem] relative overflow-hidden group shadow-sm mt-8"
            >
              <div className="absolute inset-0 grayscale opacity-50 group-hover:opacity-90 group-hover:grayscale-0 transition-all duration-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.804961555546!2d101.7183646765792!3d3.1415514968340176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37004f1a5bb5%3A0x633e7922d56a2267!2sMenara%20IQ!5e0!3m2!1sar!2smy!4v1713686915302!5m2!1sar!2smy"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="absolute inset-0 hidden lg:flex items-center justify-center flex-col gap-2 p-6 text-center bg-background/50 backdrop-blur-[2px] group-hover:opacity-0 transition-opacity duration-500 pointer-events-none">
                <MapPin className="text-primary mb-1" size={28} />
                <p className="font-semibold text-sm max-w-[180px] text-foreground">
                  لوت C7، منارة IQ، تن رازاك اكسشينج
                </p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Menara+IQ+Tun+Razak+Exchange+Kuala+Lumpur"
                target="_blank"
                className="absolute bottom-4 left-4 z-20 px-5 py-2.5 bg-background/90 backdrop-blur-md text-foreground text-xs font-semibold rounded-full border border-foreground/10 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg flex items-center gap-2"
              >
                <ArrowLeft size={12} />
                <span>فتح في الخرائط</span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Why Contact Us */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">لماذا تشاركنا؟</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">نجعل عملية التعاون سلسة وشفافة تماماً.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reasons.map((reason, idx) => (
              <div key={reason.title} className="p-8 rounded-[2.5rem] border border-foreground/10 bg-background/50 hover:bg-background shadow-sm hover:shadow-xl hover:shadow-foreground/5 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 text-xl font-bold border border-primary/20">
                  0{idx + 1}
                </div>
                <h5 className="text-xl font-semibold mb-4 text-foreground">{reason.title}</h5>
                <p className="text-foreground/60 text-base leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-32 p-12 md:p-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[3rem] border border-primary/10 text-center relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              مستعد لبدء مشروعك؟
            </h2>
            <p className="text-foreground/70 text-lg md:text-xl">
              لا تنتظر اللحظة المناسبة. لنبدأ الحوار اليوم ونبني شيئاً استثنائياً معاً.
            </p>
            <div className="pt-4">
              <a href="https://wa.me/601169397149" target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-5 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1 transition-all text-lg">
                احصل على استشارة مجانية
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
