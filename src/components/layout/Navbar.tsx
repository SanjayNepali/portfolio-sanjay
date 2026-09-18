"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/animation/use-isomorphic-layout-effect";
import { usePageTransition } from "./TransitionProvider";
import MenuOverlay from "./MenuOverlay";
import { StickerButton } from "@/components/ui/Sticker";
import { navLinks } from "@/lib/data/navigation";

const HIDE_THRESHOLD = 80;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { navigate } = usePageTransition();

  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const ctx = gsap.context(() => {
      const moveTo = gsap.quickTo(header, "yPercent", {
        duration: 0.45,
        ease: "power3.out",
      });

      let hidden = false;

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const scrolledPastThreshold = self.scroll() > HIDE_THRESHOLD;
          const scrollingDown = self.direction === 1;

          if (scrollingDown && scrolledPastThreshold && !hidden) {
            hidden = true;
            moveTo(-100);
          } else if ((!scrollingDown || !scrolledPastThreshold) && hidden) {
            hidden = false;
            moveTo(0);
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isMenuOpen && headerRef.current) {
      gsap.to(headerRef.current, { yPercent: 0, duration: 0.3 });
    }
  }, [isMenuOpen]);

  const handleNavClick = useCallback(
    (href: string) => {
      setIsMenuOpen(false);
      navigate(href, "accent");
    },
    [navigate]
  );

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-ink bg-paper"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            aria-label="Go to top"
            className="flex shrink-0 flex-row flex-nowrap items-center gap-2 rounded-sm"
          >
            <Image
              src="/images/logo.svg"
              alt="Sanjay Nepali"
              width={100}
              height={32}
              priority
              className="h-8 w-auto"
            />
            <Image
              src="/images/logo-icon.svg"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              priority
              className="h-8 w-auto"
            />
          </button>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-3 md:flex"
          >
            {navLinks.map((link) => (
              <StickerButton
                key={link.href}
                size="sm"
                tone="paper"
                onClick={() => handleNavClick(link.href)}
                className="group relative"
              >
                <Image
                  src={link.icon}
                  alt=""
                  aria-hidden="true"
                  width={18}
                  height={18}
                />
                {link.label}

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-1 left-4 right-4 h-[1.5px] origin-right scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"
                />
              </StickerButton>
            ))}
          </nav>

          <StickerButton
            ref={menuButtonRef}
            tone="paper"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="relative z-50 shrink-0 md:py-2"
          >
            <Image
              src={
                isMenuOpen ? "/images/close-icon.svg" : "/images/menu-icon.svg"
              }
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
            />
            {isMenuOpen ? "Close" : "Menu"}
          </StickerButton>
        </div>
      </header>

      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavClick}
        returnFocusRef={menuButtonRef}
      />
    </>
  );
}
