import { AddToCartArgs, CartItem, CheckoutPricing } from "@/types/cart";
import axios from "axios";
import Cookies from 'js-cookie';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Helper functions to manage cookies in the browser
const getCookie = (name: string): string | undefined => {
  return Cookies.get(name) ?? undefined;
};

const setCookie = (name: string, value: string, days: number = 30): void => {
  Cookies.set(name, value, { expires: days });
};

export const addToCart = async (
  args: AddToCartArgs,
  token: string | null = null
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = getCookie("sessionId");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        setCookie("sessionId", sessionId, 30);
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
        ? { headers: { "x-session-id": sessionId } }
        : {};
    await axios.post(`${baseUrl}/cart/items`, args, headers);
    return { success: true, message: "Item added to cart successfully" };
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return { success: false, message: error.message as string | "Failed to add item to cart" };
  }
};

export const getCart = async (
  token: string | null = null
): Promise<{ success: boolean, message: string, items: CartItem[], cartId: string }> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = getCookie("sessionId");
      if (!sessionId) {
        return { success: false, message: "Session ID is required", items: [], cartId: "" };
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
        ? { headers: { "x-session-id": sessionId } }
        : {};
    const response = await axios.get(`${baseUrl}/cart`, headers);
    return { success: true, message: "Cart fetched successfully", items: response.data.data as CartItem[], cartId: response.data.cartId as string };
  } catch (error) {
    console.error("Error getting cart:", error);
    return { success: false, message: "Failed to fetch cart", items: [], cartId: "" };
  }
};

export const removeFromCart = async (
  itemId: string,
  token: string | null = null
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = getCookie("sessionId");
      if (!sessionId) {
        return { success: false, message: "Session ID is required" };
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
        ? { headers: { "x-session-id": sessionId } }
        : {};
    await axios.delete(`${baseUrl}/cart/${itemId}`, headers);
    return { success: true, message: "Item removed from cart successfully" };
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    return { success: false, message: error.message as string | "Failed to remove item from cart" };
  }
};

export const updateCartItem = async (
  itemId: string,
  args: AddToCartArgs,
  token: string | null = null
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = getCookie("sessionId");
      if (!sessionId) {
        return { success: false, message: "Session ID is required" };
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
        ? { headers: { "x-session-id": sessionId } }
        : {};
    await axios.put(`${baseUrl}/cart/${itemId}`, args, headers);
    return { success: true, message: "Item updated in cart successfully" };
  } catch (error: any) {
    console.error("Error updating cart item:", error);
    return { success: false, message: error.message as string | "Failed to update item in cart" };
  }
};

export const mergeCartAfterLogin = async (token: string): Promise<void> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = getCookie("sessionId");
      if (!sessionId) {
        return;
      }
    }
    await axios.patch(`${baseUrl}/cart`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionId,
      },
    });
    return;
  } catch (error) {
    console.error("Error merging cart after login:", error);
    return;
  }
};

export const getCartId = async (
  token: string | null = null
): Promise<string | null> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = getCookie("sessionId");
      if (!sessionId) {
        return null;
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
        ? { headers: { "x-session-id": sessionId } }
        : {};
    const response = await axios.get(`${baseUrl}/cart/id`, headers);
    return response.data.data.cartId as string;
  } catch (error) {
    console.error("Error getting cart ID:", error);
    return null;
  }
};



export const getCheckoutPricing = async (cartId: string, couponCode: string | null = null): Promise<CheckoutPricing> => {
  try {
    if (!cartId) {
      return {
        subtotal: 0,
        discountAmount: {
          beforeDiscount: 0,
          afterDiscount: 0,
          iscountPercentage: 0
        },
        taxAmount: {
          beforeTaxAddition: 0,
          afterTaxAddition: 0,
          taxPercentage: 0
        },
        shippingAmount: {
          beforeShippingAddition: 0,
          afterShippingAddition: 0,
          shippingAmount: 0
        },
        totalAmount: 0
      };
    }
    const response = await axios.post(`${baseUrl}/cart/pricing`, {
      cartId,
      couponCode
    });
    return response.data.data as CheckoutPricing;
  } catch (error) {
    console.error("Error getting checkout pricing:", error);
    return {
      subtotal: 0,
      discountAmount: {
        beforeDiscount: 0,
        afterDiscount: 0,
        iscountPercentage: 0
      },
      taxAmount: {
        beforeTaxAddition: 0,
        afterTaxAddition: 0,
        taxPercentage: 0
      },
      shippingAmount: {
        beforeShippingAddition: 0,
        afterShippingAddition: 0,
        shippingAmount: 0
      },
      totalAmount: 0
    };
  }
};