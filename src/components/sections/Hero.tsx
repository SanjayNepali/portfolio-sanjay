"use client";

import { useRef } from "react";
import { gsap, MEDIA } from "@/lib/animation/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/animation/use-isomorphic-layout-effect";
import { splitChars } from "@/lib/utils/split-text";
import { usePageTransition } from "@/components/layout/TransitionProvider";
import { StickerButton } from "@/components/ui/Sticker";
import HeroPortrait from "./hero/HeroPortrait";
import ScrambleWord from "./hero/ScrambleWord";
import { heroContent, siteConfig } from "@/lib/data/site";

/*
 * 9vw fits "Web developer" on one line on a narrow phone without wrapping
 * mid-word; desktop is unchanged at 7vw.
 */
const HEADLINE_CLASS =
  "block text-[9vw] leading-[0.9] sm:text-[8vw] lg:text-[7vw]";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const wordRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const { navigate } = usePageTransition();

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MEDIA.motion, () => {
      const chars = lineRefs.current
        .filter((el): el is HTMLSpanElement => Boolean(el))
        .flatMap((el) => splitChars(el));

      gsap.from(chars, {
        opacity: 0,
        yPercent: 110,
        duration: 0.7,
        ease: "back.out(1.7)",
        stagger: 0.03,
        delay: 0.15,
      });

      if (wordRef.current) {
        gsap.from(wordRef.current, {
          opacity: 0,
          yPercent: 110,
          duration: 0.7,
          ease: "back.out(1.7)",
          delay: 0.3,
        });
      }

      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.4,
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden px-5 py-4 sm:px-6 md:px-12 md:py-6"
    >
      <div className="flex flex-col gap-2 border-b border-ink/20 pb-4 font-mono text-xs uppercase tracking-wide text-ink/70 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {siteConfig.name} — {siteConfig.role}
        </span>
        <span>Available for work</span>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
          <span className="font-mono text-xs uppercase tracking-wide text-ink/50">
            [ {heroContent.index} ]
          </span>

          <p className="max-w-md font-mono text-sm uppercase leading-relaxed tracking-wide text-ink/70 sm:text-right">
            {heroContent.lede}
          </p>
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <h1 className="order-1 flex flex-col gap-1 font-sans font-semibold uppercase tracking-tight">
            {heroContent.headline.map((line, index) => {
              const setLineRef = (el: HTMLSpanElement | null) => {
                lineRefs.current[index] = el;
              };

              return (
                <span key={line} className="block overflow-hidden">
                  <span ref={setLineRef} className={`${HEADLINE_CLASS} text-ink`}>
                    {line}
                  </span>
                </span>
              );
            })}

            <span className="block overflow-hidden">
              <span
                ref={wordRef}
                className={`${HEADLINE_CLASS} w-full bg-clay px-2 text-sand`}
              >
                <b>
                  <em>
                    <ScrambleWord words={heroContent.rotatingWords} />
                  </em>
                </b>
              </span>
            </span>
          </h1>

          <div className="order-2 flex justify-center lg:justify-end">
            <HeroPortrait images={heroContent.portraits} />
          </div>
        </div>

        <div className="flex justify-end py-4">
          <StickerButton
            ref={ctaRef}
            tone="amber"
            onClick={() => navigate("#contact")}
          >
            Let&apos;s talk
            <span aria-hidden="true">↗</span>
          </StickerButton>
        </div>
      </div>
    </section>
  );
}
