export type CartItem = {
  id: string;
  quantity: number;
  size?: string;
  ml_volume?: string;
  possibleSizes?: {
    size: string;
    variantId: string;
  }[];
  possibleVolumes?: {
    ml_volume: string;
    variantId: string;
  }[];
  price: number;
  name: string;
  image: string;
  description: string;
  productType: "clothing" | "perfume";
};

export type AddToCartArgs = {
  productVariantId: string,
  quantity: number,
}