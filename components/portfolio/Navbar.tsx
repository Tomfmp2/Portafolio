"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { getLevel, subscribe } from "@/lib/experience/store";
import LogoMark from "./Logo";

export default function Navbar() {
  const { lang, t, toggleLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [level, setLevel] = useState(0);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setLevel(getLevel());
    return subscribe("level", setLevel);
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

  // `levels` are the scroll chapters each link covers: the three project chapters share one link.
  const links = [
    { name: t.nav.build, href: "#habilidades", levels: [1] },
    { name: t.nav.projects, href: "#proyectos", levels: [2, 3, 4] },
    { name: t.nav.about, href: "#sobre-mi", levels: [5] },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 pt-3 ${open ? "bg-void/95 backdrop-blur-md md:bg-transparent md:backdrop-blur-none" : ""}`}>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-signal focus:px-3 focus:py-2 focus:text-void">
        {t.nav.skip}
      </a>
      <nav className="page-container" aria-label={t.nav.home}>
        <div className={`nav-shell ${scrolled || open ? "is-solid" : ""}`}>
          <a href="#inicio" className="nav-brand" aria-label={t.nav.home}>
            <LogoMark className="h-8 w-auto" />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-sm font-extrabold tracking-tight [font-variation-settings:'wdth'_112]">Tomás Medina</span>
              <span className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-dim">.NET dev · ready.</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link, i) => {
              const active = link.levels.includes(level);
              return (
                <li key={link.href}>
                  <a href={link.href} className="nav-link" aria-current={active ? "location" : undefined}>
                    <span className="nav-index" aria-hidden="true">0{i + 1}</span>
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <button type="button" onClick={toggleLang} className="lang-switch" aria-label={t.nav.switchLang}>
              <span className={lang === "es" ? "is-on" : ""}>ES</span>
              <span className={lang === "en" ? "is-on" : ""}>EN</span>
            </button>
            <a href="#contacto" className="btn-signal !min-h-9 !px-4 text-sm" aria-current={level === 6 ? "location" : undefined}>
              {t.nav.contact}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="-mr-1 grid h-10 w-10 place-items-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="menu-movil" className="page-container flex h-[calc(100svh-4.25rem)] flex-col justify-between pb-10 md:hidden">
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
