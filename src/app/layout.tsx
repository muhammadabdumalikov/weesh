import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import FontLoader from "@/components/FontLoader";
import I18nProvider from "@/components/I18nProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Weesh - Create and Share Your Dream Wishlist",
    template: "%s | Weesh",
  },
  icons: {
    icon: "/favicon.png",
  },
  description:
    "Create, manage, and share your personal wishlist with friends and family. Add unlimited items with images and links.",
  keywords: [
    "wishlist",
    "gift list",
    "wish list",
    "share wishlist",
    "gift registry",
  ],
  applicationName: "Wishlist",
  authors: [{ name: "Wishlist" }],
  creator: "Wishlist",
  publisher: "Wishlist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geologica:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <FontLoader />
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

