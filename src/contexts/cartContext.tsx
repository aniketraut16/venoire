"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { AddToCartArgs, CartItem } from "@/types/cart";
import { addToCart as addToCartApi, getCart as getCartApi, removeFromCart as removeFromCartApi, updateCartItem as updateCartItemApi, mergeCartAfterLogin as mergeCartAfterLoginApi } from "@/utils/cart";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "./LoadingContext";
import toast from "react-hot-toast";
import { addOrRemoveFromWishlist } from "@/utils/wishlist";
type CartContextType = {
  items: CartItem[];
  cartId: string;
  count: number;
  addToCart: (args: AddToCartArgs) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  updateCartItem: (itemId: string, args: AddToCartArgs) => Promise<boolean>;
  moveToWishlist: (item: CartItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>("");
  const {  startLoading, stopLoading } = useLoading();

  const computeCount = useCallback((list: CartItem[]) => {
    return list.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }, []);

  const refresh = useCallback(async () => {
    try {
      startLoading();
      const fetched = await getCartApi(token ?? null);
      if (fetched.success) {
        setItems(fetched.items);
        setCartId(fetched.cartId);
      }
    } finally {
      stopLoading();
    }
  }, [token]);

  const addToCart = useCallback(
    async (args: AddToCartArgs): Promise<boolean> => {
      startLoading();
      const ok = await addToCartApi(args, token ?? null);
      if (ok.success) {
        await refresh();
        toast.success(ok.message);
      } else {
        toast.error(ok.message);
      }
      stopLoading();
      return ok.success;
    },
    [token, refresh]
  );

  const removeFromCart = useCallback(
    async (itemId: string): Promise<boolean> => {
      startLoading();
      const ok = await removeFromCartApi(itemId, token ?? null);
      if (ok.success) {
        await refresh();
        toast.success(ok.message);
      } else {
        toast.error(ok.message);
      }
      stopLoading();
      return ok.success;
    },
    [token, refresh]
  );

  const moveToWishlist = useCallback(
    async (item: CartItem): Promise<void> => {
      if (!token) {
        toast.error("Please login to move to wishlist");
        return;
      }
      startLoading();
      const ok = await addOrRemoveFromWishlist(token, item.productId, "add");
      if (ok.success) {
        await removeFromCart(item.id);
        await refresh();
        toast.success(ok.message);
      } else {
        toast.error(ok.message);
      }
      stopLoading();
      return;
    },
    [token, removeFromCart]
  );

  const removeFromWishlist = useCallback(
    async (productId: string): Promise<void> => {
      if (!token) {
        toast.error("Please login to remove from wishlist");
        return;
      }
      startLoading();
      const ok = await addOrRemoveFromWishlist(token, productId, "remove");
      if (ok.success) {
        toast.success(ok.message);
      } else {
        toast.error(ok.message);
      }
      stopLoading();
      return;
    },
    [token]
  );
  const addToWishlist = useCallback(
    async (productId: string): Promise<void> => {
      if (!token) {
        toast.error("Please login to add to wishlist");
        return;
      }
      startLoading();
      const ok = await addOrRemoveFromWishlist(token, productId, "add");
      if (ok.success) {
        toast.success(ok.message);
      } else {
        toast.error(ok.message);
      }
      stopLoading();
      return;
    },
    [token]
  );
  const updateCartItem = useCallback(
    async (itemId: string, args: AddToCartArgs): Promise<boolean> => {
      startLoading();
      const ok = await updateCartItemApi(itemId, args, token ?? null);
      if (ok.success) {
        await refresh();
        toast.success(ok.message);
      } else {
        toast.error(ok.message);
      }
      stopLoading();
      return ok.success;
    },
    [token, refresh]
  );

  useEffect(() => {
    startLoading();
    refresh().finally(() => {
      stopLoading();
    });
  }, [refresh]);

  useEffect(() => {
    if (!token) return;
    startLoading();
    mergeCartAfterLoginApi(token).finally(() => {
      stopLoading();
    });
  }, [token]);

  const value = useMemo<CartContextType>(() => ({
    items,
    count: computeCount(items),
    cartId,
    addToCart,
    removeFromCart,
    updateCartItem,
    moveToWishlist,
    removeFromWishlist,
    addToWishlist,
  }), [items, refresh, addToCart, removeFromCart, updateCartItem, computeCount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}


