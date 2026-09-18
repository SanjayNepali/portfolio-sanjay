"use client";

import { useEffect, useRef } from "react";
import { MEDIA } from "@/lib/animation/gsap";
import { TextScramble } from "@/lib/utils/text-scramble";

type ScrambleWordProps = {
  words: readonly string[];
  intervalMs?: number;
};

/**
 * Cycles through words with a scramble effect. Server-renders the first word
 * as real text, so there is no empty box before hydration and no layout shift.
 */
export default function ScrambleWord({
  words,
  intervalMs = 1200,
}: ScrambleWordProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || words.length <= 1) return;
    if (window.matchMedia(MEDIA.reduced).matches) return;

    const fx = new TextScramble(el);
    let index = 0;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      index = (index + 1) % words.length;
      fx.setText(words[index]);
    }, intervalMs);

    return () => {
      window.clearInterval(id);
      fx.stop();
      el.textContent = words[0];
    };
  }, [words, intervalMs]);

  return <span ref={ref}>{words[0]}</span>;
}
