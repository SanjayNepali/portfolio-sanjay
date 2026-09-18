export type ProcessStep = {
  number: string;
  tagline: string;
  heading: string;
  description: string;
  image: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    tagline: "Research and understanding",
    heading: "Discover",
    description:
      "Every project starts with understanding the problem. I explore requirements, research existing solutions, and identify opportunities to create a better user experience.",
    image: "/animation/about/discover.svg",
  },
  {
    number: "02",
    tagline: "Planning the solution",
    heading: "Strategize",
    description:
      "Before development begins, I break down the problem, define the architecture, and choose the right technologies. A clear plan helps reduce complexity and improve efficiency.",
    image: "/animation/about/strategy.svg",
  },
  {
    number: "03",
    tagline: "Turning ideas into reality",
    heading: "Develop",
    description:
      "I build scalable and user-focused applications using modern technologies. From backend systems to interactive interfaces, I focus on performance, reliability, and maintainable code.",
    image: "/animation/about/develop.svg",
  },
  {
    number: "04",
    tagline: "Continuous improvement",
    heading: "Refine",
    description:
      "Testing, debugging, and optimization are essential parts of my process. I continuously improve both the product and my skills through learning, experimentation, and feedback.",
    image: "/animation/about/refine.svg",
  },
  {
    number: "05",
    tagline: "Deliver with confidence",
    heading: "Ship",
    description:
      "I ensure every project is polished, responsive, and ready for real users. My goal is to deliver solutions that are reliable, impactful, and enjoyable to use.",
    image: "/animation/about/ship.svg",
  },
];