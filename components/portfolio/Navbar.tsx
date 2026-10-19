"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/use-language";

export default function Navbar() {
  const { t, toggleLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { name: t.nav.build, href: "#habilidades" },
    { name: t.nav.projects, href: "#proyectos" },
    { name: t.nav.about, href: "#sobre-mi" },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled || open ? "bg-void/80 backdrop-blur-md" : ""}`}>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-signal focus:px-3 focus:py-2 focus:text-void">
        {t.nav.skip}
      </a>
      <nav className="page-container flex h-16 items-center justify-between" aria-label={t.nav.home}>
        <a href="#inicio" className="text-xl font-black tracking-tight [font-variation-settings:'wdth'_125]" aria-label={t.nav.home}>
          tfm
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="link-underline text-sm text-dim hover:text-paper">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          <button type="button" onClick={toggleLang} className="text-sm text-dim transition-colors hover:text-paper" aria-label={t.nav.switchLang}>
            {t.nav.switchLangShort}
          </button>
          <a href="#contacto" className="btn-quiet !min-h-10 text-sm">
            {t.nav.contact}
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="menu-movil" className="page-container flex h-[calc(100svh-4rem)] flex-col justify-between pb-10 md:hidden">
          <ul className="flex flex-col gap-6 pt-10">
            {[...links, { name: t.nav.contact, href: "#contacto" }].map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className="chapter-title block">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              toggleLang();
              setOpen(false);
            }}
            className="self-start text-dim hover:text-paper"
          >
            {t.nav.switchLang}
          </button>
        </div>
      )}
    </header>
  );
}
