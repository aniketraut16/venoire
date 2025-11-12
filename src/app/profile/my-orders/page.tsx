"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrders, getOrder, cancelOrder, trackOrder } from "@/utils/orders";
import { Order, DetailedOrder, TrackOrderResponse } from "@/types/orders";
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
} from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_orders: 0,
    per_page: 10,
    has_next: false,
    has_prev: false,
  });
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null);
  const [trackingData, setTrackingData] = useState<TrackOrderResponse | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelComments, setCancelComments] = useState("");

  const modalType = searchParams.get("modal");
  const orderId = searchParams.get("id");

  useEffect(() => {
    if (token) {
      setCurrentPage(1);
      fetchOrders(1);
    }
  }, [token, statusFilter]);

  useEffect(() => {
    if (token && currentPage > 1) {
      fetchOrders(currentPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  useEffect(() => {
    if (token && orderId && modalType) {
      handleModalFromUrl(modalType, orderId);
    }
  }, [token, orderId, modalType]);

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
      page,
      limit: 5,
      sort: "created_at",
      order: "desc",
    };
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }
    const response = await getOrders(token, params);
    if (response.success) {
      setOrders(response.data);
      setPagination(response.pagination);
    }
    stopLoading();
  };

  const handleModalFromUrl = async (modal: string, id: string) => {
    if (!token) return;
    
    if (modal === "detail") {
      startLoading();
      const response = await getOrder(id, token);
      if (response.success && response.data) {
        setSelectedOrder(response.data);
      }
      stopLoading();
    } else if (modal === "tracking") {
      startLoading();
      const trackResponse = await trackOrder(id, token);
      if (trackResponse.success && trackResponse.data) {
        setTrackingData(trackResponse.data);
      }
      stopLoading();
    } else if (modal === "cancel") {
      startLoading();
      const response = await getOrder(id, token);
      if (response.success && response.data) {
        setSelectedOrder(response.data);
      }
      stopLoading();
    }
  };

  const openModal = (type: "detail" | "tracking" | "cancel", id: string) => {
    router.push(`/profile/my-orders?modal=${type}&id=${id}`, { scroll: false });
  };

  const closeModal = () => {
    router.push("/profile/my-orders", { scroll: false });
    setSelectedOrder(null);
    setTrackingData(null);
    setCancelReason("");
    setCancelComments("");
  };

  const handleViewOrder = (orderId: string) => {
    openModal("detail", orderId);
  };

  const handleTrackOrder = (orderId: string) => {
    openModal("tracking", orderId);
  };

  const handleOpenCancelModal = () => {
    if (!selectedOrder) return;
    openModal("cancel", selectedOrder.id);
  };

  const handleCancelOrder = async () => {
    if (!token || !selectedOrder) return;
    startLoading();
    const response = await cancelOrder(selectedOrder.id, token, {
      reason: cancelReason,
      comments: cancelComments,
    });
    if (response.success) {
      closeModal();
      fetchOrders();
    }
    stopLoading();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
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
      pending: <Clock size={16} />,
      confirmed: <CheckCircle size={16} />,
      processing: <RefreshCw size={16} className="animate-spin" />,
      shipped: <Truck size={16} />,
      delivered: <CheckCircle size={16} />,
      cancelled: <XCircle size={16} />,
      refunded: <XCircle size={16} />,
    };
    return icons[status] || <Package size={16} />;
  };

  const filteredOrders = orders.filter((order) =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-200 p-8">
      <div className="max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-light tracking-wide uppercase">My Orders</h2>
          <button
            onClick={() => fetchOrders(currentPage)}
            className="flex items-center space-x-2 border border-gray-300 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
          >
            <RefreshCw size={16} />
            <span className="text-sm uppercase tracking-wider">Refresh</span>
          </button>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200 appearance-none bg-white"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No orders found</p>
            <p className="text-sm text-gray-400 mt-2">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
                      <p className="font-medium">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                      <p className="text-sm">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                      <p className="font-medium">₹{Number(order.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
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

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      {order.items_count} {order.items_count === 1 ? "Item" : "Items"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 border border-gray-200">
                          <img
                            src={item.thumbnail_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500 truncate">{item.variant}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewOrder(order.id)}
                      className="flex-1 bg-black text-white px-4 py-2 hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <span className="text-sm uppercase tracking-wider">View Details</span>
                      <ChevronRight size={16} />
                    </button>
                    {["confirmed", "processing", "shipped"].includes(order.status) && (
                      <button
                        onClick={() => handleTrackOrder(order.id)}
                        className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Truck size={16} />
                        <span className="text-sm uppercase tracking-wider">Track Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredOrders.length > 0 && pagination.total_pages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-600">
              Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_orders} total orders)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={!pagination.has_prev}
                className="flex items-center space-x-2 border border-gray-300 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <ChevronLeft size={16} />
                <span className="text-sm uppercase tracking-wider">Previous</span>
              </button>

              <div className="flex items-center space-x-1">
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
                className="flex items-center space-x-2 border border-gray-300 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <span className="text-sm uppercase tracking-wider">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {modalType === "detail" && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={closeModal}
          onCancel={handleOpenCancelModal}
          onTrack={() => handleTrackOrder(selectedOrder.id)}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
      )}

      {modalType === "tracking" && trackingData && (
        <TrackingModal
          tracking={trackingData}
          onClose={closeModal}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
      )}

      {modalType === "cancel" && selectedOrder && (
        <CancelOrderModal
          orderNumber={selectedOrder.order_number}
          reason={cancelReason}
          comments={cancelComments}
          onReasonChange={setCancelReason}
          onCommentsChange={setCancelComments}
          onCancel={closeModal}
          onConfirm={handleCancelOrder}
        />
      )}
    </div>
  );
}

function OrderDetailsModal({
  order,
  onClose,
  onCancel,
  onTrack,
  getStatusColor,
  getStatusIcon,
}: {
  order: DetailedOrder;
  onClose: () => void;
  onCancel: () => void;
  onTrack: () => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}) {
  const canCancel = ["pending", "confirmed"].includes(order.status);
  const canTrack = ["confirmed", "processing", "shipped"].includes(order.status);

  return (
    <div 
      data-lenis-prevent="true" 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-light tracking-wide uppercase">Order Details</h3>
            <p className="text-sm text-gray-600 mt-1">{order.order_number}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Date</p>
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
            <span
              className={`px-4 py-2 text-sm font-medium uppercase tracking-wider border flex items-center space-x-2 ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              <span>{order.status}</span>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200">
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 border border-gray-200">
                    <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.variant}</p>
                    <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{Number(item.total_price).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">₹{Number(item.unit_price).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-3 flex items-center space-x-2">
                <MapPin size={16} />
                <span>Shipping Address</span>
              </h4>
              <div className="bg-gray-50 p-4 border-l-2 border-black">
                <p className="text-sm text-gray-900">{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && (
                  <p className="text-sm text-gray-900">{order.shipping_address.address_line2}</p>
                )}
                <p className="text-sm text-gray-900">
                  {order.shipping_address.city}, {order.shipping_address.state}{" "}
                  {order.shipping_address.postal_code}
                </p>
                <p className="text-sm text-gray-900">{order.shipping_address.country}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-3 flex items-center space-x-2">
                <MapPin size={16} />
                <span>Billing Address</span>
              </h4>
              <div className="bg-gray-50 p-4 border-l-2 border-black">
                <p className="text-sm text-gray-900">{order.billing_address.address_line1}</p>
                {order.billing_address.address_line2 && (
                  <p className="text-sm text-gray-900">{order.billing_address.address_line2}</p>
                )}
                <p className="text-sm text-gray-900">
                  {order.billing_address.city}, {order.billing_address.state}{" "}
                  {order.billing_address.postal_code}
                </p>
                <p className="text-sm text-gray-900">{order.billing_address.country}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-3 flex items-center space-x-2">
              <CreditCard size={16} />
              <span>Payment Information</span>
            </h4>
            <div className="bg-gray-50 p-4 border-l-2 border-black">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment Method</p>
                  <p className="text-sm text-gray-900 capitalize">
                    {order.payment.payment_method.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment Status</p>
                  <p className="text-sm text-gray-900 capitalize">{order.payment.payment_status}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transaction ID</p>
                  <p className="text-sm text-gray-900 font-mono">{order.payment.transaction_id}</p>
                </div>
                {order.payment.paid_at && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Paid At</p>
                    <p className="text-sm text-gray-900">
                      {new Date(order.payment.paid_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-3">Order Summary</h4>
            <div className="bg-gray-50 p-4 space-y-2 border-l-2 border-black">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              {parseFloat(order.discount_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-₹{parseFloat(order.discount_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">₹{parseFloat(order.tax_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">₹{parseFloat(order.shipping_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-300">
                <span className="text-gray-900 uppercase tracking-wider">Total</span>
                <span className="text-gray-900">₹{parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {order.status === "cancelled" && order.refund && (
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-3">Refund Information</h4>
              <div className="bg-red-50 p-4 border-l-2 border-red-600 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Refund Status</p>
                    <p className="text-sm text-gray-900 capitalize">
                      {order.refund.refund_status.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Refund Amount</p>
                    <p className="text-sm text-gray-900 font-medium">
                      ₹{parseFloat(order.refund.refund_amount).toFixed(2)}
                    </p>
                  </div>
                  {order.refund.refund_transaction_id && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Refund Transaction ID</p>
                      <p className="text-sm text-gray-900 font-mono">{order.refund.refund_transaction_id}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Refund Initiated At</p>
                    <p className="text-sm text-gray-900">
                      {new Date(order.refund.refund_initiated_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {order.refund.refund_completed_at && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Refund Completed At</p>
                      <p className="text-sm text-gray-900">
                        {new Date(order.refund.refund_completed_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>
                {order.refund.refund_reason && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Refund Reason</p>
                    <p className="text-sm text-gray-900">{order.refund.refund_reason}</p>
                  </div>
                )}
                {order.refund.refund_notes && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Refund Notes</p>
                    <p className="text-sm text-gray-900">{order.refund.refund_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {order.notes && (
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-3">Order Notes</h4>
              <div className="bg-gray-50 p-4 border-l-2 border-black">
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            {canTrack && (
              <button
                onClick={onTrack}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Truck size={16} />
                <span className="text-sm uppercase tracking-wider">Track Order</span>
              </button>
            )}
            {canCancel && (
              <button
                onClick={onCancel}
                className="flex-1 border border-red-600 text-red-600 px-6 py-3 hover:bg-red-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <XCircle size={16} />
                <span className="text-sm uppercase tracking-wider">Cancel Order</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-light tracking-wide uppercase">Track Order</h3>
            <p className="text-sm text-gray-600 mt-1">{tracking.order_number}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 border-l-2 border-black">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Status</p>
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
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estimated Delivery</p>
                <p className="text-sm text-gray-900">
                  {new Date(tracking.estimated_delivery).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {tracking.tracking_number && (
            <div className="bg-gray-50 p-4 border-l-2 border-black">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tracking Number</p>
              <p className="text-sm text-gray-900 font-mono">{tracking.tracking_number}</p>
              {tracking.carrier && (
                <p className="text-xs text-gray-500 mt-1">Carrier: {tracking.carrier}</p>
              )}
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Tracking Timeline</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {tracking.timeline.map((event, index) => (
                  <div key={index} className="relative flex items-start space-x-4">
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white ${
                        index === 0 ? "border-black" : "border-gray-300"
                      }`}
                    >
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-900 capitalize">{event.status.replace("_", " ")}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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

function CancelOrderModal({
  orderNumber,
  reason,
  comments,
  onReasonChange,
  onCommentsChange,
  onCancel,
  onConfirm,
}: {
  orderNumber: string;
  reason: string;
  comments: string;
  onReasonChange: (value: string) => void;
  onCommentsChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-white max-w-md w-full">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-xl font-light tracking-wide uppercase">Cancel Order</h3>
          <p className="text-sm text-gray-600 mt-1">{orderNumber}</p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>

          <div>
            <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
              Reason for Cancellation
            </label>
            <select
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200"
            >
              <option value="">Select a reason</option>
              <option value="changed_mind">Changed my mind</option>
              <option value="found_better_price">Found better price</option>
              <option value="ordered_by_mistake">Ordered by mistake</option>
              <option value="delivery_too_long">Delivery taking too long</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => onCommentsChange(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200 resize-none"
              placeholder="Any additional details..."
            ></textarea>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-100 transition-colors duration-200 uppercase tracking-wider text-sm"
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              disabled={!reason}
              className="flex-1 bg-red-600 text-white px-6 py-3 hover:bg-red-700 transition-colors duration-200 uppercase tracking-wider text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
