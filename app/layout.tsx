import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Vehicle Database | Free VIN Decoder & Car Specs",
    template: "%s | Vehicle Database",
  },
  description:
    "Free vehicle specifications database. Search by year, make, model, or VIN. No login required. Access comprehensive car data including engine specs, dimensions, fuel economy, and more.",
  keywords: [
    "vehicle specifications",
    "car specs",
    "VIN decoder",
    "vehicle database",
    "car comparison",
    "automotive data",
    "fuel economy",
    "engine specs",
  ],
  authors: [{ name: "Vehicle Database" }],
  creator: "Vehicle Database",
  publisher: "Vehicle Database",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Vehicle Database",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vehicledatabase",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="layout">
          <Header />
          <main id="main-content" className="main">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
