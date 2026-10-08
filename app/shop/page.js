import ProductCatalog from "@/components/ProductCatalog";

export const metadata = { title: "Shop the collection", description: "Explore furniture, lighting and home decor from WE DECOR 4U." };

export default function ShopPage() {
  return <div className="catalog-page page-width"><div className="page-intro"><span className="eyebrow">THE WE DECOR 4U COLLECTION</span><h1>Objects for everyday living.</h1><p>Thoughtful furniture and finishing touches, chosen to make a house feel more like yours.</p></div><ProductCatalog /></div>;
}
