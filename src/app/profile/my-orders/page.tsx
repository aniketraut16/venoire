"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  getOrders,
  getOrder,
  cancelOrder,
  trackOrder,
  createProductReview,
  requestReturnRefund,
} from "@/utils/orders";
import {
  Order,
  DetailedOrder,
  TrackOrderResponse,
  BuyAgainItems,
} from "@/types/orders";
import toast from "react-hot-toast";
import {
  Package,
  X,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  Star,
  FilterIcon,
  SearchIcon,
} from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";
import CancleOrderModal from "@/components/Order/CancleOrder";
import ReviewModal from "@/components/Order/ReviewModal";
import ReturnRefundModal from "@/components/Order/ReturnRefundModal";

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyOrders />
    </Suspense>
  );
}

function MyOrders() {
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const { startLoading, stopLoading } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at" | "total_amount" | "order_number">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_orders: 0,
    per_page: 10,
    has_next: false,
    has_prev: false,
  });
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(
    null
  );
  const [trackingData, setTrackingData] = useState<TrackOrderResponse | null>(
    null
  );
  const [reviewsMap, setReviewsMap] = useState<
    Record<string, { rating: number; comment: string }>
  >({});
  const [existingReviews, setExistingReviews] = useState<Set<string>>(
    new Set()
  );
  const [isMobile, setIsMobile] = useState(false);
  const buyAgainCarouselRef = useRef<HTMLDivElement>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const modalType = searchParams.get("modal");
  const orderId = searchParams.get("id");

  // Calculate active filters count
  const activeFiltersCount = [
    statusFilter !== "all",
    dateFrom !== "",
    dateTo !== "",
    sortBy !== "created_at" || sortOrder !== "desc"
  ].filter(Boolean).length;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (token) {
      setCurrentPage(1);
      fetchOrders(1);
    }
  }, [token, statusFilter, sortBy, sortOrder, dateFrom, dateTo, isMobile]);

  useEffect(() => {
    // Skip pagination on mobile - all orders are fetched at once
    if (token && currentPage > 1 && !isMobile) {
      fetchOrders(currentPage);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentPage, isMobile]);

  useEffect(() => {
    if (token && orderId && modalType) {
      handleModalFromUrl(modalType, orderId);
    }
  }, [token, orderId, modalType]);

  useEffect(() => {
    if (searchQuery) {
      startLoading();
      const debounceTimer = setTimeout(() => {
        setCurrentPage(1);
        fetchOrders(1);
      }, 500);

      return () => {
        clearTimeout(debounceTimer);
        stopLoading();
      };
    }
  }, [searchQuery]);

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

  const fetchOrders = async (page: number = 1) => {
    if (!token) return;
    startLoading();
    const params: any = {
      page: isMobile ? 1 : page, // Always use page 1 on mobile
      limit: isMobile ? 1000 : 5, // Fetch all orders on mobile (using large limit)
      sort: sortBy,
      order: sortOrder,
      search: searchQuery,
    };
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }
    if (dateFrom) {
      params.date_from = dateFrom;
    }
    if (dateTo) {
      params.date_to = dateTo;
    }
    const response = await getOrders(token, params);
    if (response.success) {
      setOrders(response.data);

      // Collect unique buy again items
      const uniqueItems = new Map<string, BuyAgainItems>();
      response.data.forEach((order) => {
        order.items.forEach((item) => {
          const itemId = item.variant;
          if (itemId && !uniqueItems.has(itemId)) {
            uniqueItems.set(itemId, {
              id: itemId,
              name: item.name,
              slug: item.name.toLowerCase().replace(/ /g, "-"),
              thumbnail_url: item.thumbnail_url,
              product_type: item.product_type ?? "perfume",
            });
          }
        });
      });
      // On mobile, set pagination to show all orders are loaded
      if (isMobile) {
        setPagination({
          current_page: 1,
          total_pages: 1,
          total_orders: response.data.length,
          per_page: response.data.length,
          has_next: false,
          has_prev: false,
        });
      } else {
        setPagination(response.pagination);
      }
    }
    stopLoading();
  };

  const scrollBuyAgainCarousel = (direction: "left" | "right") => {
    if (buyAgainCarouselRef.current) {
      const scrollAmount = 200;
      const currentScroll = buyAgainCarouselRef.current.scrollLeft;
      const scrollTo =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;
      buyAgainCarouselRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  const handleModalFromUrl = async (modal: string, id: string) => {
    if (!token) return;

    if (modal === "tracking") {
      startLoading();
      const trackResponse = await trackOrder(id, token);
      if (trackResponse.success && trackResponse.data) {
        setTrackingData(trackResponse.data);
      }
      stopLoading();
    }
  };

  const openModal = (
    type: "detail" | "tracking" | "cancel" | "review",
    id: string
  ) => {
    router.push(`/profile/my-orders?modal=${type}&id=${id}`, { scroll: false });
  };

  const closeModal = () => {
    router.push("/profile/my-orders", { scroll: false });
    setSelectedOrder(null);
    setTrackingData(null);
    setShowCancelModal(false);
    setShowReviewModal(false);
    setShowReturnModal(false);
    setReviewsMap({});
    setExistingReviews(new Set());
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/profile/order?orderId=${orderId}`);
  };

  const handleTrackOrder = (orderId: string) => {
    openModal("tracking", orderId);
  };

  const handleCancelOrder = async (reason: string, comments: string, selectedItemIds: string[]) => {
    if (!token || !selectedOrder) return;
    startLoading();
    const response = await cancelOrder(selectedOrder.id, token, {
      reason,
      comments,
      itemIds: selectedItemIds,
    });
    stopLoading();

    if (response.success) {
      const itemCount = selectedItemIds.length;
      const totalItems = selectedOrder.items.length;
      const message = itemCount === totalItems 
        ? "Order cancelled successfully" 
        : `${itemCount} item${itemCount !== 1 ? 's' : ''} cancelled successfully`;
      toast.success(message, { duration: 3000 });
      setShowCancelModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } else {
      toast.error(response.message || "Failed to cancel order", {
        duration: 4000,
      });
    }
  };

  const handleReturnRefund = async (reason: string, comments: string) => {
    if (!token || !selectedOrder) return;
    startLoading();
    const response = await requestReturnRefund(selectedOrder.id, token, {
      reason,
      comments,
    });
    stopLoading();

    if (response.success) {
      toast.success("Return request submitted successfully", { duration: 3000 });
      setShowReturnModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } else {
      toast.error(response.message || "Failed to submit return request", {
        duration: 4000,
      });
    }
  };

  const handleSubmitReviews = async (
    reviewsMap: Record<string, { rating: number; comment: string }>
  ) => {
    if (!token || !selectedOrder) return;

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
        order_id: selectedOrder.id,
        rating: reviewData.rating,
        comment: reviewData.comment || undefined,
      });

      if (response.success) {
        successCount++;
      } else {
        // Check if it's a duplicate review error
        if (
          response.message &&
          response.message.toLowerCase().includes("already reviewed")
        ) {
          const productName =
            selectedOrder.items.find(
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
      setSelectedOrder(null);
      setReviewsMap({});
      fetchOrders();
    }
  };

  const handleOpenCancelModal = async (orderId: string) => {
    if (!token) return;
    startLoading();
    const response = await getOrder(orderId, token);
    if (response.success && response.data) {
      setSelectedOrder(response.data);
      setShowCancelModal(true);
    }
    stopLoading();
  };

  const handleOpenReviewModal = async (orderId: string) => {
    if (!token) return;
    startLoading();
    const response = await getOrder(orderId, token);
    if (response.success && response.data) {
      setSelectedOrder(response.data);
      // Check which products already have reviews
      const productIds = response.data.items.map((item) => {
        return item.product_id || item.product_variant_id;
      });
      setExistingReviews(new Set());
      setShowReviewModal(true);
    }
    stopLoading();
  };

  const handleOpenReturnModal = async (orderId: string) => {
    if (!token) return;
    startLoading();
    const response = await getOrder(orderId, token);
    if (response.success && response.data) {
      setSelectedOrder(response.data);
      setShowReturnModal(true);
    }
    stopLoading();
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

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      placed: <Clock size={16} />,
      processing: <RefreshCw size={16} />,
      shipped: <Truck size={16} />,
      delivered: <CheckCircle size={16} />,
      cancelled: <XCircle size={16} />,
      refunded: <XCircle size={16} />,
    };
    return icons[status] || <Package size={16} />;
  };

  const getStatusDateText = (status: string, date: string) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (status === "shipped") {
      return `Shipped on ${formattedDate}`;
    } else if (status === "delivered") {
      return `Delivered on ${formattedDate}`;
    } else {
      return `Ordered on ${formattedDate}`;
    }
  };

  const canCancelOrder = (status: string) => {
    return status === "placed";
  };

  const canReturnOrder = (order: Order) => {
    if (order.status !== "delivered") return false;
    // Check if delivered within last 2 days
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

  const handleResetFilters = () => {
    setStatusFilter("all");
    setSortBy("created_at");
    setSortOrder("desc");
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    setCurrentPage(1);
    fetchOrders(1);
  };

  const filteredOrders = orders.filter((order) =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white lg:border lg:border-gray-200">
        <div className="flex md:hidden items-center gap-3 bg-[#142241] text-yellow-600 py-4 px-4 pt-8 w-full -translate-y-[30px] md:translate-y-0">
          <h2 className="text-xl md:text-2xl font-light tracking-wide uppercase">
            My Orders
          </h2>
        </div>
      <div className="max-w-6xl pt-0 md:p-8 -translate-y-[30px] md:translate-y-0">
        <div className="hidden md:flex flex-row justify-between items-center mb-6 md:mb-8 gap-3">
        <div className="items-center gap-3 hidden md:flex">
            <h2 className="text-xl md:text-2xl font-light tracking-wide uppercase">My Orders</h2>
          </div>
          <button 
            onClick={() => setShowFilterModal(true)}
            className="p-2 hover:bg-gray-100 transition-colors rounded-xl hidden md:flex items-center gap-2 relative"
          >
            <FilterIcon size={20} strokeWidth={1} className="text-gray-600" />
            <span className="text-sm uppercase tracking-wider">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
        <div className="md:hidden border-b border-gray-200">
          <div className="flex items-center bg-white px-2">
            {/* Search Input Area */}
            <div className="flex items-center flex-1 px-3 py-3">
              <SearchIcon
                size={20}
                strokeWidth={1.5}
                className="text-gray-600 shrink-0"
              />
              <input
                type="text"
                placeholder="Search all orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 ml-2 focus:outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-gray-200"></div>

            {/* Filter Button */}
            <button 
              onClick={() => setShowFilterModal(true)}
              className="px-4 py-3 flex items-center gap-2 hover:bg-gray-50 transition-colors relative"
            >
              <span className="text-sm font-medium text-gray-900">Filter</span>
              {activeFiltersCount > 0 && (
                <span className="bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronRight size={16} strokeWidth={2} className="text-gray-900" />
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 mx-4 md:mx-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-blue-900">Active Filters:</span>
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-300 rounded-full text-xs font-medium text-blue-900">
                    Status: {statusFilter}
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="hover:bg-blue-100 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {dateFrom && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-300 rounded-full text-xs font-medium text-blue-900">
                    From: {new Date(dateFrom).toLocaleDateString()}
                    <button
                      onClick={() => setDateFrom("")}
                      className="hover:bg-blue-100 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {dateTo && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-300 rounded-full text-xs font-medium text-blue-900">
                    To: {new Date(dateTo).toLocaleDateString()}
                    <button
                      onClick={() => setDateTo("")}
                      className="hover:bg-blue-100 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {(sortBy !== "created_at" || sortOrder !== "desc") && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-300 rounded-full text-xs font-medium text-blue-900">
                    Sort: {sortBy.replace("_", " ")} ({sortOrder})
                  </span>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-blue-900 hover:text-blue-700 underline"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No orders found</p>
            <p className="text-sm text-gray-400 mt-2">
              Your order history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4 p-4 md:p-0">
            {filteredOrders.map((order) => {
              // For 2x2 grid: show max 3 items, 4th position shows remaining count if > 3
              const gridItems = order.items.slice(0, 3);
              const showRemainingCount = order.items.length > 3;
              const remainingItemsCount = order.items.length - 3;

              return (
                <div
                  key={order.id}
                  className="border border-gray-200 hover:border-gray-300 transition-colors rounded-lg md:rounded-none"
                  onClick={() => handleViewOrder(order.id)}
                >
                  {/* Mobile View - Simplified */}
                  <div className="md:hidden">
                    <div className="flex items-stretch gap-4 h-full">
                      <div className="w-1/4 bg-gray-100 p-3 flex items-center">
                        <div className="grid grid-cols-2 gap-1">
                          {gridItems.map((item, index) => (
                            <div
                              key={index}
                              className="aspect-square bg-gray-100 border border-gray-200"
                            >
                              <img
                                src={item.thumbnail_url}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-xs"
                              />
                            </div>
                          ))}
                          {showRemainingCount && (
                            <div className="aspect-square bg-gray-300 border border-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700 rounded-xs">
                                +{remainingItemsCount}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date and Order Info */}
                      <div className="flex-1 min-w-0 ml-2 py-3">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          {getStatusDateText(order.status, order.created_at)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              {order.order_number}
                            </p>
                            <p className="text-sm font-medium">
                              ₹{Number(order.total_amount).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        className="p-2 hover:bg-gray-100 transition-colors"
                        aria-label="View order details"
                      >
                        <ChevronRight
                          size={28}
                          strokeWidth={1}
                          className="text-gray-600"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Desktop View - Detailed */}
                  <div className="hidden md:block">
                    <div className="p-3 md:p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:space-x-6">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                              Order Number
                            </p>
                            <p className="font-medium text-sm">
                              {order.order_number}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                              Date
                            </p>
                            <p className="text-sm">
                              {new Date(order.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                              Total
                            </p>
                            <p className="font-medium">
                              ₹{Number(order.total_amount).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`px-3 py-1 text-xs font-medium uppercase tracking-wider border flex items-center space-x-2 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span>{order.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 md:p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          {order.items_count}{" "}
                          {order.items_count === 1 ? "Item" : "Items"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 border border-gray-200"
                          >
                            <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-gray-100 border border-gray-200">
                              <img
                                src={item.thumbnail_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {item.variant}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="flex-1 bg-black text-white px-4 py-2 hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <span className="text-sm uppercase tracking-wider">
                            View Details
                          </span>
                          <ChevronRight size={16} />
                        </button>
                        {["confirmed", "processing", "shipped"].includes(
                          order.status
                        ) && (
                          <button
                            onClick={() => handleTrackOrder(order.id)}
                            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <Truck size={16} />
                            <span className="text-sm uppercase tracking-wider">
                              Track Order
                            </span>
                          </button>
                        )}
                        {canReturnOrder(order) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenReturnModal(order.id);
                            }}
                            className="flex-1 border border-orange-600 text-orange-600 px-4 py-2 hover:bg-orange-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <XCircle size={16} />
                            <span className="text-sm uppercase tracking-wider">
                              Return / Refund
                            </span>
                          </button>
                        )}
                        {canReviewOrder(order.status) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenReviewModal(order.id);
                            }}
                            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <Star size={16} />
                            <span className="text-sm uppercase tracking-wider">
                              Write Review
                            </span>
                          </button>
                        )}
                        {canCancelOrder(order.status) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCancelModal(order.id);
                            }}
                            className="flex-1 border border-red-600 text-red-600 px-4 py-2 hover:bg-red-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <XCircle size={16} />
                            <span className="text-sm uppercase tracking-wider">
                              Cancel Order
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredOrders.length > 0 &&
          pagination.total_pages > 1 &&
          !isMobile && (
            <div className="mt-6 md:mt-8 flex flex-col gap-4 border-t border-gray-200 pt-4 md:pt-6">
              <div className="text-xs md:text-sm text-gray-600 text-center md:text-left">
                Showing page {pagination.current_page} of{" "}
                {pagination.total_pages} ({pagination.total_orders} total
                orders)
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={!pagination.has_prev}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 border border-gray-300 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  <ChevronLeft size={16} />
                  <span className="text-sm uppercase tracking-wider">
                    Previous
                  </span>
                </button>

                <div className="hidden sm:flex items-center space-x-1">
                  {Array.from(
                    { length: pagination.total_pages },
                    (_, i) => i + 1
                  )
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

      

      {modalType === "tracking" && trackingData && (
        <TrackingModal
          tracking={trackingData}
          onClose={closeModal}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
      )}

      {/* Cancel Order Modal */}
      {selectedOrder && (
        <CancleOrderModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onConfirm={handleCancelOrder}
        />
      )}

      {/* Review Modal */}
      {selectedOrder && token && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedOrder(null);
            setReviewsMap({});
          }}
          orderId={selectedOrder.id}
          orderNumber={selectedOrder.order_number}
          token={token}
          onConfirm={handleSubmitReviews}
        />
      )}

      {/* Return/Refund Modal */}
      {selectedOrder && (
        <ReturnRefundModal
          isOpen={showReturnModal}
          onClose={() => {
            setShowReturnModal(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onConfirm={handleReturnRefund}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
        activeFiltersCount={activeFiltersCount}
      />
    </div>
  );
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortBy: "created_at" | "updated_at" | "total_amount" | "order_number";
  setSortBy: (value: "created_at" | "updated_at" | "total_amount" | "order_number") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  onReset: () => void;
  onApply: () => void;
  activeFiltersCount: number;
}

function FilterModal({
  isOpen,
  onClose,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onReset,
  onApply,
  activeFiltersCount,
}: FilterModalProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  const statusOptions = [
    { value: "all", label: "All Orders", icon: <Package size={16} /> },
    { value: "placed", label: "Placed", icon: <Clock size={16} /> },
    { value: "processing", label: "Processing", icon: <RefreshCw size={16} /> },
    { value: "shipped", label: "Shipped", icon: <Truck size={16} /> },
    { value: "delivered", label: "Delivered", icon: <CheckCircle size={16} /> },
    { value: "cancelled", label: "Cancelled", icon: <XCircle size={16} /> },
    { value: "refunded", label: "Refunded", icon: <XCircle size={16} /> },
  ];

  const sortOptions = [
    { value: "created_at", label: "Order Date" },
    { value: "updated_at", label: "Last Updated" },
    { value: "total_amount", label: "Order Amount" },
    { value: "order_number", label: "Order Number" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        data-lenis-prevent="true"
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Filter Modal - Desktop centered, Mobile bottom sheet */}
      <div className="fixed inset-0 z-[10000] flex md:items-center items-end justify-center md:p-4 p-0 pointer-events-none">
        <div
          className={`bg-white w-full md:max-w-2xl overflow-hidden transition-all duration-300 ease-out pointer-events-auto
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
            <div className="flex items-center gap-3">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                Filter Orders
              </h3>
              {activeFiltersCount > 0 && (
                <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-semibold">
                  {activeFiltersCount} active
                </span>
              )}
            </div>
            <button
              onClick={onClose}
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
            {/* Order Status Filter */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Order Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                      statusFilter === option.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    {option.icon}
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Sort By
              </label>
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as any)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      sortBy === option.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              {/* Sort Order */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => setSortOrder("desc")}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    sortOrder === "desc"
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => setSortOrder("asc")}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    sortOrder === "asc"
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  Oldest First
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Date Range
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">From Date</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">To Date</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 md:px-6 md:py-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onReset}
                disabled={activeFiltersCount === 0}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset All
              </button>
              <button
                onClick={onApply}
                className="flex-1 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all duration-200 font-semibold text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TrackingModal({
  tracking,
  onClose,
  getStatusColor,
  getStatusIcon,
}: {
  tracking: TrackOrderResponse;
  onClose: () => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}) {
  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg md:text-2xl font-light tracking-wide uppercase">
              Track Order
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              {tracking.order_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 border-l-2 border-black">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Current Status
              </p>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium uppercase tracking-wider border items-center space-x-2 ${getStatusColor(
                  tracking.current_status
                )}`}
              >
                {getStatusIcon(tracking.current_status)}
                <span>{tracking.current_status}</span>
              </span>
            </div>
            {tracking.estimated_delivery && (
              <div className="bg-gray-50 p-4 border-l-2 border-black">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Estimated Delivery
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(tracking.estimated_delivery).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            )}
          </div>

          {tracking.tracking_number && (
            <div className="bg-gray-50 p-4 border-l-2 border-black">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Tracking Number
              </p>
              <p className="text-sm text-gray-900 font-mono">
                {tracking.tracking_number}
              </p>
              {tracking.carrier && (
                <p className="text-xs text-gray-500 mt-1">
                  Carrier: {tracking.carrier}
                </p>
              )}
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">
              Tracking Timeline
            </h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {tracking.timeline.map((event, index) => (
                  <div
                    key={index}
                    className="relative flex items-start space-x-4"
                  >
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white ${
                        index === 0 ? "border-black" : "border-gray-300"
                      }`}
                    >
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-900 capitalize">
                          {event.status.replace("_", " ")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{event.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

