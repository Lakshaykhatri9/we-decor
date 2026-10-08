const starterProducts = [
  {
    id: "concept-arc-table-lamp",
    name: "Arc Table Lamp",
    slug: "arc-table-lamp",
    description: "A softly sculpted table lamp concept with a warm ivory shade and a deep olive ceramic base. Designed to bring gentle light to a reading corner or bedside table.\n\nThis is a visual concept listing. Final materials, dimensions, price, and availability have not been confirmed.",
    category: "Lighting",
    brand: "WE DECOR 4U",
    tags: ["lamp", "lighting", "concept preview"],
    mainImage: "/products/preview-table-lamp.svg",
    priceInrPaise: null,
    stock: 0,
    variants: [],
    previewOnly: true,
  },
  {
    id: "concept-sora-lounge-chair",
    name: "Sora Lounge Chair",
    slug: "sora-lounge-chair",
    description: "A relaxed lounge-chair concept with a rounded oatmeal upholstery profile and a warm timber frame. Its calm silhouette suits a quiet reading nook or living room.\n\nThis is a visual concept listing. Final materials, dimensions, price, and availability have not been confirmed.",
    category: "Furniture",
    brand: "WE DECOR 4U",
    tags: ["chair", "seating", "furniture", "concept preview"],
    mainImage: "/products/preview-lounge-chair.svg",
    priceInrPaise: null,
    stock: 0,
    variants: [],
    previewOnly: true,
  },
  {
    id: "concept-arden-console",
    name: "Arden Entry Console",
    slug: "arden-entry-console",
    description: "A pared-back entry console concept with a walnut-toned top, slim sculptural legs, and a lower shelf for everyday objects.\n\nThis is a visual concept listing. Final materials, dimensions, price, and availability have not been confirmed.",
    category: "Furniture",
    brand: "WE DECOR 4U",
    tags: ["console", "entryway", "furniture", "concept preview"],
    mainImage: "/products/preview-console.svg",
    priceInrPaise: null,
    stock: 0,
    variants: [],
    previewOnly: true,
  },
  {
    id: "concept-mira-ceramic-vase",
    name: "Mira Ceramic Vessel",
    slug: "mira-ceramic-vessel",
    description: "A hand-formed vessel concept with a softly ribbed body and a quiet sand finish. Styled on its own or with a few seasonal branches.\n\nThis is a visual concept listing. Final materials, dimensions, price, and availability have not been confirmed.",
    category: "Decor accents",
    brand: "WE DECOR 4U",
    tags: ["vase", "ceramic", "decor", "concept preview"],
    mainImage: "/products/preview-vessel.svg",
    priceInrPaise: null,
    stock: 0,
    variants: [],
    previewOnly: true,
  },
  {
    id: "concept-ona-pendant-light",
    name: "Ona Pendant Light",
    slug: "ona-pendant-light",
    description: "A pendant-light concept with a softly pleated shade and a muted brass detail. Intended as a warm focal point above a dining table or kitchen island.\n\nThis is a visual concept listing. Final materials, dimensions, price, and availability have not been confirmed.",
    category: "Lighting",
    brand: "WE DECOR 4U",
    tags: ["pendant", "lighting", "concept preview"],
    mainImage: "/products/preview-pendant.svg",
    priceInrPaise: null,
    stock: 0,
    variants: [],
    previewOnly: true,
  },
  {
    id: "concept-nami-woven-rug",
    name: "Nami Woven Rug",
    slug: "nami-woven-rug",
    description: "A natural-toned rug concept with a simple woven grid and subtle border. Designed to add texture beneath a coffee table or at the foot of a bed.\n\nThis is a visual concept listing. Final materials, dimensions, price, and availability have not been confirmed.",
    category: "Textiles",
    brand: "WE DECOR 4U",
    tags: ["rug", "textile", "woven", "concept preview"],
    mainImage: "/products/preview-woven-rug.svg",
    priceInrPaise: null,
    stock: 0,
    variants: [],
    previewOnly: true,
  },
];

export function isLocalCatalogPreview() {
  return process.env.NODE_ENV === "development" && !process.env.MONGODB_URI;
}

export function getStarterProduct(slug) {
  return starterProducts.find((product) => product.slug === slug) || null;
}

export function getStarterCatalog({ category = "", ids = [], page = 1, limit = 24 } = {}) {
  let products = starterProducts;
  if (category) products = products.filter((product) => product.category === category);
  if (ids.length) products = products.filter((product) => ids.includes(product.id));
  const start = (page - 1) * limit;
  return {
    products: products.slice(start, start + limit),
    categories: [...new Set(starterProducts.map((product) => product.category))].sort(),
    hasMore: false,
    page,
    previewMode: true,
  };
}

export function searchStarterCatalog(query) {
  const term = query.toLowerCase();
  return starterProducts.filter((product) => [product.name, product.category, product.description, product.brand, ...product.tags].join(" ").toLowerCase().includes(term)).slice(0, 8);
}
