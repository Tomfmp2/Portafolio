"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => setIsOpen(false);

  const navLinks = [
    { name: t.nav.home, href: "#inicio" },
    { name: t.nav.about, href: "#sobre-mi" },
    { name: t.nav.skills, href: "#habilidades" },
    { name: t.nav.projects, href: "#proyectos" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#09090B]/90 backdrop-blur-md py-4" : "bg-transparent py-6"
      }`}
      aria-label="Navegación principal"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-1 group z-50" aria-label="Ir al inicio">
          <span className="text-2xl font-bold text-white tracking-tighter">
            t<span className="text-[#FF3333]">f</span>m
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative text-sm font-medium text-white/50 hover:text-white transition-colors duration-300 group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#FF3333] transition-all duration-300 group-hover:w-full rounded-full group-hover:[box-shadow:0_0_8px_2px_rgba(255,51,51,0.5)]" />
            </a>
          ))}
        </div>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-6 z-50">
          <button
            onClick={toggleLang}
            className="text-xs font-semibold text-white/50 hover:text-white transition-colors duration-300 uppercase tracking-widest"
            aria-label={lang === "es" ? "Switch to English" : "Cambiar a Español"}
          >
            {lang === "es" ? "EN" : "ES"}
          </button>

          <a
            href="#contacto"
            className="px-6 py-2 rounded-full border border-white/20 text-sm font-medium text-white hover:border-[#FF3333] hover:text-[#FF3333] transition-all duration-300"
          >
            {t.nav.contact}
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden z-50 p-2 text-white/80"
          aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#09090B] z-40 flex flex-col items-center justify-center transition-all duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={handleLinkClick} className="text-2xl font-bold text-white/70 hover:text-white transition-colors">
              {link.name}
            </a>
          ))}
          <button onClick={() => { toggleLang(); handleLinkClick(); }} className="text-sm font-bold text-[#FF3333] uppercase tracking-widest mt-4">
            {lang === "es" ? "Switch to English" : "Cambiar a Español"}
          </button>
        </div>
      </div>
    </nav>
  );
}
