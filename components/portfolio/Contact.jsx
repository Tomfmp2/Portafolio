"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/Tomfmp2", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>) },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/tomasmedinadev/", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 110-4.128 2.064 2.064 0 010 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>) },
  { name: "Telegram", href: "https://t.me/TomasMedinaDev", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>) },
  { name: "Email", href: "mailto:tom.pradamd@gmail.com", icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>) },
];

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const n = {};
    if (!formData.name.trim()) n.name = c.errors.nameRequired;
    if (!formData.email.trim()) n.email = c.errors.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) n.email = c.errors.emailInvalid;
    if (!formData.message.trim()) n.message = c.errors.messageRequired;
    else if (formData.message.trim().length < 10) n.message = c.errors.messageMin;
    setErrors(n);
    return Object.keys(n).length === 0;
  };
  const handleChange = (e) => { setFormData(p => ({...p, [e.target.name]: e.target.value})); if (errors[e.target.name]) setErrors(p => ({...p, [e.target.name]: ""})); };
  const handleSubmit = async (e) => {
    e.preventDefault(); if (!validateForm()) return; setIsSubmitting(true);
    try {
      const r = await fetch("https://formsubmit.co/ajax/tom.pradamd@gmail.com", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name: formData.name, email: formData.email, message: formData.message, _subject: "Nuevo mensaje desde Portafolio", _template: "table" }) });
      if (r.ok) { setSubmitSuccess(true); setFormData({ name: "", email: "", message: "" }); setTimeout(() => setSubmitSuccess(false), 5000); } else alert(c.errorMessage);
    } catch (err) { alert(c.errorConnection); } finally { setIsSubmitting(false); }
  };

  const inputCls = (field) => `w-full px-4 py-3 rounded-xl bg-white/[0.03] border ${errors[field] ? "border-red-500" : "border-white/[0.08]"} text-white text-sm placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#FF4B4B]/50 focus:border-[#FF4B4B] transition-all duration-300`;

  return (
    <section id="contacto" className="section bg-[#0B0B0F]">
      <div className="page-container">
        <div className="text-center mb-14">
          <div className="section-label mb-4">
            <span className="label-dot" />
            <span className="text-[11px] font-bold text-white/30 tracking-[0.3em] uppercase">{c.tag}</span>
          </div>
          <h2 className="font-bold text-white tracking-tight mb-4" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", lineHeight: 1.1 }}>{c.title}</h2>
          <p className="text-white/40 text-base max-w-xl mx-auto font-light leading-relaxed">{c.subtitle}</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          <div className="space-y-5">
            <div className="glass card-hover p-8">
              <h3 className="text-lg font-bold text-white mb-3">{c.connectTitle}</h3>
              <p className="text-white/40 text-sm font-light mb-6 leading-relaxed">{c.connectText}</p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FF4B4B]/10 flex items-center justify-center"><svg className="w-5 h-5 text-[#FF4B4B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                  <div><p className="text-xs text-white/35">{c.location}</p><p className="text-white/80 font-medium text-sm">{c.locationValue}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FF4B4B]/10 flex items-center justify-center"><svg className="w-5 h-5 text-[#FF4B4B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                  <div><p className="text-xs text-white/35">Email</p><a href="mailto:tom.pradamd@gmail.com" className="text-white/80 font-medium text-sm hover:text-[#FF4B4B] transition-colors">tom.pradamd@gmail.com</a></div>
                </div>
              </div>
              <p className="text-xs text-white/35 mb-3">{c.followMe}</p>
              <div className="flex gap-2">
                {socialLinks.map((l) => (<a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/35 hover:bg-[#FF4B4B]/15 hover:text-[#FF4B4B] transition-all duration-300" aria-label={l.name}>{l.icon}</a>))}
              </div>
            </div>
            <div className="glass p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute h-full w-full rounded-full bg-[#FF4B4B] opacity-75" /><span className="relative rounded-full h-2.5 w-2.5 bg-[#FF4B4B]" /></span>
                <div><p className="text-sm font-bold text-white">{c.availableTitle}</p><p className="text-xs text-white/40">{c.availableText}</p></div>
              </div>
              <a href="https://1drv.ms/b/c/a7e9bce9bc70cf88/IQAxwv0ZZ8y_RKQ2ASrz1DHxAV-GfVnS-_qo-Iwd_Z37hLQ?e=7QjXyh" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 font-bold rounded-xl text-white bg-[#FF4B4B] hover:bg-[#ff6060] text-sm transition-all">{c.downloadCV}</a>
            </div>
          </div>
          <div className="glass card-hover p-8">
            <h3 className="text-lg font-bold text-white mb-6">{c.formTitle}</h3>
            {submitSuccess && (<div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2"><svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><p className="text-emerald-400 text-sm">{c.successMessage}</p></div>)}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label htmlFor="name" className="block text-sm text-white/60 mb-1.5">{c.nameLabel}</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder={c.namePlaceholder} className={inputCls("name")} />{errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}</div>
              <div><label htmlFor="email" className="block text-sm text-white/60 mb-1.5">{c.emailLabel}</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder={c.emailPlaceholder} className={inputCls("email")} />{errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}</div>
              <div><label htmlFor="message" className="block text-sm text-white/60 mb-1.5">{c.messageLabel}</label><textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder={c.messagePlaceholder} rows={4} className={`${inputCls("message")} resize-none`} />{errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}</div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 font-bold rounded-xl text-white bg-[#FF4B4B] hover:bg-[#ff6060] transition-all disabled:opacity-50 text-sm">{isSubmitting ? c.sending : c.send}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
