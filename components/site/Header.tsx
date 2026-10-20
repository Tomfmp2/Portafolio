"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP } from "@/lib/gsap";
import { getLenisInstance, scrollToTarget } from "@/lib/lenis";
import { checkReducedMotion } from "@/lib/performance";
import Wordmark from "./Wordmark";

export default function Header() {
  const { t, toggleLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // Slide away while reading down, come back as soon as the visitor scrolls up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      if (Math.abs(y - last) > 6) setHidden(y > last && y > 400);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    initGSAP();
    const reduced = checkReducedMotion();
    const lenis = getLenisInstance();
    const links = el.querySelectorAll("[data-menu-item]");
    if (open) {
      lenis?.stop();
      gsap.set(el, { visibility: "visible" });
      const tl = gsap.timeline();
      tl.to(el, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0 : 0.8, ease: "expo.inOut" });
      if (!reduced) tl.from(links, { yPercent: 100, opacity: 0, duration: 0.7, stagger: 0.06 }, "-=0.35");
      el.querySelector<HTMLElement>("a")?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("keydown", onKey);
        tl.kill();
      };
    }
    lenis?.start();
    gsap.to(el, {
      clipPath: "inset(0 0 100% 0)",
      duration: reduced ? 0 : 0.7,
      ease: "expo.inOut",
      onComplete: () => gsap.set(el, { visibility: "hidden" }),
    });
  }, [open]);

  const close = (focusToggle: boolean) => {
    setOpen(false);
    if (focusToggle) toggle.current?.focus();
  };

  return (
    <>
      <header className={`site-header ${hidden && !open ? "is-hidden" : ""} ${solid && !open ? "is-solid" : ""}`}>
        <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded focus:bg-marker focus:px-3 focus:py-2">
          {t.meta.skip}
        </a>
        <div className="wrap flex h-16 items-center justify-between md:h-20">
          <a href="#inicio" aria-label={t.meta.home} className={`relative z-[70] text-2xl transition-colors md:text-[1.7rem] ${open ? "text-paper" : ""}`}>
            <Wordmark />
          </a>
          <div className={`relative z-[70] flex items-center gap-2 md:gap-4 ${open ? "text-paper" : ""}`}>
            <button type="button" onClick={toggleLang} className="link px-1 font-medium" aria-label={t.meta.switchLang} lang={t.meta.switchLangShort.toLowerCase()}>
              {t.meta.switchLangShort}
            </button>
            <button
              ref={toggle}
              type="button"
              onClick={() => (open ? close(true) : setOpen(true))}
              aria-expanded={open}
              aria-controls="menu"
              className={`btn min-h-11 px-5 ${open ? "btn-line !text-paper" : "btn-ink"}`}
            >
              {open ? t.meta.closeMenu : t.meta.menu}
            </button>
          </div>
        </div>
      </header>

      <div ref={panel} id="menu" className="menu-panel invisible" role="dialog" aria-modal="true" aria-label={t.meta.menu}>
        <nav className="wrap flex h-full flex-col justify-center gap-2 pt-16">
          <ul className="flex flex-col gap-1">
            {t.nav.map((item) => (
              <li key={item.href} className="overflow-hidden">
                <a
                  href={item.href}
                  data-menu-item
                  className="menu-link"
                  onClick={(e) => {
                    e.preventDefault();
                    close(false);
                    // Wait for the panel to start closing so Lenis is running again.
                    window.setTimeout(() => scrollToTarget(item.href), 120);
                  }}
                >
                  <mark className="hl">{item.label}</mark>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
