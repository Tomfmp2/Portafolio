import Experience from "@/components/experience/Experience";
import BootScreen from "@/components/experience/BootScreen";
import Hud from "@/components/experience/Hud";
import Console from "@/components/experience/Console";
import TextFx from "@/components/experience/TextFx";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import Build from "@/components/portfolio/Build";
import Projects from "@/components/portfolio/Projects";
import About from "@/components/portfolio/About";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

export default function Home() {
  return (
    <>
      {/* One fixed WebGL layer for the whole page; sections scroll over it. */}
      <Experience />
      <div className="page-ui relative z-10">
        <Navbar />
        <main id="contenido">
          <Hero />
          <Build />
          <Projects />
          <About />
          <Contact />
        </main>
        <Footer />
        <Hud />
        <Console />
      </div>
      <BootScreen />
      <TextFx />
    </>
  );
}
