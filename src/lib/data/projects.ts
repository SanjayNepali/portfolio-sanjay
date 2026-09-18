export type Project = {
  name: string;
  meta: string;
  images: string[];
  description: string;
  tech: string[];
  github: string;
};

export const projects: Project[] = [
  {
    name: "Mantra",
    meta: "Creator commerce platform",
    images: [
      "/images/mantra/landing.png",
      "/images/mantra/celebdash.png",
      "/images/mantra/checkout.png",
    ],
    description:
      "A fan-engagement platform connecting celebrities and fans through content sharing, event bookings, and a points-based rewards system — with AI-based content moderation and personalized recommendations.",
    tech: ["Python", "Django", "JavaScript", "AI Moderation"],
    github: "https://github.com/SanjayNepali/MANTRA",
  },
  {
    name: "PrimeTime",
    meta: "Student learning dashboard",
    images: [
      "/images/primetime/dashboardstud.png",
      "/images/primetime/Chatprime.png",
      "/images/primetime/analytics.png",
    ],
    description:
      "A real-time project management and communication platform for teams — WebSocket chat, sentiment analysis, and ML-powered resource recommendations, with dashboards tracking team stress levels and progress.",
    tech: ["Django", "WebSocket", "TF-IDF", "Machine Learning"],
    github: "https://github.com/SanjayNepali/PrimeTime-Academic-System",
  },
  {
    name: "FitTrack",
    meta: "Gym management system",
    images: [
      "/images/fittrack/user_dashboard.png",
      "/images/fittrack/workout_progress.png",
      "/images/fittrack/personalized_meal_plan.png",
    ],
    description:
      "A role-based gym membership management system with a BMI calculator, personalized workout recommendations, attendance tracking, and subscription handling for members and admins.",
    tech: ["PHP", "MySQL", "HTML/CSS"],
    github: "https://github.com/SanjayNepali/Fit-Track",
  },
  {
    name: "Kiraya",
    meta: "Rental marketplace",
    images: [
      "/images/kiraya/home_page.png",
      "/images/kiraya/landlord_page.png",
    ],
    description:
      "A rental marketplace connecting landlords and tenants, with dedicated dashboards for listing properties and browsing available homes. Built for students looking for apartments near their campus — listings can be searched by college name — and it includes a built-in chat feature.",
    // TODO: fill this in with the real stack.
    tech: [],
    github: "https://github.com/SanjayNepali/Apartment-rental-website",
  },
];
