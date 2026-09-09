export interface NavItem {
  href: string;
  label: string;
  /** The reader outcome this route is designed for (docs/plans/2026-09-09-product-experience-ia.md). */
  outcome: string;
}

export const navigation: NavItem[] = [
  { href: "/", label: "Home", outcome: "I understand the idea." },
  { href: "/how-it-works", label: "How it Works", outcome: "I understand the mechanism." },
  { href: "/lab", label: "Lab", outcome: "I saw Compound happen." },
  { href: "/project", label: "Project", outcome: "I understand what this experiment is." },
  { href: "/resources", label: "Resources", outcome: "I understand what capability has been encoded." },
  { href: "/evidence", label: "Evidence", outcome: "I understand what has and hasn't been demonstrated." },
  { href: "/learn", label: "Field Guide", outcome: "I can explain the vocabulary." },
  { href: "/case-study", label: "Case Study", outcome: "I can tell which line of the story the record supports." },
];

export const canonical = {
  headline: ["Build the application.", "Improve the system that builds the next one."],
  definition: "Compound Design is a living framework for Design Engineers building web applications with humans and AI agents.",
  thesis: "Today's work should improve the capacity to execute the next.",
};
