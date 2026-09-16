"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import gsap from "gsap";

type TransitionColor = "ink" | "accent" | "sand";

type RunTransitionOptions = {
  color?: TransitionColor;
  onCovered?: () => void;
};

type TransitionContextValue = {
  runTransition: (options?: RunTransitionOptions) => void;
};

const TransitionContext =
  createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(TransitionContext);

  if (!ctx) {
    throw new Error(
      "usePageTransition must be used within TransitionProvider"
    );
  }

  return ctx;
}

const TILE_COUNT = 5;

const COLORS: Record<TransitionColor, string> = {
  ink: "var(--color-ink)",
  accent: "var(--color-accent)",
  sand: "var(--color-sand)",
};

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const tilesRef = useRef<HTMLDivElement[]>([]);
  const introPlayed = useRef(false);
  const animating = useRef(false);

  const setTileRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      if (el) tilesRef.current[index] = el;
    },
    []
  );

  useEffect(() => {
    if (introPlayed.current) return;

    introPlayed.current = true;

    const tiles = tilesRef.current;

    gsap.set(tiles, {
      scaleX: 1,
      transformOrigin: "left",
      backgroundColor: COLORS.ink,
    });

    gsap.to(tiles, {
      scaleX: 0,
      ease: "power3.inOut",
      duration: 0.6,
      stagger: 0.12,
    });
  }, []);

  const runTransition = useCallback(
    (options?: RunTransitionOptions) => {
      if (animating.current) return;

      animating.current = true;

      const color = COLORS[options?.color ?? "accent"];
      const tiles = tilesRef.current;

      const tl = gsap.timeline({
        onComplete: () => {
          animating.current = false;
        },
      });

      tl.set(tiles, {
        scaleX: 0,
        transformOrigin: "left",
        backgroundColor: color,
      })
        .to(tiles, {
          scaleX: 1,
          duration: 0.55,
          ease: "power3.inOut",
          stagger: 0.1,
        })
        .call(() => {
          options?.onCovered?.();
        })
        .set(tiles, {
          transformOrigin: "right",
        })
        .to(tiles, {
          scaleX: 0,
          duration: 0.55,
          ease: "power3.inOut",
          stagger: 0.1,
        });
    },
    []
  );

  return (
    <TransitionContext.Provider value={{ runTransition }}>
      <div className="pointer-events-none fixed inset-0 z-[9999]">
        {Array.from({ length: TILE_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => setTileRef(el, i)}
            className="absolute left-0 w-full bg-ink"
            style={{
              top: `${i * 20}%`,
              height: "20%",
            }}
          />
        ))}
      </div>

      {children}
    </TransitionContext.Provider>
  );
}