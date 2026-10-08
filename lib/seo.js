const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");

export function canonical(path = "/") {
  return siteUrl ? `${siteUrl}${path}` : undefined;
}

export function productJsonLd(product, url) {
  const images = [product.mainImage, ...(product.galleryImages || []), ...(product.lifestyleImages || [])].filter(Boolean);
  const offer = {
    "@type": "Offer",
    priceCurrency: "INR",
    price: (Number(product.priceInrPaise) / 100).toFixed(2),
    availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
  };
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(images.length ? { image: images } : {}),
    description: product.description,
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    offers: { ...offer, ...(url ? { url } : {}) },
  };
}
