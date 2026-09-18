"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MEDIA } from "@/lib/animation/gsap";

const INTERVAL_MS = 800;

type HeroPortraitProps = {
  images: readonly string[];
};

/**
 * Isolated from Hero on purpose: this ticks every 800ms forever, and if the
 * state lived in Hero it would re-render the entire hero on every tick.
 *
 * Only images that have actually been reached are mounted, so a slow
 * connection downloads one portrait for first paint and picks up the rest as
 * the rotation gets to them.
 */
export default function HeroPortrait({ images }: HeroPortraitProps) {
  const [{ index, seen }, setState] = useState({ index: 0, seen: 0 });

  useEffect(() => {
    if (images.length <= 1) return;
    if (window.matchMedia(MEDIA.reduced).matches) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;

      setState((prev) => {
        const next = (prev.index + 1) % images.length;
        return { index: next, seen: Math.max(prev.seen, next) };
      });
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative aspect-square w-[82vw] max-w-[360px] overflow-hidden border-2 border-ink sm:max-w-[420px] lg:max-w-[320px]">
      {images.map((src, i) =>
        i <= seen ? (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? "Portrait of Sanjay Nepali" : ""}
            aria-hidden={i === 0 ? undefined : true}
            fill
            sizes="(max-width: 1024px) 82vw, 320px"
            priority={i === 0}
            className={`object-cover transition-opacity duration-200 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null
      )}
    </div>
  );
}
