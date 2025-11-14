export type IntiateOrderArgs = {
  cartId: string;
  shippingAddressId: string;
  billingAddressId: string;
  couponCode: string;
  notes: string;
};

export type MOCK_ORDER_CALLBACK_Args = {
  orderId: string;
  transactionId: string;
  paymentStatus: "success" | "failed";
  amount: number;
  paymentMethod: "credit_card" | "debit_card" | "netbanking" | "wallet" | "upi";
  gatewayResponse: JSON | null;
};

export type SimpleOrderItem = {
  name: string;
  variant: string;
  thumbnail_url: string;
};

export type Order = {
  id: string;
  order_number: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  items_count: number;
  items: SimpleOrderItem[];
  created_at: string;
  updated_at: string;
};

export type OrderItem = SimpleOrderItem & {
  id: string;
  product_variant_id: string;
  product_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};
export type Address = {
  id: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type Payment = {
  id: string;
  payment_method:
    | "credit_card"
    | "debit_card"
    | "netbanking"
    | "wallet"
    | "upi";
  payment_status: "pending" | "completed" | "failed" | "refunded";
  amount: string;
  transaction_id: string;
  paid_at: string | null;
};

export type Coupon = {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
} | null;

export type DetailedOrder = {
  id: string;
  order_number: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  subtotal: string;
  discount_amount: string;
  tax_amount: string;
  shipping_amount: string;
  total_amount: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  payment: Payment;
  coupon: Coupon;
  refund: Refund;
};

export type Refund = {
  id: string;
  refund_status: "pending_refund" | "refund_initiated" | "refund_completed" | "refund_failed";
  refund_amount: string;
  refund_transaction_id: string;
  refund_initiated_at: string;
  refund_completed_at: string | null;
  refund_reason: string;
  refund_notes: string;
} | null;


export type CancelOrderArgs = {
  reason: string;
  comments: string;
};
export type CancelOrderResponse = {
  success: boolean;
  message: string;
  data?: {
    order_number: string;
    status: "cancelled";
    refund_status: "pending";
    refund_amount: string;
  } | null;
};

export type TrackOrderResponse = {
    order_id: string;
    order_number: string;
    current_status: string;
    tracking_number: string | null;
    carrier: string | null;
    estimated_delivery: string | null;
    timeline: {
        status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
        timestamp: string;
        message: string;
    }[];
}

export type Review = {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  product_thumbnail: string | null;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
};

export type GetOrderReviewsResponse = {
  success: boolean;
  data: {
    order_id: string;
    reviews: Review[];
    can_review: boolean;
  };
};

export type CreateReviewArgs = {
  product_id: string;
  rating: number;
  comment?: string;
};

export type CreateReviewResponse = {
  success: boolean;
  message: string;
  data: {
    review_id: string;
    product_id: string;
    product_name: string;
    rating: number;
    comment: string | null;
    is_approved: boolean;
    created_at: string;
  };
};