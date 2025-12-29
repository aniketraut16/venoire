"use client";
import { DetailedOrder } from "@/types/orders";
import { X, Star, CheckCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DetailedOrder;
  onConfirm: (reviewsMap: Record<string, { rating: number; comment: string }>) => Promise<void>;
  existingReviews?: Set<string>;
}

export default function ReviewModal({
  isOpen,
  onClose,
  order,
  onConfirm,
  existingReviews = new Set(),
}: ReviewModalProps) {
  const [reviewsMap, setReviewsMap] = useState<
    Record<string, { rating: number; comment: string }>
  >({});
  const [hoveredRatings, setHoveredRatings] = useState<Record<string, number>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

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
    await onConfirm(reviewsMap);
    setIsSubmitting(false);
    setReviewsMap({});
    setHoveredRatings({});
  };

  const handleClose = () => {
    setReviewsMap({});
    setHoveredRatings({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full md:w-full md:max-w-3xl max-h-[90vh] md:rounded-xl shadow-2xl flex flex-col animate-slide-up md:animate-none rounded-t-2xl md:rounded-t-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg md:text-2xl font-light tracking-wide uppercase">
              Write Reviews
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Order #{order.order_number}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6 overflow-y-auto flex-1">
          <p className="text-sm text-gray-600">
            Rate the products from your order. Your reviews help other customers
            make informed decisions.
          </p>

          <div className="space-y-4">
            {order.items.map((item) => {
              const productId = item.product_id || item.product_variant_id;
              const hasReview = existingReviews.has(productId);
              const currentRating = reviewsMap[productId]?.rating || 0;
              const currentComment = reviewsMap[productId]?.comment || "";
              const hoveredRating = hoveredRatings[productId] || 0;

              return (
                <div
                  key={item.id}
                  className={`border border-gray-200 p-4 ${
                    hasReview ? "bg-gray-50 opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-gray-100 border border-gray-200">
                      <img
                        src={item.thumbnail_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.variant}</p>
                      {hasReview && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle size={12} />
                          Already reviewed
                        </p>
                      )}
                    </div>
                  </div>

                  {!hasReview && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">
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
                                className="transition-transform hover:scale-110"
                              >
                                <Star
                                  size={24}
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
                            <span className="ml-2 text-sm text-gray-600">
                              {currentRating} of 5 stars
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">
                          Review (Optional)
                        </label>
                        <textarea
                          value={currentComment}
                          onChange={(e) =>
                            handleCommentChange(productId, e.target.value)
                          }
                          rows={3}
                          maxLength={500}
                          className="w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none transition-colors resize-none text-sm"
                          placeholder="Share your experience with this product..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {currentComment.length}/500 characters
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 border border-gray-300 text-gray-700 px-4 md:px-6 py-2 md:py-3 hover:bg-gray-100 transition-colors duration-200 uppercase tracking-wider text-sm disabled:opacity-50"
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
              className="flex-1 bg-black text-white px-4 md:px-6 py-2 md:py-3 hover:bg-gray-900 transition-colors duration-200 uppercase tracking-wider text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Reviews"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
