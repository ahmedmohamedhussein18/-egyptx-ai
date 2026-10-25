import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0A1628",
};

export const metadata: Metadata = {
  title: "EgyptX AI — The National Smart Tourism Ecosystem",
  description:
    "Discover Egypt. Experience History. Shape the Future. EgyptX AI is Egypt's National Smart Tourism Ecosystem powered by Artificial Intelligence.",
  manifest: "/manifest.json",
  keywords: [
    "Egypt",
    "Tourism",
    "AI",
    "Smart Tourism",
    "EgyptX",
    "Travel",
    "Heritage",
  ],
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('egyptx-theme');
                if (saved === 'light') {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
                var savedLoc = localStorage.getItem('egyptx-locale');
                if (savedLoc === 'ar') {
                  document.documentElement.dir = 'rtl';
                  document.documentElement.lang = 'ar';
                } else if (savedLoc) {
                  document.documentElement.dir = 'ltr';
                  document.documentElement.lang = savedLoc;
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#1A2332] dark:bg-[#0B0F19] dark:text-[#F8FAFC]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
