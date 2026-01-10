"use client";
import { X, Star } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getReviewableItemsfromOrder } from "@/utils/orders";
import { ReviewableItem } from "@/types/orders";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  token: string;
  onConfirm: (reviewsMap: Record<string, { rating: number; comment: string }>) => Promise<void>;
}

export default function ReviewModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  token,
  onConfirm,
}: ReviewModalProps) {
  const [reviewableItems, setReviewableItems] = useState<ReviewableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewsMap, setReviewsMap] = useState<
    Record<string, { rating: number; comment: string }>
  >({});
  const [hoveredRatings, setHoveredRatings] = useState<Record<string, number>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mount animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      loadReviewableItems();
    } else {
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const loadReviewableItems = async () => {
    setIsLoading(true);
    try {
      const response = await getReviewableItemsfromOrder(orderId, token);
      if (response.success) {
        setReviewableItems(response.data);
      } else {
        toast.error("Failed to load reviewable items");
      }
    } catch (error) {
      console.error("Error loading reviewable items:", error);
      toast.error("Failed to load reviewable items");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  const handleRatingChange = (productId: string, rating: number) => {
    setReviewsMap((prev) => ({
      ...prev,
      [productId]: {
        rating,
        comment: prev[productId]?.comment || "",
      },
    }));
  };

  const handleCommentChange = (productId: string, comment: string) => {
    setReviewsMap((prev) => ({
      ...prev,
      [productId]: {
        rating: prev[productId]?.rating || 0,
        comment,
      },
    }));
  };

  const handleSubmit = async () => {
    const hasAnyRating = Object.values(reviewsMap).some((r) => r.rating > 0);
    if (!hasAnyRating) {
      toast.error("Please rate at least one product before submitting", {
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(reviewsMap);
      setReviewsMap({});
      setHoveredRatings({});
    } catch (error) {
      console.error("Error submitting reviews:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReviewsMap({});
    setHoveredRatings({});
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        data-lenis-prevent="true"
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Review Modal - Desktop centered, Mobile bottom sheet */}
      <div className="fixed inset-0 z-[10000] flex md:items-center items-end justify-center md:p-4 p-0 pointer-events-none">
        <div
          className={`bg-white w-full md:max-w-3xl overflow-hidden transition-all duration-300 ease-out pointer-events-auto
            md:rounded-xl md:max-h-[90vh] shadow-2xl
            rounded-t-3xl max-h-[92vh]
            ${isOpen ? 'md:translate-y-0 md:opacity-100 translate-y-0 opacity-100' : 'md:translate-y-4 md:opacity-0 translate-y-full opacity-0'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle for Mobile */}
          <div className="md:hidden flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 md:px-6 md:py-5 flex justify-between items-center z-10">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                Write Reviews
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Order #{orderNumber}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div
            data-lenis-prevent="true"
            className="overflow-y-auto overscroll-contain md:max-h-[calc(90vh-160px)] max-h-[calc(92vh-170px)] px-5 py-5 md:px-6 md:py-6"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black"></div>
              </div>
            ) : reviewableItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No items to review</h3>
                <p className="text-gray-600 text-sm max-w-sm mx-auto">
                  All items from this order have already been reviewed.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-6">
                  Rate the products from your order. Your reviews help other customers
                  make informed decisions.
                </p>

                <div className="space-y-4">
                  {reviewableItems.map((item) => {
                    const productId = item.product_id;
                    const currentRating = reviewsMap[productId]?.rating || 0;
                    const currentComment = reviewsMap[productId]?.comment || "";
                    const hoveredRating = hoveredRatings[productId] || 0;

                    return (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                            <img
                              src={item.product_thumbnail || '/dummy.jpg'}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/dummy.jpg'
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 line-clamp-2">
                              {item.product_name}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">
                              Rating *
                            </label>
                            <div className="flex items-center gap-2">
                              {Array.from({ length: 5 }).map((_, index) => {
                                const starValue = index + 1;
                                return (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() =>
                                      handleRatingChange(productId, starValue)
                                    }
                                    onMouseEnter={() =>
                                      setHoveredRatings((prev) => ({
                                        ...prev,
                                        [productId]: starValue,
                                      }))
                                    }
                                    onMouseLeave={() =>
                                      setHoveredRatings((prev) => ({
                                        ...prev,
                                        [productId]: 0,
                                      }))
                                    }
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                  >
                                    <Star
                                      size={28}
                                      className={
                                        starValue <= (hoveredRating || currentRating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }
                                    />
                                  </button>
                                );
                              })}
                              {currentRating > 0 && (
                                <span className="ml-2 text-sm font-medium text-gray-700">
                                  {currentRating} of 5 stars
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">
                              Review (Optional)
                            </label>
                            <textarea
                              value={currentComment}
                              onChange={(e) =>
                                handleCommentChange(productId, e.target.value)
                              }
                              rows={3}
                              maxLength={500}
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none text-sm"
                              placeholder="Share your experience with this product..."
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              {currentComment.length}/500 characters
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          {!isLoading && reviewableItems.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 md:px-6 md:py-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    Object.keys(reviewsMap).length === 0 ||
                    Object.values(reviewsMap).every((r) => r.rating === 0) ||
                    isSubmitting
                  }
                  className="flex-1 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all duration-200 font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Reviews"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
