"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import { deckState, subscribeDeck } from "@/lib/deck";
import { gsap, initGSAP } from "@/lib/gsap";
import { checkReducedMotion } from "@/lib/performance";
import Wordmark from "./Wordmark";

export default function Header() {
  const { t, toggleLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [deckOn, setDeckOn] = useState(false);
  const scene = useSyncExternalStore(subscribeDeck, () => deckState.index, () => 0);
  const home = deckOn && scene === 0;
  // Over a dark scene (OCAP) the header turns light so it stays readable.
  const [night, setNight] = useState(false);
  useEffect(() => {
    setNight(deckOn && !!document.querySelectorAll(".scene")[scene]?.querySelector(".on-night"));
  }, [deckOn, scene]);
  // In the deck scenes scroll inside themselves, so away from the hero the header always has
  // a background; as a plain document it gets one once the page scrolls.
  const backed = deckOn ? !home : solid;
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // As a plain document (reduced motion) it gets a solid background once the page scrolls.
  useEffect(() => {
    const html = document.documentElement;
    const sync = () => setDeckOn(html.classList.contains("deck-on"));
    sync();
    const watch = new MutationObserver(sync);
    watch.observe(html, { attributes: true, attributeFilter: ["class"] });
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      watch.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    initGSAP();
    const reduced = checkReducedMotion();
    const links = el.querySelectorAll("[data-menu-item]");
    // While the menu is open the deck ignores wheel, swipes and arrow keys.
    document.documentElement.classList.toggle("menu-open", open);
    if (open) {
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
      <header className={`site-header ${backed && !open ? "is-solid" : ""} ${night && !open ? "is-night" : ""}`}>
        <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded focus:bg-marker focus:px-3 focus:py-2">
          {t.meta.skip}
        </a>
        <div className={`header-row wrap ${open ? "text-paper" : ""}`}>
          <div className="relative z-[70] flex items-center gap-4 md:gap-6">
            <a href="#inicio" aria-label={t.meta.home} className="text-[1.9rem] md:text-[2.3rem]">
              <Wordmark />
            </a>
            <button
              ref={toggle}
              type="button"
              onClick={() => (open ? close(true) : setOpen(true))}
              aria-expanded={open}
              aria-controls="menu"
              aria-label={open ? t.meta.closeMenu : t.meta.menu}
              className="header-icon"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
          <nav aria-label={t.meta.mainNav} className={`header-nav ${open ? "invisible" : ""}`}>
            <ul>
              {t.nav
                .filter((item) => t.meta.headerNav.includes(item.href))
                .map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        location.hash = item.href;
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
          <div className="relative z-[70] flex items-center justify-end gap-3 md:gap-5">
            <button type="button" onClick={toggleLang} className="header-lang" aria-label={t.meta.switchLang} lang={t.meta.switchLangShort.toLowerCase()}>
              {t.meta.switchLangShort}
            </button>
            <a href={links.cv} download className="header-icon" aria-label={t.hero.cv}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
              </svg>
            </a>
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
                    // Once the menu has released the deck, the hash change takes the visitor there
                    // (the deck listens for it; as a plain document the browser scrolls to it).
                    window.setTimeout(() => (location.hash = item.href), 60);
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
