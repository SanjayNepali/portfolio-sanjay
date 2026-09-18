import Image from "next/image";
import {
  iconSocialLinks,
  navLinks,
  resumeLink,
  type SocialLink,
} from "@/lib/data/navigation";
import { siteConfig } from "@/lib/data/site";

/*
 * Server Component. It was previously "use client" solely for a
 * scrub-driven overlap tween. Dropping it removes a ScrollTrigger, a
 * timeline and gsap from this route's client bundle, and `new Date()` is
 * now evaluated on the server only, so it can no longer produce a hydration
 * mismatch across midnight.
 */

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-xs uppercase tracking-wide text-ink/40">
        {title}
      </span>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="font-sans text-base text-ink transition-colors hover:text-accent sm:text-lg"
    >
      {children}
    </a>
  );
}

function SocialIconButton({ social }: { social: SocialLink }) {
  return (
    <a
      href={social.href}
      target={social.external ? "_blank" : undefined}
      rel={social.external ? "noopener noreferrer" : undefined}
      aria-label={social.label}
      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink transition-all duration-150 hover:-translate-y-0.5 hover:border-accent"
    >
      <Image
        src={social.icon}
        alt=""
        aria-hidden="true"
        width={16}
        height={16}
      />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden rounded-t-[40px] bg-sand sm:rounded-t-[64px]">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 pb-10 pt-16 sm:gap-16 sm:px-12 sm:pt-20 lg:px-16">
        <div className="flex flex-col gap-6 border-b-2 border-ink/10 pb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:pb-12">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <h2 className="font-sans text-[14vw] font-semibold uppercase leading-[0.85] tracking-tight text-ink sm:text-[7vw] lg:text-[5.5vw]">
              Sanjay
              <br />
              Nepali
            </h2>

            <div className="flex items-start justify-center sm:items-center">
              <span className="flex h-24 w-24 -rotate-6 items-center justify-center rounded-full border-2 border-dashed border-accent px-2 text-center font-mono text-[10px] font-semibold uppercase leading-tight tracking-wide text-accent sm:h-28 sm:w-28 sm:text-xs">
                {siteConfig.availability}
              </span>
            </div>
          </div>

          <p className="max-w-sm font-sans text-sm leading-relaxed text-ink/60 sm:text-base">
            {siteConfig.shortBio}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          <FooterColumn title="Sections">
            {navLinks.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Details">
            <span className="font-sans text-base text-ink sm:text-lg">
              {siteConfig.location}
            </span>
            <span className="font-sans text-base text-ink sm:text-lg">
              {siteConfig.timezone}
            </span>
            <FooterLink href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </FooterLink>
          </FooterColumn>

          <FooterColumn title="Elsewhere">
            {iconSocialLinks.map((social) => (
              <FooterLink
                key={social.label}
                href={social.href}
                external={social.external}
              >
                {social.label}
              </FooterLink>
            ))}
            {resumeLink && (
              <FooterLink href={resumeLink.href} external={resumeLink.external}>
                {resumeLink.label}
              </FooterLink>
            )}
          </FooterColumn>

          <div className="col-span-2 flex items-end justify-start sm:col-span-1 sm:items-center">
            <Image
              src="/images/footer.svg"
              alt=""
              aria-hidden="true"
              width={180}
              height={190}
              className="h-auto w-[150px] sm:w-[180px]"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse items-center gap-6 border-t-2 border-ink/10 pt-8 sm:flex-row sm:justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink/40 sm:text-xs">
            © {new Date().getFullYear()} {siteConfig.name} · All rights reserved
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3">
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
            {iconSocialLinks.map((social) => (
              <SocialIconButton key={social.label} social={social} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
