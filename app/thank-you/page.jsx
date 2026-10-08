import { Suspense } from "react";
import ThankYouPage from "@/components/ThankYouPage";

export const metadata = { title: "Order confirmation", robots: { index: false, follow: false } };

export default function ThankYouRoute() {
  return <Suspense fallback={<main className="page-width"><p className="state-message">Loading your confirmation…</p></main>}><ThankYouPage /></Suspense>;
}
