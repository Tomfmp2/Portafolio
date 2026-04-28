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
      {/* ── Ambient nebula glows — scattered across full page ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">

        {/* 1. Hero — top right, bright warm core */}
        <div style={{
          position: "absolute", top: "2%", right: "-80px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle at 55% 45%, rgba(255,80,30,0.6) 0%, rgba(255,50,20,0.3) 30%, rgba(200,35,10,0.1) 60%, transparent 80%)",
          filter: "blur(50px)",
        }} />

        {/* 2. Carousel — left side, elongated orange */}
        <div style={{
          position: "absolute", top: "18%", left: "-100px",
          width: "380px", height: "480px", borderRadius: "50%",
          background: "radial-gradient(ellipse at 45% 50%, rgba(255,90,20,0.5) 0%, rgba(220,55,10,0.25) 40%, transparent 75%)",
          filter: "blur(55px)",
        }} />

        {/* 3. About — center, wide soft red */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(255,51,51,0.2) 0%, rgba(200,30,15,0.08) 55%, transparent 80%)",
          filter: "blur(70px)",
        }} />

        {/* 4. Skills — right side */}
        <div style={{
          position: "absolute", top: "44%", right: "-60px",
          width: "420px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(ellipse at 60% 40%, rgba(255,70,25,0.5) 0%, rgba(230,50,15,0.22) 40%, transparent 75%)",
          filter: "blur(50px)",
        }} />

        {/* 5. Projects — left side */}
        <div style={{
          position: "absolute", top: "60%", left: "-80px",
          width: "400px", height: "450px", borderRadius: "50%",
          background: "radial-gradient(ellipse at 40% 55%, rgba(255,85,25,0.48) 0%, rgba(215,50,10,0.2) 45%, transparent 75%)",
          filter: "blur(52px)",
        }} />

        {/* 6. Contact — center, subtle wide */}
        <div style={{
          position: "absolute", top: "74%", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(255,60,30,0.18) 0%, rgba(200,35,10,0.07) 55%, transparent 80%)",
          filter: "blur(65px)",
        }} />

        {/* 7. Footer — right side, warm amber */}
        <div style={{
          position: "absolute", top: "88%", right: "-50px",
          width: "380px", height: "380px", borderRadius: "50%",
          background: "radial-gradient(circle at 60% 50%, rgba(255,100,30,0.45) 0%, rgba(220,65,15,0.2) 40%, transparent 70%)",
          filter: "blur(45px)",
        }} />

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
