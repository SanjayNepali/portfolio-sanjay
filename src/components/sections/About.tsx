"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/lib/process";

gsap.registerPlugin(ScrollTrigger);

// One face per step. Each background is the complementary color (gruvbox
// wheel: red<->green/aqua, yellow<->purple, blue<->orange) of that step's
// own icon accent, so the animated icon pops against its card instead of
// blending into it. No two faces share a color.
const FACE_COLORS = [
  "#689d6a", // discover — icon accent is red, so bg is aqua (complement)
  "#b16286", // strategize — icon accent is red, so bg is purple (kept distinct from discover)
  "#d65d0e", // develop — neutral line-art icon, bg is orange for warmth
  "#cc241d", // refine — icon accent is orange, so bg is red (complement)
  "#458588", // ship — icon accent is teal/yellow, so bg is blue (complement)
];

// Box is a fixed pixel size (not responsive) because the 3D transform math
// below depends on it — translateZ has to equal exactly half the box size
// for the faces to meet at sharp, gap-free edges.
const BOX_SIZE = 260;
const HALF = BOX_SIZE / 2;

// Face 4 ("ship") is attached with a single-axis rotateX off the front
// face instead of a compound rotateY+rotateX chained off face 3's position.
// Compound rotations here previously fought with the box's own compound
// final rotation (rotationY/rotationX don't commute), which made the box's
// resting orientation land back on face 3 instead of face 4. Single-axis
// attachment removes that ambiguity entirely.
const FACE_TRANSFORMS = [
  `rotateY(0deg) translateZ(${HALF}px)`,
  `rotateY(-90deg) translateZ(${HALF}px)`,
  `rotateY(-180deg) translateZ(${HALF}px)`,
  `rotateY(-270deg) translateZ(${HALF}px)`,
  `rotateX(90deg) translateZ(${HALF}px)`,
];

// Per-face image treatment. Most icons are drawn with internal breathing
// room and read best with object-contain + padding so they sit inset on
// the color. develop.gif is drawn edge-to-edge already, so it needs no
// padding and object-cover to actually fill the box instead of floating
// small in the center.
const FACE_IMAGE_CLASS = [
  "absolute inset-0 h-full w-full object-contain p-10", // discover
  "absolute inset-0 h-full w-full object-contain p-10", // strategize
  "absolute inset-0 h-full w-full object-cover", // develop — fills the box
  "absolute inset-0 h-full w-full object-contain p-10", // refine
  "absolute inset-0 h-full w-full object-contain p-10", // ship
];

