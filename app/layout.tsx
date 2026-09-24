import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import SmoothScroll from "@/components/smooth-scroll";
import SceneCanvas from "@/components/three/scene-canvas";
import IntroOverlay from "@/components/intro-overlay";
import EasterEggs from "@/components/easter-eggs/easter-eggs";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rayankhan.dev"),
  title: "Rayan Khan, Full-Stack Web Developer",
  description:
    "Portfolio of Rayan Khan, a full-stack developer from Peshawar, Pakistan building modern web experiences with React, Next.js, and Node.js.",
  openGraph: {
    title: "Rayan Khan, Full-Stack Web Developer",
    description:
      "Full-stack developer building modern web experiences with React, Next.js, and Node.js.",
    url: "https://rayankhan.dev",
    siteName: "rayankhan.dev",
    images: ["/images/profile.jpg"],
    type: "website",
  },
  icons: {
    icon: "/favicon_io/favicon.ico",
    shortcut: "/favicon_io/favicon-16x16.png",
    apple: "/favicon_io/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
    >
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.style.fontFamily};
  --font-mono: ${GeistMono.style.fontFamily};
  --font-pixel: ${GeistPixelSquare.style.fontFamily};
}
        `}</style>
      </head>
      <body className="scanlines grain">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll />
          <IntroOverlay />
          {children}
          <Toaster />
          <EasterEggs />
          <SceneCanvas />
        </ThemeProvider>
      </body>
    </html>
  );
}
