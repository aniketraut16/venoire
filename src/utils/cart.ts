import { AddToCartArgs, CartApiResponse, CartItem, Pricing } from "@/types/cart";
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
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to add item to cart";
    return { success: false, message: errorMessage };
  }
};

export const getCartCount = async (
  token: string | null = null
): Promise<{ success: boolean, message: string, count: number, cartId: string }> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = getCookie("sessionId");
      if (!sessionId) {
        return { success: false, message: "Session ID is required", count: 0, cartId: "" };
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
        ? { headers: { "x-session-id": sessionId } }
        : {};
    const response = await axios.get(`${baseUrl}/cart/count`, headers);
    return { success: true, message: "Cart count fetched successfully", count: response.data.count as number, cartId: response.data.cartId as string };
  } catch (error) {
    console.error("Error getting cart count:", error);
    return { success: false, message: "Failed to fetch cart count", count: 0, cartId: "" };
  }
};

export const getCart = async (
  token: string | null = null,
  pinCode: string | null = null
): Promise<CartApiResponse> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = getCookie("sessionId");
      if (!sessionId) {
        return { success: false, message: "Session ID is required", cartId: "", cartItems: [], pricing: { subtotal: 0, gst: 0, shipping: 0, discount: 0, total: 0, appliedOffer: null } };
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
        ? { headers: { "x-session-id": sessionId } }
        : {};
    const response = await axios.get(`${baseUrl}/cart?pincode=${pinCode}`, headers);
    const data = response.data || {};

    // Support both old and new response shapes if backend differs
    const cartItems = (data.cartItems ?? data.data ?? []) as CartItem[];
    const pricing = (data.pricing ?? { subtotal: 0, gst: 0, shipping: 0, discount: 0, total: 0 }) as Pricing;

    return {
      success: true,
      message: data.message ?? "Cart fetched successfully",
      cartId: data.cartId ?? "",
      cartItems: cartItems,
      pricing,
    };
  } catch (error: any) {
    console.error("Error getting cart:", error);
    const errorMessage =
      error?.response?.data?.message || error?.message || "Failed to fetch cart";
    return { success: false, message: errorMessage, cartId: "", cartItems: [], pricing: { subtotal: 0, gst: 0, shipping: 0, discount: 0, total: 0, appliedOffer: null } };
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
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to remove item from cart";
    return { success: false, message: errorMessage };
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
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to update item in cart";
    return { success: false, message: errorMessage };
  }
};

export const mergeCartAfterLogin = async (token: string): Promise<void> => {
  try {
    const sessionId = getCookie("sessionId");
    if (!sessionId) {
      return;
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
