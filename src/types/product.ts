export type Product = {
  id: string;
  slug: string;

  name: string;
  category: string;
  catalog: "Best Seller" | "New Arrival" | "Trending" | "Featured" | "Sale";

  price: number;
  originalPrice: number;
  discount: number;
  size: string[];
  thumbnail: string;
};

export type DetailProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  catalog: "Best Seller" | "New Arrival" | "Trending" | "Featured" | "Sale";
  price: number;
  originalPrice: number;
  discount: number;
  itemsRemaining: number;
  size: string[];
  thumbnail: string;
  images: string[];
  description: string;
  material: string; // e.g. "60% Rayon, 34% Polyester and 6% Elastane"
  fit: string; // e.g. "Ultra Slim Fit"
  pattern: string; // e.g. "Textured"
  sleeves: string; // e.g. "Full Sleeves"
  occasion: string; // e.g. "Formal"
  color: string; // e.g. "Light Blue"
  productType: string; // e.g. "Blazer"
  collection: string; // e.g. "VH Move"
};
