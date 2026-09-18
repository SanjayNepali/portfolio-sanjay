"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * Client Components are still rendered on the server by Next.js, and
 * useLayoutEffect logs a warning there. This swaps in useEffect during SSR
 * and keeps the pre-paint timing (which the GSAP initial states depend on)
 * in the browser.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
