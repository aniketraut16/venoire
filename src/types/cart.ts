export type CartItem = {
  id: string;
  productId: string;
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
  originalPrice?: number;
  name: string;
  image: string;
  description: string;
  productType: "clothing" | "perfume";
};

export type AddToCartArgs = {
  productVariantId: string;
  quantity: number;
};


export type CheckoutPricing = {
  subtotal: number,
  discountAmount: {
    beforeDiscount: number,
    afterDiscount: number,
    iscountPercentage: number
  },
  taxAmount: {
    beforeTaxAddition: number,
    afterTaxAddition: number,
    taxPercentage: number
  },
  shippingAmount: {
    beforeShippingAddition: number,
    afterShippingAddition: number,
    shippingAmount: number
  },
  totalAmount: number
}