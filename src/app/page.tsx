import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Work from "@/components/sections/Work";
import ProjectSpotlight from "@/components/sections/ProjectSpotlight";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  // Computed once, here, on the server — Footer is a Client Component
  // again (for the scroll reveal) but never calls `new Date()` itself,
  // so there's no risk of the year differing between a server render and
  // a client render across midnight.
  const year = new Date().getFullYear();
  
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

      <Footer year={year} />
    </>
  );
}