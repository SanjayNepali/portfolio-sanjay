import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Work from "@/components/sections/Work";
import ProjectSpotlight from "@/components/sections/ProjectSpotlight";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main id="main">
        <section id="home" aria-label="Introduction">
          <Hero />
          <Marquee />
        </section>

        <section id="work" aria-label="Selected work">
          <Work />
          <ProjectSpotlight />
        </section>

        <section id="about" aria-label="About and process">
          <About />
        </section>

        <section id="contact" aria-label="Get in touch">
          <Contact />
        </section>
      </main>

      <Footer />
    </>
  );
}
