export type CartItem = {
  id: string;
  quantity: number;
  size?: {
    size: string;
    variantId: string;
  };
  ml_volume?: {
    ml_volume: string;
    variantId: string;
  };
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
  productVariantId: string;
  quantity: number;
};
