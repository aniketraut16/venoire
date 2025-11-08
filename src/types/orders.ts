export type IntiateOrderArgs = {
    cartId: string;
    shippingAddressId: string;
    billingAddressId: string;
    couponCode: string;
    notes: string;
}

export type MOCK_ORDER_CALLBACK_Args = {
    orderId: string;
    transactionId: string;
    paymentStatus: "success" | "failed";
    amount: number;
    paymentMethod: "credit_card" | "debit_card" | "netbanking" | "wallet" | "upi";
    gatewayResponse: JSON | null;
}