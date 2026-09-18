"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MEDIA, type MatchMediaConditions } from "@/lib/animation/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/animation/use-isomorphic-layout-effect";
import SectionIntro from "@/components/ui/SectionIntro";
import ContactForm from "./contact/ContactForm";
import { socialLinks } from "@/lib/data/navigation";

/**
 * Right-hand info card — logo + pitch + social list, framed like the form
 * but with the site's usual coloured hard shadow so the two read as a pair.
 */
function ContactInfo() {
  return (
    <div className="card-frame card-frame--ocean w-full max-w-lg p-6 motion-safe:md:max-w-sm sm:p-8">
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

      <div className="mt-8">
        <h3 className="font-sans text-3xl font-semibold uppercase leading-[0.95] tracking-tight text-ink sm:text-4xl">
          Let&apos;s Work
          <br />
          Together
        </h3>
        <p className="mt-4 max-w-[20rem] font-sans text-sm leading-relaxed text-ink/60 sm:text-base">
          Got a project, a role, or just a good idea? I&apos;m always up for a
          conversation.
        </p>
      </div>

      <ul className="mt-8 flex flex-col gap-1">
        {socialLinks.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              target={social.external ? "_blank" : undefined}
              rel={social.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 py-2 font-mono text-sm uppercase tracking-wide text-accent transition-opacity hover:opacity-70"
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
        ))}
      </ul>
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: MEDIA.desktop, isMobile: MEDIA.mobile },
      (context) => {
        const { isDesktop } = context.conditions as MatchMediaConditions;

        /*
         * MOBILE: nothing is pinned and nothing starts hidden — the section
         * is simply the top of a normal, scrollable section.
         */
        if (!isDesktop) return;

        if (introRef.current) {
          gsap.set(introRef.current, { autoAlpha: 1, yPercent: 0 });
        }
        if (contentRef.current) {
          gsap.set(contentRef.current, { autoAlpha: 0, y: 24 });
        }

        if (sectionRef.current) {
          gsap.fromTo(
            sectionRef.current,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            }
          );
        }

        if (bgRef.current) {
          gsap.to(bgRef.current, {
            xPercent: 3,
            yPercent: -2,
            duration: 18,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            fastScrollEnd: true,
          },
        });

        if (introRef.current) {
          tl.to(
            introRef.current,
            { yPercent: -60, autoAlpha: 0, duration: 0.4, ease: "none" },
            0
          );
        }

        if (contentRef.current) {
          tl.to(contentRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.15);
        }
      },
      sectionRef
    );

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-svh overflow-hidden bg-ink motion-safe:md:h-screen motion-safe:md:min-h-0"
    >
      <img
        ref={bgRef}
        src="/animation/contact/contact_background.svg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full origin-center scale-110 object-cover"
      />

      <SectionIntro
        ref={introRef}
        index="005"
        title="Get In Touch"
        tone="light"
        className="relative z-30 pb-8 pt-20 motion-safe:md:absolute motion-safe:md:inset-x-0 motion-safe:md:top-[22%] motion-safe:md:py-0"
      />

      <div
        ref={contentRef}
        className="relative z-20 flex w-full flex-col items-center gap-10 px-5 pb-20 motion-safe:md:absolute motion-safe:md:inset-0 motion-safe:md:flex-row motion-safe:md:items-center motion-safe:md:justify-center motion-safe:md:gap-12 motion-safe:md:px-12 motion-safe:md:pb-0 motion-safe:md:opacity-0 lg:gap-16"
      >
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
  );
}
