import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./simple.css";
import "./simple-admin.css";
import CookieConsent from "../components/CookieConsent";

export const metadata: Metadata = {
  title: { default: "Mwambo — Know Your Roots. Know Your Zambia.", template: "%s — Mwambo" },
  description: "A trusted knowledge platform for Zambian culture, heritage, identity, marriage and family traditions."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}<CookieConsent /><Analytics /></body>
      </html>
    </ClerkProvider>
  );
}
