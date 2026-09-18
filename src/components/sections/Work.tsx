"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MEDIA, type MatchMediaConditions } from "@/lib/animation/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/animation/use-isomorphic-layout-effect";
import SectionIntro from "@/components/ui/SectionIntro";
import { projects } from "@/lib/data/projects";

export default function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: MEDIA.desktop, isMobile: MEDIA.mobile },
      (context) => {
        const { isDesktop } = context.conditions as MatchMediaConditions;
        const cards = cardRefs.current.filter((c): c is HTMLElement =>
          Boolean(c)
        );
        if (cards.length === 0) return;

        /*
         * MOBILE: normal document flow, each card fades up once. This is
         * the fix for the empty gap between Selected Work and In Detail —
         * that gap was the unused lower half of a 100vh box whose only
         * content was absolutely centred.
         */
        if (!isDesktop) {
          cards.forEach((card) => {
            gsap.from(card, {
              autoAlpha: 0,
              y: 32,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                once: true,
              },
            });
          });
          return;
        }

        /* DESKTOP: the original pinned card stack. */
        gsap.set(cards, { xPercent: -50, yPercent: -50 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${cards.length * 100 + 100}%`,
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        });

        if (bgRef.current) {
          tl.to(
            bgRef.current,
            { scale: 1.45, ease: "none", duration: cards.length },
            0
          );
        }

        if (introRef.current) {
          tl.to(
            introRef.current,
            { yPercent: -60, autoAlpha: 0, duration: 0.6, ease: "none" },
            0
          );
        }

        cards.forEach((card, i) => {
          const label = `card-${i}`;
          tl.addLabel(label, 0.6 + i * 0.9);

          tl.fromTo(
            card,
            { y: () => window.innerHeight * 0.92 },
            { y: 0, duration: 0.9, ease: "power2.out" },
            label
          );

          if (i > 0) {
            tl.to(cards[i - 1], { scale: 0.92, duration: 0.9 }, label);
          }
        });
      },
      sectionRef
    );

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden bg-sand motion-safe:md:h-screen"
    >
      <div className="relative min-h-[52svh] overflow-hidden border-b-2 border-ink motion-safe:md:absolute motion-safe:md:inset-6 motion-safe:md:min-h-0 motion-safe:md:border-2 motion-safe:lg:inset-12">
        <div ref={bgRef} className="absolute inset-0 origin-center">
          <Image
            src="/images/build_ship_scale.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/40" />
        </div>

        <SectionIntro
          ref={introRef}
          index="002"
          title="Selected Work"
          hint="Scroll to enter"
          tone="light"
          className="absolute inset-x-0 top-[22%] z-10"
        />
      </div>

      <div className="relative z-20 flex flex-col gap-8 px-4 py-12 motion-safe:md:absolute motion-safe:md:inset-0 motion-safe:md:block motion-safe:md:p-0">
        {projects.map((project, index) => {
          const setCardRef = (el: HTMLElement | null) => {
            cardRefs.current[index] = el;
          };

          return (
            <article
              key={project.name}
              ref={setCardRef}
              className="card-frame card-frame--amber relative w-full p-3 sm:p-6 motion-safe:md:absolute motion-safe:md:left-1/2 motion-safe:md:top-1/2 motion-safe:md:w-[94%] motion-safe:md:max-w-6xl"
              style={{ zIndex: 20 + index }}
            >
              <div className="mb-4 flex flex-col gap-1 border-b-2 border-ink pb-3 sm:flex-row sm:items-end sm:justify-between">
                <h3 className="font-sans text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
                  {project.name}
                </h3>
                <span className="font-mono text-xs font-semibold uppercase tracking-wide text-ink/60">
                  {project.meta}
                </span>
              </div>

              <div
                className={`grid grid-cols-2 gap-2 sm:gap-3 ${
                  project.images.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"
                }`}
              >
                {project.images.map((src, i) => (
                  <div
                    key={src}
                    className={`relative h-36 overflow-hidden border border-ink/10 sm:h-56 ${
                      i === 0 && project.images.length > 2
                        ? "col-span-2 sm:col-span-1"
                        : ""
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${project.name} screenshot ${i + 1}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 50vw, 30vw"
                    />
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
