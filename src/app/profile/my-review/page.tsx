"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getUserReviews } from "@/utils/orders";
import { Review } from "@/types/orders";
import { Star, Package, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
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
  const { startLoading, stopLoading } = useLoading();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_reviews: 0,
    per_page: 10,
    has_next: false,
    has_prev: false,
  });

  useEffect(() => {
    if (token) {
      fetchReviews(1);
    }
  }, [token]);

  useEffect(() => {
    if (token && currentPage > 1) {
      fetchReviews(currentPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const fetchReviews = async (page: number = 1) => {
    if (!token) return;
    startLoading();
    const response = await getUserReviews(token, page, 10);
    if (response.success) {
      setReviews(response.data);
      setPagination(response.pagination);
    }
    stopLoading();
  };

  return (
    <div className="bg-white lg:border lg:border-gray-200 p-4 md:p-8">
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <button
            onClick={() => router.push("/profile")}
            className="lg:hidden p-2 hover:bg-gray-100 transition-colors duration-200 border border-gray-300"
            aria-label="Back to profile"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl md:text-2xl font-light tracking-wide uppercase">My Reviews</h2>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Your product reviews will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-gray-100 border border-gray-200">
                      {review.product_thumbnail && (
                        <img
                          src={review.product_thumbnail}
                          alt={review.product_name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-medium text-gray-900 text-base md:text-lg">
                          {review.product_name}
                        </h3>
                        {review.order_number && (
                          <p className="text-xs text-gray-500 mt-1">
                            Order #{review.order_number}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {review.rating} out of 5
                        </span>
                      </div>

                      {review.comment && (
                        <div className="bg-gray-50 p-3 border-l-2 border-gray-900">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>
                            {new Date(review.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          {review.is_approved ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle size={12} />
                              Approved
                            </span>
                          ) : (
                            <span className="text-amber-600">Pending approval</span>
                          )}
                        </div>

                        {review.product_slug && (
                          <button
                            onClick={() => router.push(`/product/${review.product_slug}`)}
                            className="text-xs uppercase tracking-wider text-gray-700 hover:text-black transition-colors underline"
                          >
                            View Product
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {reviews.length > 0 && pagination.total_pages > 1 && (
          <div className="mt-6 md:mt-8 flex flex-col gap-4 border-t border-gray-200 pt-4 md:pt-6">
            <div className="text-xs md:text-sm text-gray-600 text-center md:text-left">
              Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_reviews} total reviews)
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={!pagination.has_prev}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 border border-gray-300 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <ChevronLeft size={16} />
                <span className="text-sm uppercase tracking-wider">Previous</span>
              </button>

              <div className="hidden sm:flex items-center space-x-1">
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                  .filter((page) => {
                    const current = pagination.current_page;
                    return (
                      page === 1 ||
                      page === pagination.total_pages ||
                      (page >= current - 1 && page <= current + 1)
                    );
                  })
                  .map((page, index, array) => {
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="px-3 py-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[40px] px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                            page === pagination.current_page
                              ? "bg-black text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!pagination.has_next}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 border border-gray-300 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <span className="text-sm uppercase tracking-wider">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
