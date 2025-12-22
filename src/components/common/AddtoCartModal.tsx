"use client";

import { AddToCartArgs, AddTOCartModalParams } from "@/types/cart";
import { useState, useEffect } from "react";

export default function AddtoCartModal({
  modalParams,
  addToCart,
  isOpen,
  onClose,
}: {
  modalParams: AddTOCartModalParams | null;
  addToCart: (args: AddToCartArgs) => Promise<boolean>;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && modalParams?.productVariants.length) {
      setSelectedVariantId(modalParams.productVariants[0].id);
      setQuantity(1);
    }
  }, [isOpen, modalParams]);

  if (!isOpen || !modalParams) return null;

  const selectedVariant = modalParams.productVariants.find(
    (v) => v.id === selectedVariantId
  );

  const hasDiscount =
    selectedVariant && selectedVariant.price < selectedVariant.originalPrice;

  const handleAddToCart = async () => {
    if (!selectedVariantId) return;
    setIsAdding(true);
    try {
      const ok = await addToCart({
        productVariantId: selectedVariantId,
        quantity,
      });
      if (ok) onClose();
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-2xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col absolute bottom-0 md:relative md:bottom-auto animate-[slideUp_0.3s_ease-out] md:animate-none rounded-t-2xl md:rounded-b-xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: 'calc(100vh - 60px)',
        }}
      >
        {/* Drag Indicator - Mobile Only */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold text-gray-900">Select Options</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto">
          <div className="flex flex-col md:grid md:grid-cols-[160px_1fr] gap-4 md:gap-6">
            {/* Product Image */}
            <div className="flex md:block gap-4">
              <div className="w-24 md:w-full flex-shrink-0">
                <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
                  <img
                    src={modalParams.productImage}
                    alt={modalParams.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Name & Price - Mobile (beside image) */}
              <div className="md:hidden flex-1">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {modalParams.productName}
                </h3>

                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{selectedVariant?.price.toLocaleString("en-IN")}
                  </span>

                  {hasDiscount && (
                    <>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{selectedVariant?.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
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
                  <div className="inline-block mt-1.5">
                    <span className="text-[9px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      {selectedVariant.badgeText}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Product Name & Price - Desktop Only */}
              <div className="hidden md:block">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalParams.productName}
                </h3>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{selectedVariant?.price.toLocaleString("en-IN")}
                  </span>

                  {hasDiscount && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{selectedVariant?.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
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
                  <div className="inline-block mt-2">
                    <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                      {selectedVariant.badgeText}
                    </span>
                  </div>
                )}
              </div>

              {/* Variants & Quantity */}
              <div className="border rounded-lg p-3 md:p-4 space-y-3 md:space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    {modalParams.productType === "clothing"
                      ? "Select Size"
                      : "Select Volume"}
                  </p>

                  <div className="grid grid-cols-4 gap-2">
                    {modalParams.productVariants.map((variant) => {
                      const isSelected = variant.id === selectedVariantId;
                      const variantHasDiscount =
                        variant.price < variant.originalPrice;

                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`relative p-2 rounded-lg border text-xs md:text-sm font-semibold transition ${
                            isSelected
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {modalParams.productType === "clothing"
                            ? variant.size
                            : variant.ml_volume}

                          {variantHasDiscount && (
                            <span
                              className={`absolute -top-1 -right-1 text-[9px] md:text-[10px] font-bold px-1 rounded-full ${
                                isSelected
                                  ? "bg-green-500 text-white"
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

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Quantity
                  </p>

                  <div className="flex items-center gap-2 md:gap-3">
                    <button
                      onClick={() =>
                        setQuantity((q) => (q > 1 ? q - 1 : 1))
                      }
                      disabled={quantity <= 1}
                      className="w-8 h-8 md:w-9 md:h-9 rounded-lg border flex items-center justify-center text-lg disabled:opacity-50"
                    >
                      −
                    </button>

                    <div className="w-10 h-8 md:w-12 md:h-9 flex items-center justify-center border rounded-lg font-semibold text-sm">
                      {quantity}
                    </div>

                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 md:w-9 md:h-9 rounded-lg border flex items-center justify-center text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtotal */}
              <div className="bg-gray-50 border rounded-lg p-3 md:p-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm text-gray-600">Subtotal</span>
                  <span className="text-lg md:text-xl font-bold text-gray-900">
                    ₹
                    {(
                      (selectedVariant?.price || 0) * quantity
                    ).toLocaleString("en-IN")}
                  </span>
                </div>

                {hasDiscount && (
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] md:text-xs text-gray-500">You save</span>
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
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-3 md:p-4 flex gap-2 md:gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border text-xs md:text-sm font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 py-2.5 rounded-lg bg-black text-white text-xs md:text-sm font-semibold disabled:opacity-50 hover:bg-gray-800 transition"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
