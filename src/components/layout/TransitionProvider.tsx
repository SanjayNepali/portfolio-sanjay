"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { gsap, prefersReducedMotion } from "@/lib/animation/gsap";
import { lockScroll } from "@/lib/animation/scroll-lock";
import { useIsomorphicLayoutEffect } from "@/lib/animation/use-isomorphic-layout-effect";

type TransitionColor = "ink" | "accent" | "sand";

type TransitionContextValue = {
  /** Cover the screen, jump to `href`, uncover. */
  navigate: (href: string, color?: TransitionColor) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(TransitionContext);

  if (!ctx) {
    throw new Error("usePageTransition must be used within TransitionProvider");
  }

  return ctx;
}

const TILE_COUNT = 5;
const COVER_DURATION = 0.45;
const TILE_STAGGER = 0.06;

const COLORS: Record<TransitionColor, string> = {
  ink: "var(--color-ink)",
  accent: "var(--color-accent)",
  sand: "var(--color-sand)",
};

/** Instant jump to a section. */
function jumpToSection(href: string) {
  const target = document.querySelector<HTMLElement>(href);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: "auto" });

  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

export default function TransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const animating = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const tiles = tilesRef.current.filter(Boolean);
    if (tiles.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(tiles, { scaleX: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(tiles, {
        scaleX: 1,
        transformOrigin: "left",
        backgroundColor: COLORS.ink,
      });

      gsap.to(tiles, {
        scaleX: 0,
        ease: "power3.inOut",
        duration: 0.6,
        stagger: 0.1,
      });
    });

    return () => ctx.revert();
  }, []);

  const navigate = useCallback(
    (href: string, color: TransitionColor = "accent") => {
      if (animating.current) return;

      if (prefersReducedMotion()) {
        jumpToSection(href);
        return;
      }

      const tiles = tilesRef.current.filter(Boolean);
      const overlay = overlayRef.current;
      if (tiles.length === 0 || !overlay) {
        jumpToSection(href);
        return;
      }

      animating.current = true;

      const releaseScroll = lockScroll();
      overlay.style.pointerEvents = "auto";

      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        releaseScroll();
        overlay.style.pointerEvents = "none";
      };

      gsap
        .timeline({
          onComplete: () => {
            animating.current = false;
            release();
          },
          onInterrupt: release,
        })
        .set(tiles, {
          scaleX: 0,
          transformOrigin: "left",
          backgroundColor: COLORS[color],
        })
        .to(tiles, {
          scaleX: 1,
          duration: COVER_DURATION,
          ease: "power3.inOut",
          stagger: TILE_STAGGER,
        })
        .call(() => {
          jumpToSection(href);
          release();
        })
        .set(tiles, { transformOrigin: "right" })
        .to(tiles, {
          scaleX: 0,
          duration: COVER_DURATION,
          ease: "power3.inOut",
          stagger: TILE_STAGGER,
        });
    },
    []
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999]"
      >
        {Array.from({ length: TILE_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              tilesRef.current[i] = el;
            }}
            className="absolute left-0 w-full bg-ink"
            style={{ top: `${i * 20}%`, height: "20.2%" }}
          />
        ))}
      </div>

      {children}
    </TransitionContext.Provider>
  );
}
