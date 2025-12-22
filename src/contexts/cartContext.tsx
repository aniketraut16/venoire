"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { AddToCartArgs, AddTOCartModalParams, CartItem } from "@/types/cart";
import { addToCart as addToCartApi, getCartCount as getCartCountApi, removeFromCart as removeFromCartApi, updateCartItem as updateCartItemApi, mergeCartAfterLogin as mergeCartAfterLoginApi } from "@/utils/cart";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "./LoadingContext";
import toast from "react-hot-toast";
import { addOrRemoveFromWishlist } from "@/utils/wishlist";
import AddtoCartModal from "@/components/common/AddtoCartModal";
type CartContextType = {
  cartId: string;
  count: number;
  addToCart: (args: AddToCartArgs) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  updateCartItem: (itemId: string, args: AddToCartArgs) => Promise<boolean>;
  moveToWishlist: (item: CartItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  openAddToCartModal: (params: AddTOCartModalParams) => void;
  closeAddToCartModal: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [modalParams, setModalParams] = useState<AddTOCartModalParams | null>(null);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState<boolean>(false);
  const [cartId, setCartId] = useState<string>("");
  const {  startLoading, stopLoading } = useLoading();


  const openAddToCartModal = useCallback((params: AddTOCartModalParams) => {
    setModalParams(params);
    setIsAddToCartModalOpen(true);
  }, []);

  const closeAddToCartModal = useCallback(() => {
    setModalParams(null);
    setIsAddToCartModalOpen(false);
  }, []);

  const refresh = useCallback(async () => {
    try {
      startLoading();
      const fetched = await getCartCountApi(token ?? null);
      if (fetched.success) {
        setCount(fetched.count);
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
    count,
    cartId,
    addToCart,
    removeFromCart,
    updateCartItem,
    moveToWishlist,
    removeFromWishlist,
    addToWishlist,
    openAddToCartModal,
    closeAddToCartModal
  }), [count, cartId, addToCart, removeFromCart, updateCartItem, moveToWishlist, removeFromWishlist, addToWishlist]);

  return (
    <CartContext.Provider value={value}>
      <AddtoCartModal modalParams={modalParams} addToCart={addToCart} isOpen={isAddToCartModalOpen} onClose={closeAddToCartModal} />
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


