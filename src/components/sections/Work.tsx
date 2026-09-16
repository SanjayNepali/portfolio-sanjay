"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const setCardRef = (el: HTMLDivElement | null, index: number) => {
    if (el) cardRefs.current[index] = el;
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);

      gsap.set(cards, { top: "130%", xPercent: -50, yPercent: -50, left: "50%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${cards.length * 100 + 100}%`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(bgRef.current, { scale: 1.45, ease: "none", duration: cards.length }, 0);
      tl.to(introRef.current, { top: "-12%", autoAlpha: 0, duration: 0.6 }, 0);

      cards.forEach((card, i) => {
        const label = `card-${i}`;
        tl.addLabel(label, 0.6 + i * 0.9);

        tl.to(card, { top: "50%", duration: 0.9 }, label);

        // Only ever scales back — no brightness/opacity/filter change, so no "going dark" effect
        if (i > 0) {
          tl.to(cards[i - 1], { scale: 0.92, duration: 0.9 }, label);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative h-screen overflow-hidden bg-sand">
      <div className="absolute inset-6 aspect-[3/2] overflow-hidden border-2 border-ink md:inset-12">
        <div ref={bgRef} className="relative h-full w-full origin-center">
          <Image
            src="/images/build_ship_scale.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-ink/30" />
        </div>
      </div>

      <div
        ref={introRef}
        className="absolute left-0 right-0 top-[22%] z-10 flex flex-col items-center px-6 text-center"
      >
        <span className="font-mono text-xs uppercase tracking-wide text-sand/70">
          [ 002 ]
        </span>
        <h2 className="font-sans text-[12vw] font-semibold uppercase leading-[0.9] tracking-tight text-sand sm:text-[8vw]">
          Selected Work
        </h2>
        <p className="mt-2 font-mono text-xs uppercase tracking-wide text-sand/70">
          Scroll to enter
        </p>
      </div>

      {projects.map((project, index) => (
        <div
          key={project.name}
          ref={(el) => setCardRef(el, index)}
          className="absolute w-[94%] max-w-6xl border-2 border-ink bg-paper p-4 shadow-[8px_8px_0_0_#d79921] sm:p-6"
          style={{ zIndex: 20 + index }}
        >
          {/* Heading — bolder, larger, unmistakably a title now */}
          <div className="mb-4 flex flex-col gap-1 border-b-2 border-ink pb-3 sm:flex-row sm:items-end sm:justify-between">
            <span className="font-sans text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              {project.name}
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wide text-ink/60">
              {project.meta}
            </span>
          </div>

          {/* Screenshots — fixed height across all cards, regardless of column count */}
          <div
            className={`grid gap-3 ${
              project.images.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"
            }`}
          >
            {project.images.map((src, i) => (
              <div
                key={src}
                className={`relative h-48 overflow-hidden sm:h-64 ${
                  i > 0 ? "hidden sm:block" : ""
                }`}
              >
                <Image
                  src={src}
                  alt={`${project.name} screenshot`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 90vw, 30vw"
                  priority={false}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}