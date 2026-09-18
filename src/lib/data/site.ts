/**
 * Single source of truth for identity, contact details, and the hero's
 * editorial content.
 */
export const siteConfig = {
  name: "Sanjay Nepali",
  role: "Web Developer",
  description:
    "Portfolio of Sanjay Nepali — a web developer in Kathmandu, Nepal building fast, detail-oriented web apps with Django and the MERN stack.",
  shortBio:
    "A web developer based in Kathmandu, Nepal. Final-year BIM student building fast, detail-oriented web apps with Django and the MERN stack.",
  location: "Kathmandu, Nepal",
  timezone: "NPT · Remote-friendly",
  availability: "Open For Work",
  email: "sanjinep.dev@gmail.com",
  /**
   * Set NEXT_PUBLIC_SITE_URL in production so metadataBase, canonical URLs,
   * and Open Graph tags resolve to the real domain.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const heroContent = {
  index: "001",
  lede: "I design and build fast, detail-oriented websites for people who care how their work feels to use.",
  headline: ["Web developer", "Creating", "products that"],
  rotatingWords: ["Perform", "Convert", "Deliver", "Scale", "Engage"],
  portraits: [
    "/images/sanjay3.png",
    "/images/sanjay2.png",
    "/images/sanji.png",
    "/images/sanjay4.png",
    "/images/sanjay5.png",
  ],
} as const;

export const marqueeItems = [
  "Full Stack Web Dev",
  "React & Next.js",
  "Django & Python",
  "MERN Stack",
  "UI/UX Focused",
] as const;
