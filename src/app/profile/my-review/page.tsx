"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getOrder,
  getOrderReviews,
  createOrderReview,
} from "@/utils/orders";
import { DetailedOrder, Review, CreateReviewArgs } from "@/types/orders";
import { Star, X, Package, CheckCircle } from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";

export default function MyReviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyReviews />
    </Suspense>
  );
}

function MyReviews() {
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startLoading, stopLoading } = useLoading();

  const [order, setOrder] = useState<DetailedOrder | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] =
    useState<string>("");

  const orderId = searchParams.get("orderId");
  const modalType = searchParams.get("modal");

  useEffect(() => {
    if (token && orderId) {
      fetchOrderAndReviews();
    }
  }, [token, orderId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalType) {
        closeModal();
      }
    };

    if (modalType) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [modalType]);

  const fetchOrderAndReviews = async () => {
    if (!token || !orderId) return;

    startLoading();
    try {
      const [orderResponse, reviewsResponse] = await Promise.all([
        getOrder(orderId, token),
        getOrderReviews(orderId, token),
      ]);

      if (orderResponse.success && orderResponse.data) {
        setOrder(orderResponse.data);
      }

      if (reviewsResponse.success && reviewsResponse.data) {
        setReviews(reviewsResponse.data.reviews);
        setCanReview(reviewsResponse.data.can_review);
      }
    } catch (error) {
      console.error("Error fetching order and reviews:", error);
    } finally {
      stopLoading();
    }
  };

  const openReviewModal = (productId: string) => {
    setSelectedProductForReview(productId);
    router.push(
      `/profile/my-review?orderId=${orderId}&modal=review&productId=${productId}`,
      { scroll: false }
    );
  };

  const closeModal = () => {
    router.push(`/profile/my-review?orderId=${orderId}`, { scroll: false });
    setSelectedProductForReview("");
  };

  const handleReviewSubmit = async (reviewData: CreateReviewArgs) => {
    if (!token || !orderId) return;

    startLoading();
    try {
      const response = await createOrderReview(orderId, token, reviewData);
      if (response.success) {
        await fetchOrderAndReviews();
        closeModal();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      stopLoading();
    }
  };

  if (!orderId) {
    return (
      <div className="bg-white border border-gray-200 p-4 md:p-8">
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No order selected</p>
          <p className="text-sm text-gray-400 mt-2">
            Please select an order to review
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white border border-gray-200 p-4 md:p-8">
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-4 animate-pulse" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-4 md:p-8">
      <div className="max-w-4xl">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-light tracking-wide uppercase">
            Order Reviews
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Order #{order.order_number}
          </p>
          {!canReview && (
            <p className="text-sm text-amber-600 mt-2">
              Reviews are only available for delivered orders
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Products in this order</h3>
            <div className="space-y-4">
              {order.items.map((item) => {
                // Use product_id if available, fallback to product_variant_id
                const productId = item.product_id || item.product_variant_id;
                const existingReview = reviews.find(
                  (r) => r.product_id === productId
                );

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border border-gray-200"
                  >
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 border border-gray-200">
                      <img
                        src={item.thumbnail_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.variant}</p>
                      {existingReview && (
                        <div className="mt-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < existingReview.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          {existingReview.comment && (
                            <p className="text-sm text-gray-600 mt-1">
                              {existingReview.comment}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {existingReview.is_approved ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle size={12} />
                                Approved
                              </span>
                            ) : (
                              <span className="text-amber-600">
                                Pending approval
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      {canReview && !existingReview && (
                        <button
                          onClick={() => openReviewModal(productId)}
                          className="px-4 py-2 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
                        >
                          Write Review
                        </button>
                      )}
                      {existingReview && (
                        <span className="text-xs text-gray-500 uppercase">
                          Reviewed
                        </span>
                      )}
                      {!canReview && !existingReview && (
                        <span className="text-xs text-gray-400 uppercase">
                          Not Available
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {modalType === "review" && selectedProductForReview && (
        <ReviewModal
          productId={selectedProductForReview}
          productName={
            order.items.find(
              (item) =>
                (item.product_variants?.products?.id || item.product_variant_id) ===
                selectedProductForReview
            )?.name || ""
          }
          onClose={closeModal}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}

function ReviewModal({
  productId,
  productName,
  onClose,
  onSubmit,
}: {
  productId: string;
  productName: string;
  onClose: () => void;
  onSubmit: (review: CreateReviewArgs) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    onSubmit({
      product_id: productId,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white max-w-md w-full">
        <div className="border-b border-gray-200 p-4 md:p-6 flex justify-between items-start">
          <div>
            <h3 className="text-lg md:text-xl font-light tracking-wide uppercase">
              Write Review
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              {productName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">
              Rating *
            </label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={
                        starValue <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && `${rating} of 5 stars`}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">
              Review (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors resize-none"
              placeholder="Share your experience with this product..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 md:px-6 py-2 md:py-3 hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0}
              className="flex-1 bg-black text-white px-4 md:px-6 py-2 md:py-3 hover:bg-gray-900 transition-colors uppercase tracking-wider text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
