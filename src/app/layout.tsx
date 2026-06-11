import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "CixioHub — AI Platform for TKM",
  description: "AI-powered chat platform for TKM students",
  icons: {
    icon: "/cixio-icon.svg",
    apple: "/cixio-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cixio-bg">
        <Providers>
          <NavBar />
          <div className="pt-14">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
