"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps each character of an element's text in its own inline-block span.
 * Only ever used on short, single-line headings (see Hero.tsx's splitChars) —
 * spaces become non-breaking so this must NOT be used on wrapping body text.
 */
function splitCharsNoWrap(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent || "";
  el.innerHTML = "";
  const spans: HTMLSpanElement[] = [];
  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    el.appendChild(span);
    spans.push(span);
  });
  return spans;
}

export default function ProjectSpotlight() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);

  const setPanelRef = (el: HTMLDivElement | null, index: number) => {
    if (el) panelRefs.current[index] = el;
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = panelRefs.current.filter(Boolean);
      if (panels.length === 0) return;

      const images = panels.map((panel) =>
        panel.querySelector<HTMLElement>("[data-role='image']")
      );

      const nameChars = panels.map((panel) => {
        const nameEl = panel.querySelector<HTMLElement>("[data-role='name']");
        return nameEl ? splitCharsNoWrap(nameEl) : [];
      });

      const infoItems = panels.map((panel) =>
        Array.from(panel.querySelectorAll<HTMLElement>("[data-role='info-item']"))
      );

      // Initial state: only the first panel visible, everything inside it hidden
      // and ready to animate in.
      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1 });
      images.forEach((img) => img && gsap.set(img, { xPercent: -8, autoAlpha: 0, rotate: -3 }));
      nameChars.forEach((chars) => gsap.set(chars, { yPercent: 110, rotationX: -90, opacity: 0 }));
      infoItems.forEach((items) => gsap.set(items, { y: 24, opacity: 0 }));

      // Slow independent drift for the background artwork. The SVG already
      // animates its own paths via SMIL — this just adds a subtle parallax
      // layer on top so it doesn't feel static.
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          xPercent: 4,
          yPercent: -3,
          duration: 16,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${panels.length * 100}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          // A fast flick of the wheel/trackpad snaps straight to the resting
          // state instead of forcing the scrub animation to play out in full
          // for every panel the viewer scrolls past.
          fastScrollEnd: true,
        },
      });

      if (introRef.current) {
        tl.to(introRef.current, { top: "-12%", autoAlpha: 0, duration: 0.4 }, 0);
      }

      panels.forEach((panel, i) => {
        const label = `panel-${i}`;
        const img = images[i];
        const chars = nameChars[i];
        const items = infoItems[i];

        tl.addLabel(label);

        if (i > 0) {
          tl.set(panels[i - 1], { autoAlpha: 0 }, label);
        }

        tl.set(panel, { autoAlpha: 1 }, label);

        if (img) {
          tl.to(img, { xPercent: 0, autoAlpha: 1, rotate: 0, duration: 0.5, ease: "power3.out" }, label);
        }

        tl.to(chars, { yPercent: 0, rotationX: 0, opacity: 1, duration: 0.45, stagger: 0.015, ease: "power2.out" }, "<0.05")
          .to(items, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" }, "<0.1")
          .to({}, { duration: 0.4 }); // hold so the panel is readable before the next takes over

        if (i < panels.length - 1) {
          if (img) {
            tl.to(img, { xPercent: 8, autoAlpha: 0, rotate: 3, duration: 0.4, ease: "power2.in" });
          }
          tl.to(chars, { yPercent: -110, rotationX: 90, opacity: 0, duration: 0.3, stagger: 0.01, ease: "power2.in" }, "<")
            .to(items, { y: -16, opacity: 0, duration: 0.3, stagger: 0.04, ease: "power2.in" }, "<");
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative h-screen overflow-hidden bg-sand">
      {/* Self-animating background artwork — transparent SVG, SMIL-driven.
          Scaled a bit past 100% height (origin-top) so it overshoots the
          bottom edge rather than falling slightly short of it. */}
      <img
        ref={bgRef}
        src="/animation/background_animation.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full origin-top scale-y-110 object-cover opacity-70"
      />

      <div
        ref={introRef}
        className="absolute left-0 right-0 top-[22%] z-20 flex flex-col items-center px-6 text-center"
      >
        <span className="font-mono text-xs uppercase tracking-wide text-ink/70">
          [ 003 ]
        </span>
        <h2 className="font-sans text-[12vw] font-semibold uppercase leading-[0.9] tracking-tight text-ink sm:text-[8vw]">
          In Detail
        </h2>
        <p className="mt-2 font-mono text-xs uppercase tracking-wide text-ink/70">
          Scroll to explore
        </p>
      </div>

      {projects.map((project, index) => (
        <div
          key={project.name}
          ref={(el) => setPanelRef(el, index)}
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-6 py-24 md:flex-row md:gap-16 md:px-16 ${
            index === 0 ? "opacity-100" : "invisible opacity-0"
          }`}
          style={{ perspective: "1000px" }}
        >
          {/* Image card */}
          <div
            data-role="image"
            className="w-full max-w-md shrink-0 border-2 border-ink bg-paper p-2 shadow-[8px_8px_0_0_#458588] md:w-[42%]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={project.images[0]}
                alt={`${project.name} screenshot`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 90vw, 40vw"
                priority={false}
              />
            </div>

            {project.images.length > 1 && (
              <div className="mt-2 flex gap-2">
                {project.images.slice(1).map((src) => (
                  <div key={src} className="relative aspect-[4/3] w-1/3 overflow-hidden border border-ink/10">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover object-top"
                      sizes="15vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="w-full max-w-lg text-ink md:w-[52%]">
            <span data-role="info-item" className="block font-mono text-xs uppercase tracking-wide text-ink/50">
              {project.meta}
            </span>

            <h3
              data-role="name"
              className="mt-2 overflow-hidden font-sans text-4xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-5xl"
            >
              {project.name}
            </h3>

            <p data-role="info-item" className="mt-4 font-sans text-base leading-relaxed text-ink/70 sm:text-lg">
              {project.description}
            </p>

            {project.tech.length > 0 && (
              <ul data-role="info-item" className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tag) => (
                  <li
                    key={tag}
                    className="border border-ink/25 px-3 py-1 font-mono text-xs uppercase tracking-wide text-ink/70"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <a
              data-role="info-item"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 border-2 px-3 py-3 font-mono text-sm uppercase tracking-wide transition-all duration-150 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              style={{
                backgroundColor: "#458588",
                borderColor: "#1d2021",
                color: "#1d2021",
                boxShadow: "4px 4px 0 0 #d79921",
              }}
            >
              View on GitHub
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}