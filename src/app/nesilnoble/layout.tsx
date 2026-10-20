import type { Metadata } from "next";
import "./nesilnoble.css";

export const metadata: Metadata = {
  title: "Mahdi’s Lucid Dreams · Mahdi Nasri, Software Engineer",
  description:
    "Mahdi Nasri is a Full Stack Developer at ZETABOX in Sfax, building cross-platform web and mobile applications with Flutter, React, Strapi and PostgreSQL. Open to new roles and freelance work.",
  icons: {
    icon: "/sites/nesilnoble/favicon.svg",
    apple: "/sites/nesilnoble/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Mahdi’s Lucid Dreams",
    title: "Mahdi’s Lucid Dreams · Mahdi Nasri",
    description:
      "Mahdi Nasri is a Full Stack Developer at ZETABOX in Sfax, building cross-platform web and mobile applications with Flutter, React, Strapi and PostgreSQL. Open to new roles and freelance work.",
  },
  twitter: { card: "summary" },
};

export const viewport = { themeColor: "#545388" };

export default function NesilNobleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
