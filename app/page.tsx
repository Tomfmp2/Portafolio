import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import TechCarousel from "@/components/portfolio/TechCarousel";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import AmbientGlow from "@/components/portfolio/AmbientGlow";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: "#09090B" }}>

      {/* ── Cinematic ambient glow — 6-layer volumetric orbs ── */}
      <AmbientGlow />

      {/* ── Page content ─────────────────────────────────────── */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <TechCarousel />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
