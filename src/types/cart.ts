export type CartItem = {
  id: string;
  productId: string;
  categoryId: string | null;
  categoryPath: string | null;
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
    price: number;
    originalPrice: number;
  }[];
  possibleVolumes?: {
    ml_volume: string;
    variantId: string;
    price: number;
    originalPrice: number;
  }[];
  price: number; // discounted price per unit
  originalPrice: number; // original price per unit
  name: string;
  badgeText: string | null; // e.g., "Extra 10% OFF on orders above ₹500"
  buyXGetYOffer: {
    applicable: boolean;
    x: number;
    y: number;
    message: string | null; // e.g., "Buy 2 Get 1 Free"
  };
  description: string;
  productType: "clothing" | "perfume";
  image: string;
};

export type Pricing = {
  subtotal: number; // total after item-level discounts
  gst: number; // tax amount
  shipping: number; // actual shipping cost (always calculated)
  isFreeShipping: boolean; // whether shipping is free (by offer or threshold)
  discount: number; // cart-level discount
  total: number; // final amount to pay
  appliedOffer: string | null;
};

export type CartApiResponse = {
  success: boolean;
  message: string;
  cartId: string;
  cartItems: CartItem[];
  pricing: Pricing;
};

export type AddTOCartModalParams = {
  productId: string;
  productName: string;
  productImage: string;
  productType: "clothing" | "perfume";
  productVariants: {
    id: string;
    size?: string;
    ml_volume?: string;
    price: number;
    originalPrice: number;
    badgeText?: string;
  }[];
};


export type AddToCartArgs = {
  productVariantId: string;
  quantity: number;
};