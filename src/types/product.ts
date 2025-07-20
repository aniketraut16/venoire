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
