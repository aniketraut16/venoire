"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  validateCoupon,
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
  appliedCouponCode: string | null;
  isCouponApplying: boolean;
  fetchCart: (pinCode?: string | null, couponCode?: string | null) => Promise<void>;
  addToCart: (args: AddToCartArgs) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  updateCartItem: (itemId: string, args: AddToCartArgs) => Promise<boolean>;
  moveToWishlist: (item: CartItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => Promise<void>;
  openAddToCartModal: (
    params: AddTOCartModalParams,
    mode?: "add" | "added",
    preSelectedVariantId?: string,
    preSelectedQuantity?: number
  ) => void;
  closeAddToCartModal: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, dbUser } = useAuth();
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
  const [preSelectedQuantity, setPreSelectedQuantity] = useState<number>(1);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(false);
  const [lastPinCode, setLastPinCode] = useState<string | null>(null);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [isCouponApplying, setIsCouponApplying] = useState<boolean>(false);
  const prevTokenRef = useRef<string | null>(null);
  const hasMergedRef = useRef<boolean>(false);
  const { startLoading, stopLoading } = useLoading();

  const openAddToCartModal = useCallback(
    (
      params: AddTOCartModalParams,
      mode?: "add" | "added",
      preSelectedVariantId?: string,
      preSelectedQuantity?: number
    ) => {
      setModalMode(mode || "add");
      setPreSelectedVariantId(preSelectedVariantId);
      setPreSelectedQuantity(preSelectedQuantity || 1);
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
    setPreSelectedQuantity(1);
  }, []);

  const fetchCart = useCallback(async (pinCode?: string | null, couponCode?: string | null) => {
    setIsCartLoading(true);
    try {
      const pinCodeToUse = pinCode !== undefined ? pinCode : lastPinCode;
      const couponCodeToUse = couponCode !== undefined ? couponCode : appliedCouponCode;
      const fetched: CartApiResponse = await getCart(token ?? null, pinCodeToUse, couponCodeToUse);
      if (fetched.success) {
        setCartItems(fetched.cartItems);
        setPricing(fetched.pricing);
        setCartId(fetched.cartId ?? "");
        const newCount = fetched.cartItems.reduce(
          (sum, item) => sum + (item.quantity ?? 0),
          0
        );
        setCount(newCount);
        if (pinCode !== undefined) {
          setLastPinCode(pinCode);
        }
        if (couponCode !== undefined) {
          setAppliedCouponCode(couponCode);
        }
      } else {
        setCartItems([]);
        setPricing(null);
        setCartId("");
        setCount(0);
      }
    } finally {
      setIsCartLoading(false);
    }
  }, [token, lastPinCode, appliedCouponCode]);

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

  const applyCoupon = useCallback(
    async (couponCode: string): Promise<{ success: boolean; message: string }> => {
      if (!couponCode || couponCode.trim() === "") {
        return { success: false, message: "Please enter a coupon code" };
      }
      
      setIsCouponApplying(true);
      try {
        const result = await validateCoupon(couponCode.trim().toUpperCase(), token ?? null, lastPinCode);
        if (result.success) {
          setAppliedCouponCode(couponCode.trim().toUpperCase());
          await fetchCart(undefined, couponCode.trim().toUpperCase());
          toast.success("Coupon applied successfully!");
          return { success: true, message: "Coupon applied successfully" };
        } else {
          return { success: false, message: result.message };
        }
      } catch (error: any) {
        const errorMessage = error?.message || "Failed to apply coupon";
        return { success: false, message: errorMessage };
      } finally {
        setIsCouponApplying(false);
      }
    },
    [token, lastPinCode, fetchCart]
  );

  const removeCoupon = useCallback(
    async (): Promise<void> => {
      setAppliedCouponCode(null);
      await fetchCart(undefined, null);
      toast.success("Coupon removed");
    },
    [fetchCart]
  );

  useEffect(() => {
    const initializeCart = async () => {
      const userJustBecameAvailable = token && dbUser && !hasMergedRef.current;
      
      if (!token) {
        hasMergedRef.current = false;
        prevTokenRef.current = null;
      }
      
      if (token !== prevTokenRef.current) {
        prevTokenRef.current = token;
      }

      startLoading();
      try {
        if (userJustBecameAvailable) {
          await mergeCartAfterLoginApi(token);
          hasMergedRef.current = true;
        }
        await fetchCart();
      } catch (error) {
        console.error("Error initializing cart:", error);
      } finally {
        stopLoading();
      }
    };

    initializeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dbUser]);

  const value = useMemo<CartContextType>(
    () => ({
      count,
      cartId,
      cartItems,
      pricing,
      isCartLoading,
      appliedCouponCode,
      isCouponApplying,
      fetchCart,
      addToCart,
      removeFromCart,
      updateCartItem,
      moveToWishlist,
      removeFromWishlist,
      addToWishlist,
      applyCoupon,
      removeCoupon,
      openAddToCartModal,
      closeAddToCartModal,
    }),
    [
      count,
      cartId,
      cartItems,
      pricing,
      isCartLoading,
      appliedCouponCode,
      isCouponApplying,
      fetchCart,
      addToCart,
      removeFromCart,
      updateCartItem,
      moveToWishlist,
      removeFromWishlist,
      addToWishlist,
      applyCoupon,
      removeCoupon,
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
        preSelectedQuantity={preSelectedQuantity}
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
