"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MEDIA, type MatchMediaConditions } from "@/lib/animation/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/animation/use-isomorphic-layout-effect";
import { splitChars } from "@/lib/utils/split-text";
import SectionIntro from "@/components/ui/SectionIntro";
import { StickerLink } from "@/components/ui/Sticker";
import { projects } from "@/lib/data/projects";

export default function ProjectSpotlight() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: MEDIA.desktop, isMobile: MEDIA.mobile },
      (context) => {
        const { isDesktop } = context.conditions as MatchMediaConditions;
        const panels = panelRefs.current.filter((p): p is HTMLDivElement =>
          Boolean(p)
        );
        if (panels.length === 0) return;

        /* MOBILE: stacked panels, each with a one-shot reveal. */
        if (!isDesktop) {
          panels.forEach((panel) => {
            gsap.from(panel, {
              autoAlpha: 0,
              y: 32,
              duration: 0.55,
              ease: "power2.out",
              scrollTrigger: { trigger: panel, start: "top 85%", once: true },
            });
          });
          return;
        }

        /* DESKTOP: the original pinned crossfade. */
        const images = panels.map((panel) =>
          panel.querySelector<HTMLElement>("[data-role='image']")
        );

        const nameChars = panels.map((panel) => {
          const nameEl = panel.querySelector<HTMLElement>("[data-role='name']");
          return nameEl ? splitChars(nameEl) : [];
        });

        const infoItems = panels.map((panel) =>
          Array.from(
            panel.querySelectorAll<HTMLElement>("[data-role='info-item']")
          )
        );

        gsap.set(panels, { autoAlpha: 0 });
        gsap.set(panels[0], { autoAlpha: 1 });
        images.forEach(
          (img) =>
            img && gsap.set(img, { xPercent: -8, autoAlpha: 0, rotate: -3 })
        );
        nameChars.forEach((chars) =>
          gsap.set(chars, { yPercent: 110, rotationX: -90, opacity: 0 })
        );
        infoItems.forEach((items) => gsap.set(items, { y: 24, opacity: 0 }));

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
            fastScrollEnd: true,
          },
        });

        if (introRef.current) {
          tl.to(
            introRef.current,
            { yPercent: -60, autoAlpha: 0, duration: 0.4, ease: "none" },
            0
          );
        }

        panels.forEach((panel, i) => {
          const label = `panel-${i}`;
          const img = images[i];
          const chars = nameChars[i];
          const items = infoItems[i];

          tl.addLabel(label);

          if (i > 0) tl.set(panels[i - 1], { autoAlpha: 0 }, label);
          tl.set(panel, { autoAlpha: 1 }, label);

          if (img) {
            tl.to(
              img,
              {
                xPercent: 0,
                autoAlpha: 1,
                rotate: 0,
                duration: 0.5,
                ease: "power3.out",
              },
              label
            );
          }

          tl.to(
            chars,
            {
              yPercent: 0,
              rotationX: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.015,
              ease: "power2.out",
            },
            "<0.05"
          )
            .to(
              items,
              {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: "power2.out",
              },
              "<0.1"
            )
            .to({}, { duration: 0.4 });

          if (i < panels.length - 1) {
            if (img) {
              tl.to(img, {
                xPercent: 8,
                autoAlpha: 0,
                rotate: 3,
                duration: 0.4,
                ease: "power2.in",
              });
            }
            tl.to(
              chars,
              {
                yPercent: -110,
                rotationX: 90,
                opacity: 0,
                duration: 0.3,
                stagger: 0.01,
                ease: "power2.in",
              },
              "<"
            ).to(
              items,
              {
                y: -16,
                opacity: 0,
                duration: 0.3,
                stagger: 0.04,
                ease: "power2.in",
              },
              "<"
            );
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
      <img
        ref={bgRef}
        src="/animation/background_animation.svg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full origin-top scale-y-110 object-cover opacity-70"
      />

      <SectionIntro
        ref={introRef}
        index="003"
        title="In Detail"
        hint="Scroll to explore"
        tone="dark"
        className="relative z-20 pb-6 pt-16 motion-safe:md:absolute motion-safe:md:inset-x-0 motion-safe:md:top-[22%] motion-safe:md:py-0"
      />

      {projects.map((project, index) => {
        const setPanelRef = (el: HTMLDivElement | null) => {
          panelRefs.current[index] = el;
        };

        return (
          <div
            key={project.name}
            ref={setPanelRef}
            className={`relative z-10 flex flex-col items-center gap-6 px-5 pb-16 motion-safe:md:absolute motion-safe:md:inset-0 motion-safe:md:flex-row motion-safe:md:items-center motion-safe:md:justify-center motion-safe:md:gap-16 motion-safe:md:px-16 motion-safe:md:pb-0 ${
              index > 0 ? "motion-safe:md:invisible motion-safe:md:opacity-0" : ""
            }`}
            style={{ perspective: "1000px" }}
          >
            <div
              data-role="image"
              className="card-frame card-frame--ocean w-full max-w-md shrink-0 p-2 motion-safe:md:w-[42%]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.images[0]}
                  alt={`${project.name} screenshot`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />
              </div>

              {project.images.length > 1 && (
                <div className="mt-2 flex gap-2">
                  {project.images.slice(1).map((src) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] w-1/3 overflow-hidden border border-ink/10"
                    >
                      <Image
                        src={src}
                        alt=""
                        aria-hidden="true"
                        fill
                        className="object-cover object-top"
                        sizes="15vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full max-w-lg text-ink motion-safe:md:w-[52%]">
              <span
                data-role="info-item"
                className="block font-mono text-xs uppercase tracking-wide text-ink/50"
              >
                {project.meta}
              </span>

              <h3
                data-role="name"
                className="mt-2 overflow-hidden font-sans text-4xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-5xl"
              >
                {project.name}
              </h3>

              <p
                data-role="info-item"
                className="mt-4 font-sans text-base leading-relaxed text-ink/70 sm:text-lg"
              >
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

              <StickerLink
                data-role="info-item"
                tone="ocean"
                href={project.github}
                external
                className="mt-6"
              >
                View on GitHub
                <span aria-hidden="true">↗</span>
              </StickerLink>
            </div>
          </div>
        );
      })}
    </div>
  );
}
