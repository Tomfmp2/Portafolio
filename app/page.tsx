"use client";

import { useLanguage } from "@/hooks/use-language";
import Preloader from "@/components/site/Preloader";
import Header from "@/components/site/Header";
import Cursor from "@/components/site/Cursor";
import Motion from "@/components/site/Motion";
import Hero from "@/components/site/Hero";
import Highlights from "@/components/site/Highlights";
import Verbs from "@/components/site/Verbs";
import Work from "@/components/site/Work";
import Layers from "@/components/site/Layers";
import About from "@/components/site/About";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export default function Home() {
  const { lang } = useLanguage();
  return (
    <>
      <Preloader />
      <Header />
      {/*
        Keyed by language: switching remounts the content, so text that GSAP
        split into lines and words is rebuilt from the new strings instead of
        React patching a DOM that SplitText rewrote.
      */}
      <div key={lang}>
        <main id="contenido">
          <Hero />
          <Highlights />
          <Verbs />
          <Work />
          <Layers />
          <About />
          <Contact />
        </main>
        <Footer />
        <Motion />
      </div>
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
