import type { Viewport } from "next";

/** The guide shares the Comet formula: light theme, outside the site shell. */
export const viewport: Viewport = {
  themeColor: "#fbfaf4",
  colorScheme: "light",
};

export default function GuideLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
