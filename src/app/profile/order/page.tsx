"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getOrder,
  trackOrder,
  cancelOrder,
  createProductReview,
  requestReturnRefund,
} from "@/utils/orders";
import { DetailedOrder, TrackOrderResponse } from "@/types/orders";
import { useLoading } from "@/contexts/LoadingContext";
import toast from "react-hot-toast";
import {
  X,
  Truck,
  Star,
  XCircle,
  MapPin,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  RefreshCw,
  Package,
} from "lucide-react";
import Link from "next/link";
import CancleOrderModal from "@/components/Order/CancleOrder";
import ReviewModal from "@/components/Order/ReviewModal";
import ReturnRefundModal from "@/components/Order/ReturnRefundModal";

function OrderPageContent() {
  const urlParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const orderId = urlParams.get("orderId");
  const [order, setOrder] = useState<DetailedOrder | null>(null);
  const [trackingData, setTrackingData] = useState<TrackOrderResponse | null>(
    null
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [reviewsMap, setReviewsMap] = useState<
    Record<string, { rating: number; comment: string }>
  >({});
  const [existingReviews, setExistingReviews] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (token && orderId) {
      fetchOrderDetails();
    }
  }, [token, orderId]);

  const fetchOrderDetails = async () => {
    if (!token || !orderId) return;
    startLoading();
    const response = await getOrder(orderId, token);
    if (response.success && response.data) {
      setOrder(response.data);
      // Fetch tracking if order can be tracked
      const canTrack = ["processing", "shipped"].includes(response.data.status);
      if (canTrack) {
        const trackResponse = await trackOrder(orderId, token);
        if (trackResponse.success && trackResponse.data) {
          setTrackingData(trackResponse.data);
        }
      }
    } else {
      toast.error("Failed to load order details");
      router.push("/profile/my-orders");
    }
    stopLoading();
  };

  const handleCancelOrder = async (
    reason: string,
    comments: string,
    itemsToCancel: { id: string; cancelled_quantity: number }[]
  ) => {
    if (!token || !orderId || !order) return;

    // Build payload items with safe cancelled_quantity based on available quantity
    const items = itemsToCancel
      .map((item) => {
        const orderItem = order.items.find((oi) => oi.id === item.id);
        if (!orderItem) return null;

        const alreadyCancelled = orderItem.cancelled_quantity || 0;
        const availableQuantity = orderItem.quantity - alreadyCancelled;

        if (availableQuantity <= 0) {
          return null;
        }

        const requested = item.cancelled_quantity;
        const safeQuantity = Math.max(1, Math.min(requested, availableQuantity));

        if (safeQuantity <= 0) return null;

        return {
          id: orderItem.id,
          cancelled_quantity: safeQuantity,
        };
      })
      .filter((item): item is { id: string; cancelled_quantity: number } => item !== null);

    if (items.length === 0) {
      toast.error("No items are available to cancel for this order.");
      return;
    }

    startLoading();
    const response = await cancelOrder(orderId, token, {
      reason,
      comments,
      items,
    });
    stopLoading();

    if (response.success) {
      const itemCount = items.length;
      const totalItems = order.items.filter((item) => {
        const alreadyCancelled = item.cancelled_quantity || 0;
        const availableQuantity = item.quantity - alreadyCancelled;
        const isCancelled = item.status === "cancelled" || item.status === "returned";
        return !isCancelled && availableQuantity > 0;
      }).length;
      const message =
        itemCount === totalItems
          ? "Order cancelled successfully"
          : `${itemCount} item${
              itemCount !== 1 ? "s" : ""
            } cancelled successfully`;
      toast.success(message, { duration: 3000 });
      setShowCancelModal(false);
      fetchOrderDetails();
    } else {
      toast.error(response.message || "Failed to cancel order", {
        duration: 4000,
      });
    }
  };

  const handleReturnRefund = async (reason: string, comments: string) => {
    if (!token || !orderId) return;
    startLoading();
    const response = await requestReturnRefund(orderId, token, {
      reason,
      comments,
    });
    stopLoading();

    if (response.success) {
      toast.success("Return request submitted successfully", {
        duration: 3000,
      });
      setShowReturnModal(false);
      fetchOrderDetails();
    } else {
      toast.error(response.message || "Failed to submit return request", {
        duration: 4000,
      });
    }
  };

  const handleSubmitReviews = async (
    reviewsMap: Record<string, { rating: number; comment: string }>
  ) => {
    if (!token || !orderId || !order) return;

    const reviewsToSubmit = Object.entries(reviewsMap);
    if (reviewsToSubmit.length === 0) {
      toast.error("Please rate at least one product");
      return;
    }

    startLoading();
    let successCount = 0;
    let errorMessages: string[] = [];

    for (const [productId, reviewData] of reviewsToSubmit) {
      if (existingReviews.has(productId)) continue;

      const response = await createProductReview(token, {
        product_id: productId,
        order_id: order.id,
        rating: reviewData.rating,
        comment: reviewData.comment || undefined,
      });

      if (response.success) {
        successCount++;
      } else {
        if (
          response.message &&
          response.message.toLowerCase().includes("already reviewed")
        ) {
          const productName =
            order.items.find(
              (item) =>
                (item.product_id || item.product_variant_id) === productId
            )?.name || "Product";
          errorMessages.push(`${productName}: Already reviewed`);
        } else {
          errorMessages.push(response.message || "Failed to submit review");
        }
      }
    }

    stopLoading();

    if (successCount > 0) {
      toast.success(
        `${successCount} review(s) submitted successfully! Pending admin approval.`,
        {
          duration: 4000,
        }
      );
    }

    if (errorMessages.length > 0) {
      errorMessages.forEach((msg) => {
        toast.error(msg, { duration: 4000 });
      });
    }

    if (successCount > 0 || errorMessages.length > 0) {
      setShowReviewModal(false);
      setReviewsMap({});
      fetchOrderDetails();
    }
  };


  const canReturnOrder = (order: DetailedOrder) => {
    if (order.status !== "delivered") return false;
    // Check if delivered within last 2 days
    // Find the delivered timestamp from tracking or use updated_at
    const deliveredDate = new Date(order.updated_at);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff <= 2;
  };

  const canReviewOrder = (status: string) => {
    return status === "delivered";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      placed: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-purple-100 text-purple-800 border-purple-200",
      shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      refunded: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status: string, size: number = 20) => {
    const icons: Record<string, React.ReactNode> = {
      placed: <Clock size={size} />,
      processing: <RefreshCw size={size} />,
      shipped: <Truck size={size} />,
      delivered: <CheckCircle size={size} />,
      cancelled: <XCircle size={size} />,
      refunded: <XCircle size={size} />,
    };
    return icons[status] || <Package size={size} />;
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading order details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/profile/my-orders"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-lg md:text-2xl font-light tracking-wide uppercase">
                Order Details
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                {order.order_number}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Order Status and Date */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Order Date
            </p>
            <p className="text-sm">
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Tracking Timeline - Horizontal Flow */}
        {order && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4">
              Tracking Information
            </h2>
            <div className="bg-gray-50 p-4 md:p-6 border border-gray-200">
              {/* Timeline - Horizontal Desktop / Vertical Mobile */}
              {(() => {
                // Determine lifecycle path based on current status
                const currentStatus = order.status;
                const isCancellationPath =
                  currentStatus === "cancelled" || currentStatus === "refunded";

                // Define lifecycle paths
                const defaultPath: string[] = [
                  "placed",
                  "processing",
                  "shipped",
                  "delivered",
                ];
                const cancellationPath: string[] = [
                  "placed",
                  "cancelled",
                  "refunded",
                ];

                // Select the appropriate path
                const lifecycleSteps = isCancellationPath
                  ? cancellationPath
                  : defaultPath;

                // Find current status index in the selected path
                const currentStatusIndex = lifecycleSteps.findIndex(
                  (step) => step === currentStatus
                );

                // Helper to get date for a step
                const getStepDate = (step: string): string | null => {
                  // Try to find date from tracking timeline
                  if (trackingData?.timeline) {
                    const timelineEvent = trackingData.timeline.find(
                      (e) => e.status === step
                    );
                    if (timelineEvent) {
                      return new Date(
                        timelineEvent.timestamp
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }
                  }

                  // Use order created_at for "placed" step
                  if (step === "placed") {
                    return new Date(order.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    );
                  }

                  // For future steps, show estimated date if available
                  if (
                    step === "delivered" &&
                    trackingData?.estimated_delivery
                  ) {
                    return new Date(
                      trackingData.estimated_delivery
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }

                  return null;
                };

                return (
                  <>
                    {/* Desktop: Horizontal Timeline */}
                    <div className="hidden md:block">
                      <div className="relative">
                        {/* Background connecting line */}
                        <div className="absolute top-[30%] left-0 right-0 h-0.5">
                          <div className="h-full bg-gray-200 relative">
                            {/* Completed portion */}
                            {currentStatusIndex >= 0 &&
                              lifecycleSteps.length > 1 && (
                                <div
                                  className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
                                  style={{
                                    width: `${
                                      (currentStatusIndex /
                                        (lifecycleSteps.length - 1)) *
                                      100
                                    }%`,
                                  }}
                                />
                              )}
                          </div>
                        </div>

                        {/* Timeline Steps */}
                        <div className="relative flex items-start justify-between py-6">
                          {lifecycleSteps.map((step, index) => {
                            const isCompleted =
                              currentStatusIndex !== -1 &&
                              index <= currentStatusIndex;
                            const stepDate = getStepDate(step);

                            return (
                              <div
                                key={step}
                                className="relative flex flex-col items-center flex-1"
                              >
                                {/* Icon Circle */}
                                <div
                                  className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                                    isCompleted
                                      ? "bg-green-500 text-white"
                                      : "bg-white border-2 border-gray-300 text-gray-400"
                                  }`}
                                >
                                  {getStatusIcon(step, 22)}
                                </div>

                                {/* Label */}
                                <div className="text-center w-full px-2">
                                  <p
                                    className={`text-sm font-medium mb-1 ${
                                      isCompleted
                                        ? "text-gray-900"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {step
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </p>
                                  {stepDate && (
                                    <p
                                      className={`text-xs ${
                                        isCompleted
                                          ? "text-gray-600"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {stepDate}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Mobile: Vertical Timeline */}
                    <div className="md:hidden space-y-0 py-4">
                      {lifecycleSteps.map((step, index) => {
                        const isLast = index === lifecycleSteps.length - 1;
                        const isCompleted =
                          currentStatusIndex !== -1 &&
                          index <= currentStatusIndex;
                        const stepDate = getStepDate(step);

                        return (
                          <div
                            key={step}
                            className="relative flex items-start pb-8 last:pb-0"
                          >
                            {/* Vertical Line */}
                            {!isLast && (
                              <div className="absolute left-6 top-12 bottom-0 w-0.5">
                                <div
                                  className={`h-full w-full transition-all duration-300 ${
                                    isCompleted ? "bg-green-500" : "bg-gray-200"
                                  }`}
                                />
                              </div>
                            )}

                            {/* Icon Circle */}
                            <div
                              className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                                isCompleted
                                  ? "bg-yellow-500 text-white"
                                  : "bg-white border-2 border-gray-300 text-gray-400"
                              }`}
                            >
                              {getStatusIcon(step, 20)}
                            </div>

                            {/* Content */}
                            <div className="ml-4 flex-1 pt-1">
                              <p
                                className={`text-sm font-medium mb-1 ${
                                  isCompleted
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {step
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </p>
                              {stepDate && (
                                <p
                                  className={`text-xs ${
                                    isCompleted
                                      ? "text-gray-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {stepDate}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider mb-4">
            Order Items
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => {
              const isCancelled = item.status === "cancelled";
              const isReturned = item.status === "returned";

              return (
                <div
                  key={item.id}
                  className={`flex items-center space-x-4 p-4 border relative ${
                    isCancelled
                      ? "border-red-200 bg-red-50/30"
                      : isReturned
                      ? "border-orange-200 bg-orange-50/30"
                      : "border-gray-200"
                  }`}
                >
                  {/* Status Badge */}
                  {(isCancelled || isReturned) && (
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          isCancelled
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {isCancelled ? "Cancelled" : "Returned"}
                      </span>
                    </div>
                  )}

                  <div
                    className={`w-20 h-20 shrink-0 bg-gray-100 border border-gray-200 relative ${
                      isCancelled || isReturned ? "opacity-60" : ""
                    }`}
                  >
                    <img
                      src={item.thumbnail_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {(isCancelled || isReturned) && (
                      <div className="absolute inset-0 bg-black/10"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        isCancelled || isReturned
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {item.name}
                    </p>
                    <p
                      className={`text-sm ${
                        isCancelled || isReturned
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {item.variant}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isCancelled || isReturned
                          ? "text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      Quantity:{" "}
                      {item.cancelled_quantity && item.cancelled_quantity > 0 ? (
                        <>
                          <span className="text-gray-900 font-semibold">
                            {item.quantity - item.cancelled_quantity}
                          </span>
                          <span className="ml-2 text-xs text-red-500 font-medium">
                            ({item.cancelled_quantity} cancelled)
                          </span>
                        </>
                      ) : (
                        <span className="font-medium">{item.quantity}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        isCancelled || isReturned
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      ₹{ item.cancelled_quantity ? Number(item.total_price) - Number(item.unit_price) * item.cancelled_quantity : Number(item.total_price).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p
                        className={`text-xs ${
                          isCancelled || isReturned
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        ₹{Number(item.unit_price).toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Order Actions List */}
        <div className="md:hidden">
          <div className="bg-white">
            <div className="py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Order Actions
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {/* Return/Refund Action */}
              {canReturnOrder(order) && (
                <button
                  onClick={() => setShowReturnModal(true)}
                  className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-900">Return / Refund</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              )}

              {/* Write Review Action */}
              {canReviewOrder(order.status) && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-900">Write Review</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              )}

              {/* Cancel Order Action */}
              {order.can_cancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-900">Cancel Order</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              )}
            </div>

            {/* Order Information */}
            <div className="py-3 space-y-2 border-t border-gray-200">
              {canReturnOrder(order) && (
                <p className="text-xs text-gray-600">
                  Return window closes on{" "}
                  {(() => {
                    const deliveredDate = new Date(order.updated_at);
                    const returnDeadline = new Date(deliveredDate);
                    returnDeadline.setDate(returnDeadline.getDate() + 2);
                    return returnDeadline.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  })()}
                </p>
              )}

              {/* Message for processing/shipped orders */}
              { !order.can_cancel && (
                <p className="text-xs text-gray-600">
                  The order cancellation window is over. You can't cancel the
                  order. You may return it after you receive the delivery.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h2 className="text-xs md:text-sm font-medium uppercase tracking-wider mb-3 flex items-center space-x-2">
              <MapPin size={16} />
              <span>Shipping Address</span>
            </h2>
            <div className="bg-gray-50 p-3 md:p-4 border-l-2 border-black">
              <p className="text-xs md:text-sm text-gray-900">
                {order.shipping_address.address_line1}
              </p>
              {order.shipping_address.address_line2 && (
                <p className="text-xs md:text-sm text-gray-900">
                  {order.shipping_address.address_line2}
                </p>
              )}
              <p className="text-xs md:text-sm text-gray-900">
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postal_code}
              </p>
              <p className="text-xs md:text-sm text-gray-900">
                {order.shipping_address.country}
              </p>
            </div>
          </div>

          <div className="hidden md:block">
            <h2 className="text-xs md:text-sm font-medium uppercase tracking-wider mb-3 flex items-center space-x-2">
              <MapPin size={16} />
              <span>Billing Address</span>
            </h2>
            <div className="bg-gray-50 p-3 md:p-4 border-l-2 border-black">
              <p className="text-xs md:text-sm text-gray-900">
                {order.billing_address.address_line1}
              </p>
              {order.billing_address.address_line2 && (
                <p className="text-xs md:text-sm text-gray-900">
                  {order.billing_address.address_line2}
                </p>
              )}
              <p className="text-xs md:text-sm text-gray-900">
                {order.billing_address.city}, {order.billing_address.state}{" "}
                {order.billing_address.postal_code}
              </p>
              <p className="text-xs md:text-sm text-gray-900">
                {order.billing_address.country}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h2 className="text-xs md:text-sm font-medium uppercase tracking-wider mb-3 flex items-center space-x-2">
            <CreditCard size={16} />
            <span>Payment Information</span>
          </h2>
          <div className="bg-gray-50 p-3 md:p-4 border-l-2 border-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Payment Method
                </p>
                <p className="text-xs md:text-sm text-gray-900 capitalize">
                  {order.payment.payment_method.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Payment Status
                </p>
                <p className="text-xs md:text-sm text-gray-900 capitalize">
                  {order.payment.payment_status}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Transaction ID
                </p>
                <p className="text-xs md:text-sm text-gray-900 font-mono break-all">
                  {order.payment.transaction_id}
                </p>
              </div>
              {order.payment.paid_at && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Paid At
                  </p>
                  <p className="text-xs md:text-sm text-gray-900">
                    {new Date(order.payment.paid_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider mb-3">
            Order Summary
          </h2>
          <div className="bg-gray-50 p-4 space-y-2 border-l-2 border-black">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">
                ₹{parseFloat(order.subtotal).toFixed(2)}
              </span>
            </div>
            {parseFloat(order.discount_amount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">
                  -₹{parseFloat(order.discount_amount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">
                ₹{parseFloat(order.tax_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">
                ₹{parseFloat(order.shipping_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-300">
              <span className="text-gray-900 uppercase tracking-wider">
                Total
              </span>
              <span className="text-gray-900">
                ₹{parseFloat(order.total_amount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Refund Information */}
        {(Array.isArray(order.refund) && order.refund.length > 0) ||
          (order.payment.refund_status &&
            order.payment.refund_status !== "not_applicable") ? (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-3">
              Refund Information
            </h2>
            <div className="bg-amber-50 p-4 border-l-2 border-amber-600 space-y-6">
              {/* Display all refund records */}
              {Array.isArray(order.refund) && order.refund.length > 0 ? (
                order.refund.map((refund, idx) =>
                  refund ? (
                    <div key={refund.id || idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-amber-200 pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Refund Status
                        </p>
                        <p className="text-sm text-gray-900 capitalize">
                          {(refund.refund_status || "")
                            .replace(/_/g, " ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Refund Amount
                        </p>
                        <p className="text-sm text-gray-900 font-medium">
                          ₹{parseFloat(refund.refund_amount || "0").toFixed(2)}
                        </p>
                      </div>
                      {refund.refund_transaction_id && (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Refund Transaction ID
                          </p>
                          <p className="text-sm text-gray-900 font-mono break-all">
                            {refund.refund_transaction_id}
                          </p>
                        </div>
                      )}
                      {refund.refund_initiated_at && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Refund Initiated At
                          </p>
                          <p className="text-sm text-gray-900">
                            {new Date(refund.refund_initiated_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                      {refund.refund_completed_at && refund.refund_status === "refunded" && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Refund Completed At
                          </p>
                          <p className="text-sm text-gray-900">
                            {new Date(refund.refund_completed_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                      {refund.refund_reason && (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Refund Reason
                          </p>
                          <p className="text-sm text-gray-900 capitalize">
                            {(refund.refund_reason || "").replace(/_/g, " ")}
                          </p>
                        </div>
                      )}
                      {refund.refund_notes && (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Refund Notes
                          </p>
                          <p className="text-sm text-gray-900">
                            {refund.refund_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null
                )
              ) : (
                // Fallback (display payment refund if present)
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Refund Status
                    </p>
                    <p className="text-sm text-gray-900 capitalize">
                      {(order.payment.refund_status || "").replace(/_/g, " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Refund Amount
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      ₹{parseFloat(order.payment.refund_amount || "0").toFixed(2)}
                    </p>
                  </div>
                  {order.payment.refund_transaction_id && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Refund Transaction ID
                      </p>
                      <p className="text-sm text-gray-900 font-mono break-all">
                        {order.payment.refund_transaction_id}
                      </p>
                    </div>
                  )}
                  {order.payment.refund_initiated_at && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Refund Initiated At
                      </p>
                      <p className="text-sm text-gray-900">
                        {new Date(order.payment.refund_initiated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                  {order.payment.refund_completed_at && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Refund Completed At
                      </p>
                      <p className="text-sm text-gray-900">
                        {new Date(order.payment.refund_completed_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                  {order.payment.refund_reason && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Refund Reason
                      </p>
                      <p className="text-sm text-gray-900 capitalize">
                        {(order.payment.refund_reason || "").replace(/_/g, " ")}
                      </p>
                    </div>
                  )}
                  {order.payment.refund_notes && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Refund Notes
                      </p>
                      <p className="text-sm text-gray-900">
                        {order.payment.refund_notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Order Notes */}
        {order.notes && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-3">
              Order Notes
            </h2>
            <div className="bg-gray-50 p-4 border-l-2 border-black">
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          </div>
        )}

        {/* Action Buttons - Desktop Only */}
        <div className="hidden md:flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          {canReturnOrder(order) && (
            <button
              onClick={() => setShowReturnModal(true)}
              className="flex-1 border border-orange-600 text-orange-600 px-4 md:px-6 py-2 md:py-3 hover:bg-orange-50 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <XCircle size={16} />
              <span className="text-sm uppercase tracking-wider">
                Return / Refund
              </span>
            </button>
          )}
          {canReviewOrder(order.status) && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="flex-1 border border-gray-300 text-gray-700 px-4 md:px-6 py-2 md:py-3 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Star size={16} />
              <span className="text-sm uppercase tracking-wider">
                Write Review
              </span>
            </button>
          )}
          {order.can_cancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex-1 border border-red-600 text-red-600 px-4 md:px-6 py-2 md:py-3 hover:bg-red-50 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <XCircle size={16} />
              <span className="text-sm uppercase tracking-wider">
                Cancel Order
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      {order && (
        <CancleOrderModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          order={order}
          onConfirm={handleCancelOrder}
        />
      )}

      {/* Review Modal */}
      {order && token && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setReviewsMap({});
          }}
          orderId={order.id}
          orderNumber={order.order_number}
          token={token}
          onConfirm={handleSubmitReviews}
        />
      )}

      {/* Return/Refund Modal */}
      {order && (
        <ReturnRefundModal
          isOpen={showReturnModal}
          onClose={() => setShowReturnModal(false)}
          order={order}
          onConfirm={handleReturnRefund}
        />
      )}
    </div>
  );
}

function OrderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderPageContent />
    </Suspense>
  );
}

export default OrderPage;
