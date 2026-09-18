"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  /*
   * Skips ScrollTrigger.refresh() calls caused purely by the mobile URL bar
   * showing/hiding (a vertical-only resize) — without this, pinned sections
   * visibly jump every time that happens.
   */
  ScrollTrigger.config({ ignoreMobileResize: true });

  gsap.ticker.lagSmoothing(500, 33);
}

/**
 * Shared media queries for gsap.matchMedia().
 *
 * `desktop` and `mobile` both require `no-preference`, so a reduced-motion
 * user matches neither and no scroll-driven animation is ever created for
 * them.
 */
export const MEDIA = {
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export type MatchMediaConditions = {
  isDesktop?: boolean;
  isMobile?: boolean;
};

/** True when the user has asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MEDIA.reduced).matches;
}

export { gsap, ScrollTrigger };
