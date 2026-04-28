"use client";

import { useLanguage } from "@/hooks/use-language";

const footerSocials = [
  { name: "GitHub", href: "https://github.com/Tomfmp2", icon: (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>) },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/tomasmedinadev/", icon: (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 110-4.128 2.064 2.064 0 010 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>) },
  { name: "Telegram", href: "https://t.me/TomasMedinaDev", icon: (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>) },
];

export default function Footer() {
  const { t } = useLanguage();
  const f = t.footer;
  const yr = new Date().getFullYear();

  return (
    <footer className="bg-[#09090B]">
      <div className="rule" />
      <div className="page-container py-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="space-y-4">
            <a href="#inicio" className="inline-flex items-center gap-1.5">
              <span className="text-xl font-bold text-white tracking-tighter">t<span className="text-[#FF4B4B]">f</span>m</span>
            </a>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">{f.description}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-4">{f.navigation}</h4>
            <nav className="flex flex-col gap-2">
              {f.links.map((l) => (<a key={l.name} href={l.href} className="text-sm text-white/30 hover:text-white transition-colors duration-300">{l.name}</a>))}
            </nav>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-4">{f.connect}</h4>
            <div className="flex gap-2">
              {footerSocials.map((l) => (<a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:bg-[#FF4B4B]/15 hover:text-[#FF4B4B] transition-all duration-300" aria-label={l.name}>{l.icon}</a>))}
            </div>
            <p className="text-xs text-white/20 mt-4">Bucaramanga, Colombia</p>
          </div>
        </div>
        <div className="border-t border-white/[0.05] mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/20">&copy; {yr} Tomas Felipe Medina Prada. {f.rights}</p>
          <p className="text-xs text-white/20">{f.madeWith} <span className="text-[#FF4B4B]">React</span> + <span className="text-[#FF4B4B]">Tailwind CSS</span></p>
        </div>
      </div>
      <a href="#inicio" className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-[#FF4B4B] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,75,75,0.4)] z-40" aria-label={f.backToTop}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
      </a>
    </footer>
  );
}
