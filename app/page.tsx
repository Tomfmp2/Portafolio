"use client";

import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import type { StageChange } from "@/lib/deck";
import Preloader from "@/components/site/Preloader";
import Header from "@/components/site/Header";
import Cursor from "@/components/site/Cursor";
import Magnetic from "@/components/site/Magnetic";
import Deck from "@/components/site/Deck";
import Hero from "@/components/site/Hero";
import Highlights from "@/components/site/Highlights";
import Verbs from "@/components/site/Verbs";
import ProjectsTitle from "@/components/site/ProjectsTitle";
import CaseStudy from "@/components/site/CaseStudy";
import MoreProjects from "@/components/site/MoreProjects";
import Layers from "@/components/site/Layers";
import About from "@/components/site/About";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

/** The journey, in order. `stage` is how the screen changes on the way into each scene. */
const SCENES: { id: string; stage: StageChange }[] = [
  { id: "inicio", stage: "push" },
  { id: "lo-importante", stage: "sweep" },
  { id: "verbos", stage: "push" },
  { id: "proyectos", stage: "sweep" },
  { id: "feria", stage: "push" },
  { id: "ocap", stage: "iris" },
  { id: "otros-proyectos", stage: "push" },
  { id: "como-trabajo", stage: "push" },
  { id: "sobre-mi", stage: "push" },
  { id: "contacto", stage: "sweep" },
];

export default function Home() {
  const { lang, t } = useLanguage();
  const nodes = [
    <Hero key="hero" />,
    <Highlights key="highlights" />,
    <Verbs key="verbs" />,
    <ProjectsTitle key="title" />,
    <CaseStudy key="feria" id="feria-case" project={t.work.feria} link={{ href: links.feria, label: t.work.live }} />,
    <CaseStudy key="ocap" id="ocap-case" project={t.work.ocap} link={{ href: links.ocap, label: t.work.code }} night />,
    <MoreProjects key="more" />,
    <Layers key="layers" />,
    <About key="about" />,
    <>
      <Contact />
      <Footer />
    </>,
  ];
  const scenes = SCENES.map((scene, i) => ({ ...scene, label: t.deck.labels[i], node: nodes[i] }));

  return (
    <>
      <Preloader />
      <Header />
      {/*
        Keyed by language: switching remounts the content, so text that GSAP
        split into letters, words and lines is rebuilt from the new strings
        instead of React patching a DOM that SplitText rewrote. The deck keeps
        its position outside React, so the visitor stays on the same scene.
      */}
      <main id="contenido" key={lang}>
        <Deck scenes={scenes} />
        <Magnetic />
      </main>
      <Cursor />
      <div id="sweep" className="sweep-band" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
