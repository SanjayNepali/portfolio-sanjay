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
      "Mantra is a platform that helps celebrities connect with their fans through exclusive content, event bookings, and reward-based interactions. It also includes AI-powered content moderation and personalized recommendations to improve the user experience.",
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
      "PrimeTime is a student collaboration and learning platform designed to improve communication and project management. It features real-time chat, learning analytics, sentiment analysis, and smart recommendations to help teams stay organized and productive.",
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
      "FitTrack is a gym management system that helps members track their fitness journey while giving administrators tools to manage memberships, subscriptions, and attendance. It also provides workout suggestions and meal planning support.",
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
      "Kiraya is a rental marketplace that connects landlords with tenants looking for accommodation. Students can easily search for rooms and apartments near their college, while landlords can manage listings through a dedicated dashboard. The platform also includes an integrated chat system for direct communication.",
    tech: ["PHP", "MySQL", "JavaScript", "HTML/CSS"],
    github: "https://github.com/SanjayNepali/Apartment-rental-website",
  },
];
