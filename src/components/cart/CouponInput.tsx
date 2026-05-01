"use client";

import { useState } from "react";
import { Ticket, X, Check, Loader2 } from "lucide-react";

interface CouponInputProps {
  appliedCouponCode: string | null;
  isCouponApplying: boolean;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  onRemoveCoupon: () => Promise<void>;
}

export default function CouponInput({
  appliedCouponCode,
  isCouponApplying,
  onApplyCoupon,
  onRemoveCoupon,
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setError("");
    const result = await onApplyCoupon(couponCode);
    
    if (result.success) {
      setCouponCode("");
    } else {
      setError(result.message);
    }
  };

  const handleRemoveCoupon = async () => {
    setError("");
    setCouponCode("");
    await onRemoveCoupon();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Ticket className="w-5 h-5 text-gray-700" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Apply Coupon
          </h3>
        </div>

        {appliedCouponCode ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-900">
                    {appliedCouponCode}
                  </p>
                  <p className="text-xs text-green-700">Coupon applied successfully!</p>
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                disabled={isCouponApplying}
                className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                aria-label="Remove coupon"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setError("");
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleApplyCoupon();
                  }
                }}
                placeholder="Enter coupon code"
                disabled={isCouponApplying}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isCouponApplying || !couponCode.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 min-w-[80px] justify-center"
              >
                {isCouponApplying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  "Apply"
                )}
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <X className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
