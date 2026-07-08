import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Abhiroop Hiremath | Software Developer",
  description: "A premium interactive digital business card portfolio, showcasing projects and developer profile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="bg-[var(--theme-bg)] min-h-full font-sans antialiased text-[var(--theme-text)]">
        {children}
      </body>
    </html>
  );
}
