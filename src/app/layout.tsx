import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import FontLoader from "@/components/FontLoader";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import I18nProvider from "@/components/I18nProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weesh.lol";
const defaultTitle = "Weesh - Create and Share Your Dream Wishlist";
// Matches i18n product description (en: home.description)
const defaultDescription =
  "Weesh helps you create wishlists and share them with loved ones — get only the gifts you want.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Weesh",
  },
  icons: {
    icon: "/favicon.png",
  },
  description: defaultDescription,
  keywords: [
    "wishlist",
    "gift list",
    "wish list",
    "share wishlist",
    "gift registry",
  ],
  applicationName: "Weesh",
  authors: [{ name: "Weesh" }],
  creator: "Weesh",
  publisher: "Weesh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Weesh",
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Weesh - Create and Share Your Dream Wishlist" }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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
        <GoogleAnalytics />
        <FontLoader />
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

