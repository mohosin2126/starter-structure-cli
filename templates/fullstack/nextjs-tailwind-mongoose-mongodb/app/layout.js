import { Geist, Space_Grotesk } from "next/font/google";

import "./globals.css";

const bodyFont = Geist({
  variable: "--font-body",
  subsets: ["latin"]
});

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"]
});

export const metadata = {
  title: "__APP_NAME__",
  description: "A Next.js and Tailwind CSS starter for fast product launches."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
