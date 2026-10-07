import { Bad_Script } from "next/font/google";
import type { ReactNode } from "react";
import "@/components/alphabet/alphabet-program.css";

const propis = Bad_Script({
  weight: "400",
  subsets: ["cyrillic", "latin"],
  variable: "--font-propis",
  display: "swap",
  // If the webfont is blocked (LAN / CORS), fall through to Georgia so Cyrillic stays visible.
  adjustFontFallback: false,
});

export default function AlphabetLayout({ children }: { children: ReactNode }) {
  return <div className={`${propis.variable} azbuka-root`}>{children}</div>;
}
