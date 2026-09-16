"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const ITEMS = [
  "Full Stack Web Dev",
  "React & Next.js",
  "Django & Python",
  "MERN Stack",
  "UI/UX Focused",
];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    // Animate exactly half the track's width (the un-duplicated portion),
    // then snap back to 0 — since content is duplicated, the snap is invisible.
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y-2 bg-black py-4"
      style={{
        borderColor: "#458588",
      }}
    >
      <div ref={trackRef} className="flex w-max whitespace-nowrap">
        {[0, 1].map((setIndex) => (
          <div key={setIndex} className="flex items-center">
            {ITEMS.map((item, index) => (
              <span
                key={`${setIndex}-${index}`}
                className="flex items-center font-sans text-2xl font-semibold uppercase tracking-tight text-white sm:text-4xl"
              >
                {item}

                <span
                  className="mx-6 sm:mx-10"
                  style={{ color: "#458588" }}
                >
                  ●
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}