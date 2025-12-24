"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  AddToCartArgs,
  AddTOCartModalParams,
  CartApiResponse,
  CartItem,
  Pricing,
} from "@/types/cart";
import {
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  updateCartItem as updateCartItemApi,
  mergeCartAfterLogin as mergeCartAfterLoginApi,
  getCart,
} from "@/utils/cart";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "./LoadingContext";
import toast from "react-hot-toast";
import { addOrRemoveFromWishlist } from "@/utils/wishlist";
import AddtoCartModal from "@/components/common/AddtoCartModal";
type CartContextType = {
  cartId: string;
  count: number;
  cartItems: CartItem[];
  pricing: Pricing | null;
  isCartLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (args: AddToCartArgs) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  updateCartItem: (itemId: string, args: AddToCartArgs) => Promise<boolean>;
  moveToWishlist: (item: CartItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  openAddToCartModal: (
    params: AddTOCartModalParams,
    mode?: "add" | "added",
    preSelectedVariantId?: string
  ) => void;
  closeAddToCartModal: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>("");
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [modalParams, setModalParams] = useState<AddTOCartModalParams | null>(
    null
  );
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] =
    useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "added">("add");
  const [preSelectedVariantId, setPreSelectedVariantId] = useState<
    string | undefined
  >(undefined);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(false);
  const { startLoading, stopLoading } = useLoading();

  const openAddToCartModal = useCallback(
    (
      params: AddTOCartModalParams,
      mode?: "add" | "added",
      preSelectedVariantId?: string
    ) => {
      setModalMode(mode || "add");
      setPreSelectedVariantId(preSelectedVariantId);
      setModalParams(params);
      setIsAddToCartModalOpen(true);
    },
    []
  );

  const closeAddToCartModal = useCallback(() => {
    setModalParams(null);
    setIsAddToCartModalOpen(false);
    setModalMode("add");
    setPreSelectedVariantId(undefined);
  }, []);

  const fetchCart = useCallback(async () => {
    setIsCartLoading(true);
    try {
      const fetched: CartApiResponse = await getCart(token ?? null);
      if (fetched.success) {
        setCartItems(fetched.cartItems);
        setPricing(fetched.pricing);
        setCartId(fetched.cartId ?? "");
        const newCount = fetched.cartItems.reduce(
          (sum, item) => sum + (item.quantity ?? 0),
          0
        );
        setCount(newCount);
      } else {
        setCartItems([]);
        setPricing(null);
        setCartId("");
        setCount(0);
      }
    } finally {
      setIsCartLoading(false);
    }
  }, [token]);

  const addToCart = useCallback(
    async (args: AddToCartArgs): Promise<boolean> => {
      startLoading();
      const ok = await addToCartApi(args, token ?? null);
      if (ok.success) {
        await fetchCart();
      } else {
        toast.error(ok.message);
      }
      stopLoading();
      return ok.success;
    },
    [token, fetchCart]
  );

  const removeFromCart = useCallback(
    async (itemId: string): Promise<boolean> => {
      startLoading();
      const ok = await removeFromCartApi(itemId, token ?? null);
      if (ok.success) {
        await fetchCart();
      } else {
        toast.error(ok.message);
      }
      stopLoading();
      return ok.success;
    },
    [token, fetchCart]
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
        await fetchCart();
      } else {
        toast.error(ok.message);
      }
      stopLoading();
      return;
    },
    [token, removeFromCart, fetchCart]
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
        await fetchCart();
      } else {
        toast.error(ok.message);
      }
      stopLoading();
      return ok.success;
    },
    [token, fetchCart]
  );

  useEffect(() => {
    startLoading();
    fetchCart().finally(() => {
      stopLoading();
    });
  }, [fetchCart]);

  useEffect(() => {
    if (!token) return;
    startLoading();
    mergeCartAfterLoginApi(token).finally(() => {
      stopLoading();
    });
  }, [token]);

  const value = useMemo<CartContextType>(
    () => ({
      count,
      cartId,
      cartItems,
      pricing,
      isCartLoading,
      fetchCart,
      addToCart,
      removeFromCart,
      updateCartItem,
      moveToWishlist,
      removeFromWishlist,
      addToWishlist,
      openAddToCartModal,
      closeAddToCartModal,
    }),
    [
      count,
      cartId,
      cartItems,
      pricing,
      isCartLoading,
      fetchCart,
      addToCart,
      removeFromCart,
      updateCartItem,
      moveToWishlist,
      removeFromWishlist,
      addToWishlist,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      <AddtoCartModal
        modalParams={modalParams}
        addToCart={addToCart}
        isOpen={isAddToCartModalOpen}
        onClose={closeAddToCartModal}
        mode={modalMode}
        preSelectedVariantId={preSelectedVariantId}
      />
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
