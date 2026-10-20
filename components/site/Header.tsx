"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/hooks/use-language";
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
  // In the deck the hero's name is the logo, so the wordmark steps aside there; the language
  // switch and the menu stay available on every scene.
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
      <header className={`site-header ${home && !open ? "on-home" : ""} ${backed && !open ? "is-solid" : ""} ${night && !open ? "is-night" : ""}`}>
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
