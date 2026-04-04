"use client";

import { AddToCartArgs, AddTOCartModalParams } from "@/types/cart";
import { useState, useEffect } from "react";
import { getSimilarPerfumes } from "@/utils/perfume";
import { getSimilarProducts } from "@/utils/products";
import { Perfume } from "@/types/perfume";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";

export default function AddtoCartModal({
  modalParams,
  addToCart,
  isOpen,
  onClose,
  mode,
  preSelectedVariantId,
}: {
  modalParams: AddTOCartModalParams | null;
  addToCart: (args: AddToCartArgs) => Promise<boolean>;
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "added";
  preSelectedVariantId?: string;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [similarProducts, setSimilarProducts] = useState<(Perfume | Product)[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && modalParams?.productVariants.length) {
      setSelectedVariantId(preSelectedVariantId || modalParams.productVariants[0].id);
      setQuantity(1);
      setShowSuccess(false);
      setSimilarProducts([]);
    }
  }, [isOpen, modalParams, preSelectedVariantId]);

  useEffect(() => {
    if (mode === "added" && isOpen && modalParams) {
      setShowSuccess(true);
      fetchSimilarProducts();
    }
  }, [mode, isOpen, modalParams]);

  if (!isOpen || !modalParams || (mode === "added" && !preSelectedVariantId))
    return null;

  const selectedVariant = modalParams.productVariants.find(
    (v) => v.id === selectedVariantId
  );

  const hasDiscount =
    selectedVariant && selectedVariant.price < selectedVariant.originalPrice;

  const fetchSimilarProducts = async () => {
    setLoadingSimilar(true);
    try {
      if (modalParams.productType === "perfume") {
        const perfumes = await getSimilarPerfumes(modalParams.productId);
        setSimilarProducts(perfumes.slice(0, 3));
      } else {
        const response = await getSimilarProducts(modalParams.productId);
        if (response.success) {
          setSimilarProducts(response.data.slice(0, 3));
        }
      }
    } catch (error) {
      console.error("Error fetching similar products:", error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariantId) return;
    setIsAdding(true);
    try {
      const ok = await addToCart({
        productVariantId: selectedVariantId,
        quantity,
      });
      if (ok) {
        setShowSuccess(true);
        fetchSimilarProducts();
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleCheckout = () => {
    router.push(`/cart?from=add-to-cart&checkoutmodal=true`);
    onClose();
  };

  const getVariantInfo = () => {
    if (!selectedVariant) return "";
    if (modalParams.productType === "clothing") {
      return `Size: ${selectedVariant.size}`;
    }
    return `Volume: ${selectedVariant.ml_volume}`;
  };

  // Success View
  if (showSuccess) {
    return (
      <div
        className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4"
        onClick={onClose}
      >
        <div
        
          className="bg-white w-full md:max-w-2xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col absolute bottom-0 md:relative md:bottom-auto animate-[slideUp_0.3s_ease-out] md:animate-none rounded-t-2xl md:rounded-b-xl"
          onClick={(e) => e.stopPropagation()}
           data-lenis-prevent="true"
          style={{
            maxHeight: "calc(100vh - 60px)",
          }}
        >
          {/* Drag Indicator - Mobile Only */}
          <div className="md:hidden flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-4 md:px-6 py-3 md:py-4 border-b flex items-center justify-between">
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              Added to Cart!
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              ✕
            </button>
          </div>

          {/* Success Content */}
          <div className="p-4 md:p-6 overflow-y-auto flex-1">
            {/* Success + Product Info - Single Row */}
            <div className="flex items-center gap-4 md:gap-5 mb-6 animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
              {/* Checkmark */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-50 flex items-center justify-center animate-[scaleIn_0.5s_ease-out]">
                  <svg
                    className="w-6 h-6 md:w-7 md:h-7 text-green-500 animate-[drawCheck_0.5s_ease-out_0.3s_both]"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-full bg-green-400 animate-[ripple_1s_ease-out]" style={{ zIndex: -1 }} />
              </div>

              {/* Product Image */}
              <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={modalParams.productImage}
                  alt={modalParams.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="min-w-0">
                <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2">
                  {modalParams.productName}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                  {getVariantInfo()} • Qty: {quantity}
                </p>
              </div>
            </div>

            {/* Similar Products */}
            <div className="mt-6 animate-[fadeInUp_0.5s_ease-out_0.6s_both]">
              <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-3">
                You May Also Like
              </h4>

              {loadingSimilar ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                </div>
              ) : similarProducts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {similarProducts.map((product) => {
                    const isPerfume = modalParams.productType === "perfume";
                    const productData = product as any;
                    
                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          router.push(
                            isPerfume
                              ? `/perfume/${product.slug}`
                              : `/product/${product.slug}`
                          );
                          onClose();
                        }}
                        className="cursor-pointer group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100 mb-2 group-hover:shadow-md transition">
                          <img
                            src={isPerfume ? productData.coverImage : productData.thumbnail}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h5 className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {product.name}
                        </h5>
                        <p className="text-xs md:text-sm font-bold text-gray-900">
                          ₹
                          {isPerfume
                            ? productData.price[0]?.price.toLocaleString("en-IN")
                            : productData.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No similar products found
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-3 md:p-4 flex gap-2 md:gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border-2 border-blue-900 text-blue-900 text-xs md:text-sm font-semibold hover:bg-blue-50 transition"
            >
              Continue Shopping
            </button>

            <button
              onClick={handleCheckout}
              className="flex-1 py-2.5 rounded-lg bg-yellow-400 text-gray-900 text-xs md:text-sm font-semibold hover:bg-yellow-500 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular Add to Cart View
  return (
    <div
      className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-2xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col absolute bottom-0 md:relative md:bottom-auto animate-[slideUp_0.3s_ease-out] md:animate-none rounded-t-2xl md:rounded-b-xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: "calc(100vh - 60px)",
        }}
      >
        {/* Drag Indicator - Mobile Only */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold text-gray-900">
            Select Options
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          {/* Product Info Row - mirrors success view layout */}
          <div className="flex items-center gap-4 md:gap-5 mb-5">
            {/* Product Image */}
            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={modalParams.productImage}
                alt={modalParams.productName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2">
                {modalParams.productName}
              </h3>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-base md:text-lg font-bold text-blue-900">
                  ₹{selectedVariant?.price.toLocaleString("en-IN")}
                </span>

                {hasDiscount && (
                  <>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{selectedVariant?.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                      {Math.round(
                        ((selectedVariant.originalPrice -
                          selectedVariant.price) /
                          selectedVariant.originalPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>

              {selectedVariant?.badgeText && (
                <div className="inline-block mt-1">
                  <span className="text-[9px] md:text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    {selectedVariant.badgeText}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Variant Selection */}
          <div className="mb-4">
            <p className="text-xs md:text-sm font-semibold text-gray-700 mb-2.5">
              {modalParams.productType === "clothing"
                ? "Select Size"
                : "Select Volume"}
            </p>

            <div className="flex flex-wrap gap-2">
              {modalParams.productVariants.map((variant) => {
                const isSelected = variant.id === selectedVariantId;
                const variantHasDiscount =
                  variant.price < variant.originalPrice;

                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`relative px-4 py-2 md:px-5 md:py-2.5 rounded-lg border-2 text-xs md:text-sm font-semibold transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-900 text-white border-blue-900 shadow-md shadow-blue-900/20"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    {modalParams.productType === "clothing"
                      ? variant.size
                      : variant.ml_volume}

                    {variantHasDiscount && (
                      <span
                        className={`absolute -top-1.5 -right-1.5 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-green-400 text-white"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {Math.round(
                          ((variant.originalPrice - variant.price) /
                            variant.originalPrice) *
                            100
                        )}
                        %
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <p className="text-xs md:text-sm font-semibold text-gray-700 mb-2.5">
              Quantity
            </p>

            <div className="flex items-center gap-0 border-2 border-gray-200 rounded-lg w-fit overflow-hidden">
              <button
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
              >
                −
              </button>

              <div className="w-10 h-9 md:w-12 md:h-10 flex items-center justify-center font-bold text-sm md:text-base text-gray-900 border-x-2 border-gray-200">
                {quantity}
              </div>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-100 rounded-xl p-3.5 md:p-4">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-gray-600">
                Subtotal
              </span>
              <span className="text-lg md:text-xl font-bold text-blue-900">
                ₹
                {((selectedVariant?.price || 0) * quantity).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            {hasDiscount && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] md:text-xs text-gray-500">
                  You save
                </span>
                <span className="text-xs md:text-sm font-semibold text-green-600">
                  ₹
                  {(
                    (selectedVariant.originalPrice -
                      selectedVariant.price) *
                    quantity
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-3 md:p-4 flex gap-2 md:gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border-2 border-blue-900 text-blue-900 text-xs md:text-sm font-semibold hover:bg-blue-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 py-2.5 rounded-lg bg-yellow-400 text-gray-900 text-xs md:text-sm font-semibold disabled:opacity-50 hover:bg-yellow-500 transition shadow-sm"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
