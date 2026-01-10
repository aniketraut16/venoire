"use client";
import { DetailedOrder } from "@/types/orders";
import { X, Package } from "lucide-react";
import { useState, useEffect } from "react";

interface CancleOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DetailedOrder;
  onConfirm: (reason: string, comments: string, selectedItemIds: string[]) => Promise<void>;
}

export default function CancleOrderModal({
  isOpen,
  onClose,
  order,
  onConfirm,
}: CancleOrderModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mount animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      // Select all items by default
      if (order?.items) {
        setSelectedItems(new Set(order.items.map(item => item.id)));
      }
    } else {
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, order]);

  if (!isMounted || !order) return null;

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === order.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(order.items.map(item => item.id)));
    }
  };

  const handleSubmit = async () => {
    if (!reason || selectedItems.size === 0) return;
    setIsSubmitting(true);
    try {
      await onConfirm(reason, comments, Array.from(selectedItems));
      setReason("");
      setComments("");
      setSelectedItems(new Set());
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setComments("");
    setSelectedItems(new Set());
    onClose();
  };

  const allSelected = selectedItems.size === order.items.length;
  const selectedCount = selectedItems.size;
  const totalItems = order.items.length;

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

      {/* Cancel Order Modal - Desktop centered, Mobile bottom sheet */}
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
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                Cancel Order
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Order #{order.order_number}
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
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Warning:</strong> Cancelling items from this order cannot be undone. 
                Please select the items you wish to cancel.
              </p>
            </div>

            {/* Items Selection */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">
                  Select Items to Cancel
                </h4>
                <button
                  onClick={toggleSelectAll}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Selected Items Counter */}
              {selectedCount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <Package size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {selectedCount} of {totalItems} item{totalItems !== 1 ? 's' : ''} selected
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {order.items.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`border-2 rounded-xl p-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <div className="shrink-0 pt-1">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Item Image */}
                        <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={item.thumbnail_url || '/dummy.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/dummy.jpg'
                            }}
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 line-clamp-2 mb-1">
                            {item.name}
                          </p>
                          {item.variant && (
                            <p className="text-sm text-gray-600 mb-2">
                              {item.variant}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              ₹{parseFloat(item.total_price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reason Selection */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Reason for Cancellation *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm"
                >
                  <option value="">Select a reason</option>
                  <option value="changed_mind">Changed my mind</option>
                  <option value="found_better_price">Found better price</option>
                  <option value="ordered_by_mistake">Ordered by mistake</option>
                  <option value="delivery_too_long">Delivery taking too long</option>
                  <option value="wrong_item">Wrong item ordered</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none text-sm"
                  placeholder="Any additional details about why you're cancelling..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  {comments.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 md:px-6 md:py-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Go Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason || selectedItems.size === 0 || isSubmitting}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Cancelling..." : `Cancel ${selectedCount} Item${selectedCount !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
