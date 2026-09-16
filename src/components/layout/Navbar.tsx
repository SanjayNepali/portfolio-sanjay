"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePageTransition } from "./TransitionProvider";
import MenuOverlay from "./MenuOverlay";
import { navLinks } from "@/lib/navigation";

const HIDE_THRESHOLD = 80;
const SMOOTHING = 0.08; // lower = smoother/slower to react, higher = snappier

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const underlineRefs = useRef<HTMLSpanElement[]>([]);
  const isHidden = useRef(false);

  const { runTransition } = usePageTransition();

  const setUnderlineRef = (el: HTMLSpanElement | null, index: number) => {
    if (el) underlineRefs.current[index] = el;
  };

  const handleHoverIn = (index: number) => {
    const underline = underlineRefs.current[index];
    if (!underline) return;

    gsap.set(underline, { transformOrigin: "left" });
    gsap.to(underline, {
      scaleX: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleHoverOut = (index: number) => {
    const underline = underlineRefs.current[index];
    if (!underline) return;

    gsap.set(underline, { transformOrigin: "right" });
    gsap.to(underline, {
      scaleX: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);

    runTransition({
      color: "accent",
      onCovered: () => {
        const section = document.querySelector(href);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      },
    });
  };

  // Hide navbar on scroll down, reveal on scroll up — smoothed via GSAP's ticker
  // so it responds to a lerped scroll value instead of raw per-pixel deltas.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let smoothedScrollY = window.scrollY;
    let lastSmoothedScrollY = smoothedScrollY;

    const tick = () => {
      const targetScrollY = window.scrollY;

      smoothedScrollY +=
        (targetScrollY - smoothedScrollY) * SMOOTHING;

      const delta = smoothedScrollY - lastSmoothedScrollY;
      const scrolledDown = delta > 0.05;
      const scrolledUp = delta < -0.05;
      const pastThreshold = smoothedScrollY > HIDE_THRESHOLD;

      if (scrolledDown && pastThreshold && !isHidden.current) {
        isHidden.current = true;
        gsap.to(header, {
          yPercent: -100,
          duration: 0.6,
          ease: "power3.inOut",
        });
      } else if ((scrolledUp || !pastThreshold) && isHidden.current) {
        isHidden.current = false;
        gsap.to(header, {
          yPercent: 0,
          duration: 0.6,
          ease: "power3.inOut",
        });
      }

      lastSmoothedScrollY = smoothedScrollY;
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-ink bg-paper"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            aria-label="Go to home"
            className="flex flex-row flex-nowrap items-center gap-2"
          >
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={100}
              height={32}
              priority
            />

            <Image
              src="/images/logo-icon.svg"
              alt=""
              width={32}
              height={32}
              priority
            />
          </button>

          {/* Desktop Navigation - sticker-style chips */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-4 md:flex"
          >
            {navLinks.map((link, index) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                onMouseEnter={() => handleHoverIn(index)}
                onMouseLeave={() => handleHoverOut(index)}
                className="relative flex items-center gap-2 border-2 border-ink bg-paper px-4 py-2 font-mono text-sm uppercase tracking-wide text-ink shadow-[3px_3px_0_0_var(--color-ink)] transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:text-accent hover:shadow-none"
              >
                <Image
                  src={link.icon}
                  alt=""
                  width={18}
                  height={18}
                />

                {link.label}

                <span
                  ref={(el) => setUnderlineRef(el, index)}
                  className="pointer-events-none absolute -bottom-1 left-4 right-4 h-[1.5px] origin-right scale-x-0 bg-accent"
                />
              </button>
            ))}
          </nav>

          {/* Menu Button - opens the full-screen overlay */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="relative z-50 flex items-center gap-2 border-2 border-ink bg-paper px-4 py-2 font-mono text-sm uppercase tracking-wide text-ink shadow-[3px_3px_0_0_var(--color-ink)] transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:text-accent hover:shadow-none"
          >
            <Image
              src={isMenuOpen ? "/images/close-icon.svg" : "/images/menu-icon.svg"}
              alt=""
              width={18}
              height={18}
            />

            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}