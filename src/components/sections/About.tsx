"use client";

import { useRef } from "react";
import { gsap, MEDIA, type MatchMediaConditions } from "@/lib/animation/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/animation/use-isomorphic-layout-effect";
import SectionIntro from "@/components/ui/SectionIntro";
import { processSteps } from "@/lib/data/process";

const FACE_COLORS = [
  "var(--color-moss)",
  "var(--color-plum)",
  "var(--color-rust)",
  "var(--color-clay)",
  "var(--color-ocean)",
];

const FACE_IMAGE_CLASS = [
  "absolute inset-0 h-full w-full object-contain p-8",
  "absolute inset-0 h-full w-full object-contain p-8",
  "absolute inset-0 h-full w-full object-cover",
  "absolute inset-0 h-full w-full object-contain p-8",
  "absolute inset-0 h-full w-full object-contain p-8",
];

const BOX_SIZE = 260;
const HALF = BOX_SIZE / 2;

const FACE_TRANSFORMS = [
  `rotateY(0deg) translateZ(${HALF}px)`,
  `rotateY(-90deg) translateZ(${HALF}px)`,
  `rotateY(-180deg) translateZ(${HALF}px)`,
  `rotateY(-270deg) translateZ(${HALF}px)`,
  `rotateX(90deg) translateZ(${HALF}px)`,
];

