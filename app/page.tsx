"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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

// The 3D pen is decorative and heavy: client only, loaded after the page.
const Pen = dynamic(() => import("@/components/site/three/Pen"), { ssr: false });

export default function Home() {
  const { lang } = useLanguage();
  const [motion, setMotion] = useState(false);
  useEffect(() => setMotion(matchMedia("(prefers-reduced-motion: no-preference)").matches), []);
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
      {motion && <Pen />}
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
