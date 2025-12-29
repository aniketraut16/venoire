"use client";
import { DetailedOrder } from "@/types/orders";
import { X } from "lucide-react";
import { useState } from "react";

interface ReturnRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DetailedOrder;
  onConfirm: (reason: string, comments: string) => Promise<void>;
}

export default function ReturnRefundModal({
  isOpen,
  onClose,
  order,
  onConfirm,
}: ReturnRefundModalProps) {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async () => {
    if (!reason) return;
    setIsSubmitting(true);
    await onConfirm(reason, comments);
    setIsSubmitting(false);
    setReason("");
    setComments("");
  };

  const handleClose = () => {
    setReason("");
    setComments("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full md:w-full md:max-w-md rounded-t-2xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up md:animate-none max-h-[90vh] md:max-h-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 p-4 md:p-6 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-lg md:text-xl font-light tracking-wide uppercase">
              Return / Refund Request
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              {order.order_number}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
          <p className="text-sm text-gray-600">
            You can return this order within 2 days of delivery. Please provide
            a reason for your return request.
          </p>

          <div>
            <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
              Reason for Return
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200"
            >
              <option value="">Select a reason</option>
              <option value="defective">Product is defective</option>
              <option value="wrong_item">Wrong item received</option>
              <option value="not_as_described">Not as described</option>
              <option value="damaged">Product damaged</option>
              <option value="changed_mind">Changed my mind</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200 resize-none"
              placeholder="Please provide more details about your return request..."
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 border border-gray-300 text-gray-700 px-4 md:px-6 py-2 md:py-3 hover:bg-gray-100 transition-colors duration-200 uppercase tracking-wider text-sm disabled:opacity-50"
            >
              Go Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!reason || isSubmitting}
              className="flex-1 bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 hover:bg-red-700 transition-colors duration-200 uppercase tracking-wider text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Return Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
