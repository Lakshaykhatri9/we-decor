import CheckoutPage from "@/components/CheckoutPage";

export const metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default function CheckoutRoute() {
  return <main className="checkout-page page-width"><div className="page-intro compact"><span className="eyebrow">A SECURE CHECKOUT</span><h1>Make it yours.</h1></div><CheckoutPage /></main>;
}
