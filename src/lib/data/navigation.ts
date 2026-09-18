import { siteConfig } from "./site";

export type NavLink = {
  label: string;
  href: string;
  icon: string;
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "#home", icon: "/images/home-icon.svg" },
  { label: "Work", href: "#work", icon: "/images/work-icon.svg" },
  { label: "About", href: "#about", icon: "/images/about-icon.svg" },
  { label: "Contact", href: "#contact", icon: "/images/contact-icon.svg" },
];

export type SocialLink = {
  label: string;
  href: string;
  icon: string;
  external?: boolean;
};

export const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sanjay-nepali-299750422/",
    icon: "/images/linkedin-icon.svg",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/SanjayNepali",
    icon: "/images/github-icon.svg",
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/sanjilogs/",
    icon: "/images/instagram-icon.svg",
    external: true,
  },
  {
    label: "Gmail",
    href: `mailto:${siteConfig.email}`,
    icon: "/images/gmail-icon.svg",
  },
  {
    label: "Resume",
    href: "/resume.pdf",
    icon: "/images/resume-icon.svg",
    external: true,
  },
];

/** Everything except the resume PDF — used for the icon-only social rows. */
export const iconSocialLinks = socialLinks.filter(
  (social) => social.label !== "Resume"
);

export const resumeLink = socialLinks.find(
  (social) => social.label === "Resume"
);
