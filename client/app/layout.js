import { Geist, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ShopProvider } from "../lib/ShopContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "ATELIER — Luxury Minimalist Fashion",
  description: "A premium, monochrome, modern luxury fashion brand and editorial shopping platform.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ShopProvider>
            {children}
          </ShopProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
