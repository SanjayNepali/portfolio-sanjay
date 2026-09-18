"use client";

import { useEffect, type RefObject } from "react";

const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

type LockOptions = {
  /** Element whose own scrolling should still be allowed (e.g. the open menu). */
  allowWithin?: () => HTMLElement | null;
};

/**
 * Suppresses page scrolling by cancelling the input events rather than by
 * setting `overflow: hidden`, which would remove the scrollbar, change the
 * layout width, and make every pinned ScrollTrigger recompute.
 *
 * Returns its own cleanup function.
 */
export function lockScroll(options: LockOptions = {}): () => void {
  if (typeof window === "undefined") return () => {};

  const isAllowed = (target: EventTarget | null) => {
    const el = options.allowWithin?.() ?? null;
    return Boolean(el && target instanceof Node && el.contains(target));
  };

  const onScrollEvent = (event: Event) => {
    if (!isAllowed(event.target)) event.preventDefault();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
    ) {
      return;
    }
    if (SCROLL_KEYS.has(event.key) && !isAllowed(target)) {
      event.preventDefault();
    }
  };

  window.addEventListener("wheel", onScrollEvent, { passive: false });
  window.addEventListener("touchmove", onScrollEvent, { passive: false });
  window.addEventListener("keydown", onKeyDown);

  return () => {
    window.removeEventListener("wheel", onScrollEvent);
    window.removeEventListener("touchmove", onScrollEvent);
    window.removeEventListener("keydown", onKeyDown);
  };
}

/** Hook form, for components that hold the lock across renders. */
export function useScrollLock(
  active: boolean,
  allowWithin?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!active) return;
    return lockScroll({ allowWithin: () => allowWithin?.current ?? null });
  }, [active, allowWithin]);
}