const BOX_ROTATIONS = [
  { rotationY: 0, rotationX: 0 },
  { rotationY: 90, rotationX: 0 },
  { rotationY: 180, rotationX: 0 },
  { rotationY: 270, rotationX: 0 },
  { rotationY: 360, rotationX: -90 },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const contentGridRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const mobileStepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: MEDIA.desktop, isMobile: MEDIA.mobile },
      (context) => {
        const { isDesktop } = context.conditions as MatchMediaConditions;

        if (!isDesktop) {
          const steps = mobileStepRefs.current.filter((s): s is HTMLLIElement =>
            Boolean(s)
          );
          steps.forEach((step) => {
            gsap.from(step, {
              autoAlpha: 0,
              y: 28,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: { trigger: step, start: "top 88%", once: true },
            });
          });
          return;
        }

        const box = boxRef.current;
        const headings = headingRefs.current.filter((h): h is HTMLDivElement =>
          Boolean(h)
        );
        const bodies = bodyRefs.current.filter((b): b is HTMLParagraphElement =>
          Boolean(b)
        );

        if (!box || headings.length === 0 || bodies.length === 0) return;

        if (sectionRef.current) {
          gsap.fromTo(
            sectionRef.current,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            }
          );
        }

        gsap.set(box, {
          transformStyle: "preserve-3d",
          rotationX: 0,
          rotationY: 0,
        });
        gsap.set([...headings, ...bodies], { autoAlpha: 0, y: 24 });
        gsap.set([headings[0], bodies[0]], { autoAlpha: 1, y: 0 });

        if (contentGridRef.current) {
          gsap.set(contentGridRef.current, { autoAlpha: 0, y: 24 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${processSteps.length * 100}%`,
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

        if (contentGridRef.current) {
          tl.to(
            contentGridRef.current,
            { autoAlpha: 1, y: 0, duration: 0.4 },
            0.15
          );
        }

        tl.to({}, { duration: 0.5 });

        processSteps.forEach((_, i) => {
          if (i === 0) return;

          const label = `step-${i}`;

          tl.addLabel(label)
            .to(
              box,
              { ...BOX_ROTATIONS[i], duration: 0.7, ease: "power2.inOut" },
              label
            )
            .to(headings[i - 1], { autoAlpha: 0, y: -24, duration: 0.35 }, label)
            .to(bodies[i - 1], { autoAlpha: 0, y: -24, duration: 0.35 }, label)
            .to(
              headings[i],
              { autoAlpha: 1, y: 0, duration: 0.4 },
              `${label}+=0.3`
            )
            .to(bodies[i], { autoAlpha: 1, y: 0, duration: 0.4 }, `${label}+=0.3`)
            .to({}, { duration: 0.5 });
        });
      },
      sectionRef
    );

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden motion-safe:md:h-screen"
    >
      <div aria-hidden="true" className="absolute inset-0 z-0 flex">
        <div className="h-full w-1/2 border-r-4 border-ink bg-moss" />
        <div className="h-full w-1/2 bg-clay" />
      </div>

      <div className="relative z-10 motion-safe:md:hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-ink/30" />

        <div className="relative">
          <SectionIntro
            index="004"
            title="About Me"
            hint="Scroll to know me"
            tone="light"
            className="pb-8 pt-20"
          />

          <ol className="flex flex-col gap-14 px-6 pb-24">
            {processSteps.map((step, index) => {
              const setStepRef = (el: HTMLLIElement | null) => {
                mobileStepRefs.current[index] = el;
              };

              return (
                <li key={step.number} ref={setStepRef} className="flex flex-col gap-5">
                  <div>
                    <span className="font-mono text-4xl font-bold text-amber">
                      {step.number}
                    </span>
                    <h4 className="mt-2 font-mono text-sm uppercase tracking-wide text-paper/70">
                      {step.tagline}
                    </h4>
                    <h3 className="mt-1 font-sans text-4xl font-semibold uppercase leading-none tracking-tight text-paper">
                      {step.heading}
                    </h3>
                  </div>

                  <div
                    className="relative aspect-square w-full max-w-[280px] self-center overflow-hidden border-2 border-ink"
                    style={{ backgroundColor: FACE_COLORS[index] }}
                  >
                    <img
                      src={step.image}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className={FACE_IMAGE_CLASS[index]}
                    />
                  </div>

                  <p className="font-sans text-base leading-relaxed text-paper/90">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="hidden motion-safe:md:block">
        <SectionIntro
          ref={introRef}
          index="004"
          title="About Me"
          hint="Scroll to know me"
          tone="light"
          className="absolute inset-x-0 top-[22%] z-20"
        />

        <div
          ref={contentGridRef}
          className="absolute inset-0 z-10 grid grid-cols-[1fr_auto_1fr] items-center justify-items-center gap-10 px-12 lg:px-20"
        >
          <div className="relative min-h-[230px] w-full max-w-sm">
            {processSteps.map((step, index) => {
              const setHeadingRef = (el: HTMLDivElement | null) => {
                headingRefs.current[index] = el;
              };

              return (
                <div
                  key={step.heading}
                  ref={setHeadingRef}
                  className="absolute inset-0 flex flex-col items-start justify-center text-left"
                >
                  <span className="font-mono text-5xl font-bold text-amber">
                    {step.number}
                  </span>
                  <h4 className="mt-3 font-mono text-sm uppercase tracking-wide text-paper/70">
                    {step.tagline}
                  </h4>
                  <h3 className="mt-1 font-sans text-6xl font-semibold uppercase leading-none tracking-tight text-paper">
                    {step.heading}
                  </h3>
                </div>
              );
            })}
          </div>

          <div
            className="relative shrink-0"
            style={{
              width: BOX_SIZE,
              height: BOX_SIZE,
              perspective: 1200,
              WebkitPerspective: 1200,
            }}
          >
            <div
              ref={boxRef}
              className="relative h-full w-full"
              style={{
                transformStyle: "preserve-3d",
                WebkitTransformStyle: "preserve-3d",
              }}
            >
              {processSteps.map((step, index) => (
                <div
                  key={step.number}
                  className="absolute inset-0 overflow-hidden border-2 border-ink"
                  style={{
                    transform: FACE_TRANSFORMS[index],
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    backgroundColor: FACE_COLORS[index],
                  }}
                >
                  <img
                    src={step.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className={FACE_IMAGE_CLASS[index]}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[210px] w-full max-w-sm">
            {processSteps.map((step, index) => {
              const setBodyRef = (el: HTMLParagraphElement | null) => {
                bodyRefs.current[index] = el;
              };

              return (
                <p
                  key={step.heading}
                  ref={setBodyRef}
                  className="absolute inset-0 flex items-center justify-start text-left font-sans text-xl leading-relaxed text-paper/90"
                >
                  {step.description}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
