export type Project = {
  name: string;
  meta: string;
  images: string[];
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
  },
  {
    name: "PrimeTime",
    meta: "Student learning dashboard",
    images: [
      "/images/primetime/dashboardstud.png",
      "/images/primetime/Chatprime.png",
      "/images/primetime/analytics.png",
    ],
  },
  {
    name: "FitTrack",
    meta: "Gym management system",
    images: [
      "/images/fittrack/user_dashboard.png",
      "/images/fittrack/workout_progress.png",
      "/images/fittrack/personalized_meal_plan.png",
    ],
  },
  {
    name: "Kiraya",
    meta: "Rental marketplace",
    images: [
      "/images/kiraya/home_page.png",
      "/images/kiraya/landlord_page.png",
    ],
  },
];