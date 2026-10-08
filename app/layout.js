import "./globals.css";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CartProvider } from "@/components/CartContext";
import { CountryProvider } from "@/components/CountryContext";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";

const siteUrl = process.env.SITE_URL;
const metadataBase = siteUrl ? new URL(siteUrl) : undefined;

export const metadata = {
  metadataBase,
  icons: { icon: "/favicon.svg" },
  title: { default: "WE DECOR 4U | Luxury Interior & Modular Living", template: "%s | WE DECOR 4U" },
  description: "Premium modular kitchens, thoughtful interiors and memorable event decor, designed around you.",
  openGraph: { title: "WE DECOR 4U", description: "Luxury interior, modular living and event decor.", type: "website" },
  twitter: { card: "summary_large_image", title: "WE DECOR 4U", description: "Luxury interior, modular living and event decor." },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  ...(process.env.META_SITE_VERIFICATION || process.env.PINTEREST_SITE_VERIFICATION ? { other: {
    ...(process.env.META_SITE_VERIFICATION ? { "facebook-domain-verification": process.env.META_SITE_VERIFICATION } : {}),
    ...(process.env.PINTEREST_SITE_VERIFICATION ? { "p:domain_verify": process.env.PINTEREST_SITE_VERIFICATION } : {}),
  } } : {}),
};

export default function RootLayout({ children }) {
  return <html lang="en">
    <body><CountryProvider><CartProvider><SiteHeader /><main>{children}</main><SiteFooter /><CookieConsent /><Suspense fallback={null}><Analytics /></Suspense></CartProvider></CountryProvider></body>
  </html>;
}