// Target rotation of the box itself at each step, driven by scroll progress
// instead of the original's manual onScroll math — GSAP's scrub timeline
// interpolates between these automatically.
//
// Step 4 uses rotationY: 360 (not 0) so the tween continues spinning
// forward through the same direction it's already moving, rather than
// GSAP interpolating "backward" from 270 down to 0 (which would visibly
// rewind through faces 3, 2, 1 again — GSAP tweens numerically, not by
// shortest angular path). 360 is visually identical to 0.
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
  const headingRefs = useRef<HTMLDivElement[]>([]);
  const bodyRefs = useRef<HTMLParagraphElement[]>([]);

  const setHeadingRef = (el: HTMLDivElement | null, index: number) => {
    if (el) headingRefs.current[index] = el;
  };

  const setBodyRef = (el: HTMLParagraphElement | null, index: number) => {
    if (el) bodyRefs.current[index] = el;
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const box = boxRef.current;
      const headings = headingRefs.current.filter(Boolean);
      const bodies = bodyRefs.current.filter(Boolean);

      if (!box || headings.length === 0 || bodies.length === 0) return;

      // Soften the cut from the previous (ProjectSpotlight) section: fade
      // the whole section in as it arrives, instead of it snapping into
      // view the instant it hits the top of the viewport. Runs on its own
      // ScrollTrigger, entirely before the pinned timeline's trigger point
      // ("top top"), so it never fights with the pin.
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

      gsap.set(box, { transformStyle: "preserve-3d", rotationX: 0, rotationY: 0 });
      gsap.set([...headings, ...bodies], { autoAlpha: 0, y: 24 });
      gsap.set([headings[0], bodies[0]], { autoAlpha: 1, y: 0 });

      // Only the intro heading is visible on arrival. The cube + step
      // content stay hidden until the intro starts leaving, so the page
      // reads as "heading first, then the cube and copy show up" rather
      // than everything appearing at once.
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
        tl.to(introRef.current, { top: "-12%", autoAlpha: 0, duration: 0.4 }, 0);
      }

      // The cube + content crossfade in partway through the intro's exit,
      // rather than waiting for it to fully disappear — reads as the
      // heading handing off to the content instead of a hard cut.
      if (contentGridRef.current) {
        tl.to(contentGridRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.15);
      }

      // Hold on step one for a beat before the box starts turning.
      tl.to({}, { duration: 0.5 });

      processSteps.forEach((_, i) => {
        if (i === 0) return;

        const label = `step-${i}`;

        tl.addLabel(label)
          .to(box, { ...BOX_ROTATIONS[i], duration: 0.7, ease: "power2.inOut" }, label)
          .to(headings[i - 1], { autoAlpha: 0, y: -24, duration: 0.35 }, label)
          .to(bodies[i - 1], { autoAlpha: 0, y: -24, duration: 0.35 }, label)
          .to(headings[i], { autoAlpha: 1, y: 0, duration: 0.4 }, `${label}+=0.3`)
          .to(bodies[i], { autoAlpha: 1, y: 0, duration: 0.4 }, `${label}+=0.3`)
          .to({}, { duration: 0.5 }); // hold so this step is readable before the next takes over
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Split background — vertical black line straight down the middle,
          green on the left half, red on the right. Sits under all content.
          (The animated SVG overlay that used to sit on top of this was
          removed — it was the main source of scroll jank on this section.) */}
      <div className="absolute inset-0 z-0 flex">
        <div className="h-full w-1/2 border-r-4 border-ink" style={{ backgroundColor: "#689d6a" }} />
        <div className="h-full w-1/2" style={{ backgroundColor: "#cc241d" }} />
      </div>

      {/* Intro — same treatment as the [002]/[003] section intros in Work/ProjectSpotlight */}
      <div
        ref={introRef}
        className="absolute left-0 right-0 top-[22%] z-20 flex flex-col items-center px-6 text-center"
      >
        <span className="font-mono text-xs uppercase tracking-wide text-paper/80">
          [ 004 ]
        </span>
        <h2 className="font-sans text-[14vw] font-semibold uppercase leading-[0.9] tracking-tight text-paper sm:text-[10vw]">
          About Me
        </h2>
        <p className="mt-2 font-mono text-xs uppercase tracking-wide text-paper/80">
          Scroll to know me
        </p>
      </div>

      {/* Heading (left) — box (center) — description (right) on desktop;
          stacks heading / box / description on mobile. Hidden on arrival
          (see gsap.set above) and revealed as the intro heading leaves. */}
      <div
        ref={contentGridRef}
        className="absolute inset-0 z-10 grid grid-cols-1 items-center justify-items-center gap-10 px-6 md:grid-cols-[1fr_auto_1fr] md:gap-10 md:px-12 lg:px-20"
      >
        {/* Left: number + tagline + heading */}
        <div className="relative w-full max-w-sm min-h-[200px] md:min-h-[230px]">
          {processSteps.map((step, index) => (
            <div
              key={step.heading}
              ref={(el) => setHeadingRef(el, index)}
              className="absolute inset-0 flex flex-col items-center justify-center text-center md:items-start md:text-left"
            >
              <span className="font-mono text-4xl font-bold text-[#d79921] sm:text-5xl">
                {step.number}
              </span>
              <h4 className="mt-3 font-mono text-sm uppercase tracking-wide text-paper/70">
                {step.tagline}
              </h4>
              <h3 className="mt-1 font-sans text-4xl font-semibold uppercase leading-none tracking-tight text-paper sm:text-6xl">
                {step.heading}
              </h3>
            </div>
          ))}
        </div>

        {/* Center: rotating sharp-edged box */}
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
            style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" }}
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
                {/* Plain <img>, not next/image — these are self-animating
                    SMIL SVGs (and one GIF for "develop", which has no SVG
                    source), and the image optimizer strips/rasterizes that
                    animation. Per-face class (FACE_IMAGE_CLASS) controls
                    contain-vs-cover and padding since develop.gif is drawn
                    edge-to-edge and needs to fully fill the box, while the
                    other icons have their own internal padding baked in.
                    No mix-blend-mode here on purpose — blend modes are known
                    to break backface-visibility on 3D-rotated elements in
                    Chromium, which shows the back of other faces instead of
                    hiding them. */}
                <img
                  src={step.image}
                  alt=""
                  className={FACE_IMAGE_CLASS[index]}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: description */}
        <div className="relative w-full max-w-sm min-h-[160px] md:min-h-[210px]">
          {processSteps.map((step, index) => (
            <p
              key={step.heading}
              ref={(el) => setBodyRef(el, index)}
              className="absolute inset-0 flex items-center justify-center text-center font-sans text-lg leading-relaxed text-paper/90 sm:text-xl md:justify-start md:text-left"
            >
              {step.description}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}