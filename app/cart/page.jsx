import CartPage from "@/components/CartPage";

export const metadata = { title: "Your bag", robots: { index: false, follow: true } };

export default function CartRoute() {
  return <main className="cart-page page-width"><div className="page-intro compact"><span className="eyebrow">YOUR BAG</span><h1>A few good things.</h1></div><CartPage /></main>;
}
