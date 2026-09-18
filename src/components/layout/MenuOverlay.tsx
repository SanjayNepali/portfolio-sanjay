"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "@/lib/animation/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/animation/use-isomorphic-layout-effect";
import { useScrollLock } from "@/lib/animation/scroll-lock";
import { navLinks, socialLinks } from "@/lib/data/navigation";

type MenuOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MenuOverlay({
  isOpen,
  onClose,
  onNavigate,
  returnFocusRef,
}: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const socialRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useScrollLock(isOpen, overlayRef);

  useIsomorphicLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const links = linkRefs.current.filter(Boolean);
    const socials = socialRefs.current.filter(Boolean);

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
        timelineRef.current = gsap
          .timeline({ paused: true })
          .to(overlay, { autoAlpha: 1, pointerEvents: "auto", duration: 0.01 });
        return;
      }

      gsap.set(overlay, {
        clipPath: "circle(0% at calc(100% - 56px) 56px)",
        pointerEvents: "none",
      });
      gsap.set(links, { yPercent: 120 });
      gsap.set(socials, { autoAlpha: 0, y: 16 });

      timelineRef.current = gsap
        .timeline({ paused: true })
        .to(overlay, {
          clipPath: "circle(150% at calc(100% - 56px) 56px)",
          duration: 0.8,
          ease: "power4.inOut",
          pointerEvents: "auto",
        })
        .to(
          links,
          { yPercent: 0, duration: 0.6, ease: "power3.out", stagger: 0.07 },
          "-=0.4"
        )
        .to(
          socials,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.05,
          },
          "-=0.3"
        );
    }, overlayRef);

    return () => {
      ctx.revert();
      timelineRef.current = null;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;

    if (isOpen) tl.play();
    else if (tl.progress() > 0) tl.reverse();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const firstLink = linkRefs.current.find(Boolean);
    firstLink?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        overlay.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      returnFocusRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose, returnFocusRef]);

  const handleNavClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      event.preventDefault();
      onNavigate(href);
    },
    [onNavigate]
  );

  return (
    <div
      ref={overlayRef}
      id="primary-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!isOpen}
      className="fixed inset-0 z-40 flex flex-col justify-center gap-10 overflow-y-auto overscroll-contain bg-sand px-6 py-24 md:flex-row md:items-stretch md:justify-between md:gap-16 md:px-16"
    >
      <nav
        aria-label="Sections"
        className="flex flex-1 flex-col justify-center gap-2 sm:gap-4"
      >
        {navLinks.map((link, index) => {
          const setLinkRef = (el: HTMLAnchorElement | null) => {
            linkRefs.current[index] = el;
          };

          return (
            <div key={link.href} className="overflow-hidden">
              <a
                ref={setLinkRef}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="block font-sans text-[clamp(2.5rem,13vw,7rem)] font-semibold uppercase leading-[1.05] text-accent transition-opacity hover:opacity-70"
              >
                {link.label}
              </a>
            </div>
          );
        })}
      </nav>

      <div className="flex flex-col gap-8 border-t border-ink/20 pt-8 md:w-64 md:flex-none md:justify-between md:gap-0 md:border-l md:border-t-0 md:pl-16 md:pt-0">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt="Sanjay Nepali"
            width={100}
            height={32}
            className="h-8 w-auto"
          />
          <Image
            src="/images/logo-icon.svg"
            alt=""
            aria-hidden="true"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
        </div>

        <div>
          <h2 className="font-sans text-3xl font-semibold uppercase leading-[0.95] tracking-tight text-ink sm:text-4xl">
            Let&apos;s Work
            <br />
            Together
          </h2>
          <p className="mt-4 max-w-[16rem] font-sans text-sm leading-relaxed text-ink/60">
            Got a project, a role, or just a good idea? I&apos;m always up for a
            conversation.
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-5 md:flex-col md:flex-nowrap md:items-start md:gap-3">
          {socialLinks.map((social, index) => {
            const setSocialRef = (el: HTMLAnchorElement | null) => {
              socialRefs.current[index] = el;
            };

            return (
              <li key={social.label}>
                <a
                  ref={setSocialRef}
                  href={social.href}
                  target={social.external ? "_blank" : undefined}
                  rel={social.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-2 py-1 font-mono text-sm uppercase tracking-wide text-accent transition-opacity hover:opacity-70"
                >
                  <Image
                    src={social.icon}
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={20}
                  />
                  {social.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
