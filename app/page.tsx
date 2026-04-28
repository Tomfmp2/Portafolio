import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import TechCarousel from "@/components/portfolio/TechCarousel";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#09090B] overflow-x-hidden">
      {/* ── Ambient nebula glows ─────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {/* Top-right — warm coral */}
        <div className="absolute -top-[200px] -right-[200px] w-[700px] h-[700px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #FF4B4B, transparent 70%)" }} />
        {/* Mid-left — deep orange */}
        <div className="absolute top-[40%] -left-[150px] w-[500px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, #FF6B35, transparent 70%)" }} />
        {/* Center — subtle red */}
        <div className="absolute top-[55%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #FF4B4B, transparent 65%)" }} />
        {/* Bottom-right — warm amber */}
        <div className="absolute bottom-[10%] -right-[100px] w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #FF6B35, transparent 70%)" }} />
      </div>

      {/* ── Page content ─────────────────────────────── */}
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
