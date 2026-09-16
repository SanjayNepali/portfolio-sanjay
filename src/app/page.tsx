import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Work from "@/components/sections/Work";
import ProjectSpotlight from "@/components/sections/ProjectSpotlight";
import About from "@/components/sections/About";

export default function Home() {
  return (
    <main>
      <Navbar />

      <section id="home">
        <Hero />
        <Marquee />
      </section>

      <section id="work">
        <Work />
        <ProjectSpotlight />
      </section>

      <section id="about" className="min-h-screen">
        <About />
      </section>

      <section id="contact" className="min-h-screen">
        Contact
      </section>
    </main>
  );
}