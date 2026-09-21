import type { Metadata } from "next";
import "./globals.css";
import "./simple.css";

export const metadata: Metadata = {
  title: { default: "Mwambo — Know Your Roots. Know Your Zambia.", template: "%s — Mwambo" },
  description: "A trusted knowledge platform for Zambian culture, heritage, identity, marriage and family traditions."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}