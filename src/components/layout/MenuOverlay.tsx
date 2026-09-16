"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePageTransition } from "./TransitionProvider";
import { navLinks, socialLinks } from "@/lib/navigation";

type MenuOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MenuOverlay({
  isOpen,
  onClose,
}: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<HTMLAnchorElement[]>([]);
  const socialRefs = useRef<HTMLAnchorElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const { runTransition } = usePageTransition();

  const setLinkRef = (
    el: HTMLAnchorElement | null,
    index: number
  ) => {
    if (el) {
      linkRefs.current[index] = el;
    }
  };

  const setSocialRef = (
    el: HTMLAnchorElement | null,
    index: number
  ) => {
    if (el) {
      socialRefs.current[index] = el;
    }
  };

  // Build the open/close timeline once on mount.
  useEffect(() => {
    const overlay = overlayRef.current;

    if (!overlay) return;

    gsap.set(overlay, {
      clipPath: "circle(0% at calc(100% - 56px) 56px)",
      pointerEvents: "none",
    });

    gsap.set(linkRefs.current, {
      yPercent: 120,
    });

    gsap.set(socialRefs.current, {
      autoAlpha: 0,
      y: 16,
    });

    const tl = gsap
      .timeline({ paused: true })
      .to(overlay, {
        clipPath:
          "circle(150% at calc(100% - 56px) 56px)",
        duration: 0.9,
        ease: "power4.inOut",
        pointerEvents: "auto",
      })
      .to(
        linkRefs.current,
        {
          yPercent: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
        },
        "-=0.45"
      )
      .to(
        socialRefs.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.06,
        },
        "-=0.3"
      );

    timelineRef.current = tl;

    return () => {
      tl.kill();
      timelineRef.current = null;
    };
  }, []);

  // Play forward when opened, reverse when closed.
  useEffect(() => {
    const tl = timelineRef.current;

    if (!tl) return;

    if (isOpen) {
      tl.play();
    } else if (tl.progress() > 0) {
      tl.reverse();
    }
  }, [isOpen]);

    const handleNavClick = (href: string) => {
        onClose();

        runTransition({
        color: "accent",
        onCovered: () => {
            document.querySelector(href)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
            });
        },
        });
    };

  return (
    <div
      ref={overlayRef}
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className="fixed inset-0 z-40 flex flex-col justify-between bg-sand px-6 py-24 md:px-16"
    >
      <nav
        aria-label="Primary"
        className="flex flex-1 flex-col justify-center gap-4"
      >
        {navLinks.map((link, index) => (
          <div
            key={link.href}
            className="overflow-hidden"
          >
            <a
              ref={(el) => setLinkRef(el, index)}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="block font-sans text-5xl font-semibold uppercase text-accent transition-opacity hover:opacity-70 sm:text-7xl md:text-8xl"
            >
              {link.label}
            </a>
          </div>
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-6 border-t border-ink/20 pt-8">
        {socialLinks.map((social, index) => (
          <a
            key={social.label}
            ref={(el) => setSocialRef(el, index)}
            href={social.href}
            target={social.external ? "_blank" : undefined}
            rel={
              social.external
                ? "noopener noreferrer"
                : undefined
            }
            aria-label={social.label}
            className="flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-accent transition-opacity hover:opacity-70"
          >
            <Image
              src={social.icon}
              alt=""
              width={20}
              height={20}
            />
            {social.label}
          </a>
        ))}
      </div>
    </div>
  );
}