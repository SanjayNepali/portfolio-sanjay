export type ProcessStep = {
  number: string;
  tagline: string;
  heading: string;
  description: string;
  /** Self-animating SMIL SVG (or GIF for develop, which has no SVG source) */
  image: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    tagline: "I don't build just because I can.",
    heading: "Discover",
    description:
      "Before writing a line of code, I research how similar problems have been solved and look for ideas that could make the experience better. Every feature needs a reason to exist.",
    image: "/animation/about/discover.svg",
  },
  {
    number: "02",
    tagline: "Problem-solving is a bit like chess.",
    heading: "Strategize",
    description:
      "Understand where I am, think through the next move, consider what could go wrong — sometimes the right answer is rethinking the whole approach before writing anything.",
    image: "/animation/about/strategy.svg",
  },
  {
    number: "03",
    tagline: "Build. Break. Learn. Fix. Repeat.",
    heading: "Develop",
    description:
      "This is where ideas become real — real-time communication, sentiment analysis, recommendation systems. I care about the small details most people never notice.",
    image: "/animation/about/develop.svg",
  },
  {
    number: "04",
    tagline: "Comparing my journey to someone else's doesn't help.",
    heading: "Refine",
    description:
      "Technology moves fast and I know I still have a lot to learn. So I keep experimenting, breaking things, fixing them, and getting a little better every time.",
    image: "/animation/about/refine.svg",
  },
  {
    number: "05",
    tagline: "When I say I'll deliver, I deliver.",
    heading: "Ship",
    description:
      "I take ownership of what I build, care about deadlines as much as quality, and want to be more than someone who writes code — a builder people enjoy working with.",
    image: "/animation/about/ship.svg",
  },
];