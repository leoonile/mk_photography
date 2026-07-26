import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "MK Photography — Home",
  description: "Award-winning Benin photographer specializing in events, portraits, and lifestyle moments that tell authentic stories.",
  icons: {
    icon: "/icon.png?v=4",
    apple: "/apple-icon.png?v=4",
  },
  openGraph: {
    title: "MK Photography",
    description: "Award-winning Benin photographer specializing in events, portraits, and lifestyle moments that tell authentic stories.",
    images: [
      {
        url: "/opengraph-image.png?v=4",
        width: 1200,
        height: 630,
        alt: "MK Photography Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
