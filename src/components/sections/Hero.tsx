"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { usePageTransition } from "@/components/layout/TransitionProvider";

const SCRAMBLE_WORDS = ["Perform", "Convert", "Deliver", "Scale", "Engage"];
const BG_IMAGES = ["/images/coder.jpg", "/images/git.jpg", "/images/me.jpg"];

class TextScramble {
  private el: HTMLElement;
  private chars: string;
  private frame: number;
  private frameRequest: number;
  private queue: { from: string; to: string; start: number; end: number; char?: string }[];
  private resolvePromise: (() => void) | null;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#____";
    this.frame = 0;
    this.frameRequest = 0;
    this.queue = [];
    this.resolvePromise = null;
    this.update = this.update.bind(this);
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => {
      this.resolvePromise = resolve;
    });
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 10);
      const end = start + Math.floor(Math.random() * 10);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  private update() {
    let output = "";
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i];
      const { from, to, start, end } = item;
      let char = item.char;
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          item.char = char;
        }
        output += `<span class="opacity-40">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolvePromise?.();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  private randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

/** Wraps each character of an element's text in its own span so it can be animated individually. */
function splitChars(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent || "";
  el.innerHTML = "";
  const spans: HTMLSpanElement[] = [];
  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    el.appendChild(span);
    spans.push(span);
  });
  return spans;
}

export default function Hero() {
  const bounceLineRefs = useRef<HTMLSpanElement[]>([]);
  const perfLineRef = useRef<HTMLSpanElement | null>(null);
  const scrambleElRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const { runTransition } = usePageTransition();

  const [bgImageIndex, setBgImageIndex] = useState(0);

  const setBounceLineRef = (el: HTMLSpanElement | null, index: number) => {
    if (el) bounceLineRefs.current[index] = el;
  };

  useEffect(() => {
    // Bouncy per-character entrance for the first two lines
    const chars = bounceLineRefs.current.flatMap((line) =>
      line ? splitChars(line) : []
    );

    gsap.set(chars, { opacity: 0, y: 80 });
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "back.out(1.7)",
      stagger: 0.03,
      delay: 0.2,
    });

    // Simple fade/rise entrance for the "Perform" line (kept as one unit)
    if (perfLineRef.current) {
      gsap.set(perfLineRef.current, { opacity: 0, y: 80 });
      gsap.to(perfLineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
        delay: 0.35,
      });
    }

    // CTA fades in alongside the "Perform" line
    if (ctaRef.current) {
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      gsap.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.45,
      });
    }
  }, []);

  useEffect(() => {
    if (!scrambleElRef.current) return;

    const fx = new TextScramble(scrambleElRef.current);
    let index = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const cycle = () => {
      index = (index + 1) % SCRAMBLE_WORDS.length;
      fx.setText(SCRAMBLE_WORDS[index]);
    };

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(cycle, 1200);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  // Constantly cycle the background image — instant hard swap, no transition/fade
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 800);

    return () => clearInterval(intervalId);
  }, []);

  const handleContactClick = () => {
    runTransition({
      color: "accent",
      onCovered: () => {
        document.querySelector("#contact")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
    });
  };

  return (
    <div className="relative flex h-[calc(100vh-88px)] flex-col justify-between overflow-hidden px-6 py-4 md:px-12 md:py-6">
      {/* Background image — anchored to the meta bar's right edge, cycles through images with a hard cut */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-6 top-24 h-36 w-36 border-2 border-ink sm:top-28 sm:h-52 sm:w-52 md:right-12 md:top-32 md:h-64 md:w-64">
          <Image
            key={BG_IMAGES[bgImageIndex]}
            src={BG_IMAGES[bgImageIndex]}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 45vw, 22vw"
            priority={false}
          />
        </div>
      </div>

      {/* Meta bar */}
      <div className="relative z-10 flex flex-col gap-2 border-b border-ink/20 pb-4 font-mono text-xs uppercase tracking-wide text-ink/70 sm:flex-row sm:items-center sm:justify-between">
        {/* TODO: edit to taste */}
        <span>Sanjay Nepali — Web Developer</span>
        <span>Available for work</span>
      </div>

      {/* Index + subtitle row */}
      <div className="relative z-10 flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
        <span className="font-mono text-xs uppercase tracking-wide text-ink/50">
          [ 001 ]
        </span>

        {/* TODO: edit to taste */}
        <p className="max-w-md font-mono text-sm uppercase leading-relaxed tracking-wide text-ink/70 sm:text-right">
          I design and build fast, detail-oriented websites for people who
          care how their work feels to use.
        </p>
      </div>

      {/* Giant headline */}
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-1 font-sans font-semibold uppercase leading-[0.9] tracking-tight">
        {/* TODO: edit copy per line */}
        <div className="overflow-hidden">
          <span
            ref={(el) => setBounceLineRef(el, 0)}
            className="block text-[13vw] text-ink sm:text-[9vw]"
          >
            I Build Digital
          </span>
        </div>

        <div className="overflow-hidden">
          <span
            ref={(el) => setBounceLineRef(el, 1)}
            className="block text-[13vw] text-ink sm:text-[9vw]"
          >
            Products That
          </span>
        </div>

        <div className="overflow-hidden">
          <span
            ref={perfLineRef}
            className="block bg-[#cc241d] px-2 text-[13vw] text-sand sm:text-[9vw]"
          >
            <b>
              <em ref={scrambleElRef}>Perform</em>
            </b>
          </span>
        </div>
      </div>

      {/* CTA — pulled up slightly (pt-8 → pt-2) so it stays on-screen */}
      <div className="relative z-10 flex justify-end pt-2">
        <button
          ref={ctaRef}
          type="button"
          onClick={handleContactClick}
          className="flex items-center gap-3 border-2 px-3 py-3 font-mono text-sm uppercase tracking-wide transition-all duration-150 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          style={{
            backgroundColor: "#d79921",
            borderColor: "#1d2021",
            color: "#1d2021",
            boxShadow: "4px 4px 0 0 #cc241d",
          }}
        >
          Let&apos;s talk
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}