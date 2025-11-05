import { AddToCartArgs, CartItem } from "@/types/cart";
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
): Promise<boolean> => {
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
    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return false;
  }
};

export const getCart = async (
  token: string | null = null
): Promise<CartItem[]> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = getCookie("sessionId");
      if (!sessionId) {
        return [];
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
      ? { headers: { "x-session-id": sessionId } }
      : {};
    const response = await axios.get(`${baseUrl}/cart`, headers);
    return response.data.data as CartItem[];
  } catch (error) {
    console.error("Error getting cart:", error);
    return [];
  }
};

export const removeFromCart = async (
  itemId: string,
  token: string | null = null
): Promise<boolean> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = getCookie("sessionId");
      if (!sessionId) {
        return false;
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
      ? { headers: { "x-session-id": sessionId } }
      : {};
    await axios.delete(`${baseUrl}/cart/${itemId}`, headers);
    return true;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return false;
  }
};

export const updateCartItem = async (
  itemId: string,
  args: AddToCartArgs,
  token: string | null = null
): Promise<boolean> => {
  try {
    let sessionId = null;
    if (!token) {
      sessionId = getCookie("sessionId");
      if (!sessionId) {
        return false;
      }
    }
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : sessionId
      ? { headers: { "x-session-id": sessionId } }
      : {};
    await axios.put(`${baseUrl}/cart/${itemId}`, args, headers);
    return true;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return false;
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
