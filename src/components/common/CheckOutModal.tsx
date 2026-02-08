import { Pricing } from "@/types/cart";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AddressType } from "@/types/address";
import toast from "react-hot-toast";
import { Shield, X, MapPin } from "lucide-react";
import { intiateOrder } from "@/utils/orders";

interface CheckOutModalProps {
  open: boolean;
  onClose: () => void;
  pricing: Pricing | null;
  cartId: string;
  appliedCoupon: string | null;
  selectedAddress: AddressType | null;
}

export default function CheckoutPageModal({
  open,
  onClose,
  pricing,
  cartId,
  appliedCoupon = null,
  selectedAddress,
}: CheckOutModalProps) {
  if (!open) return null;

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { user, dbUser, token } = useAuth();


  const bagTotal = pricing?.subtotal || 0;
  const discount = pricing?.discount || 0;
  const shipping = pricing?.shipping || 0;
  const isFreeShipping = pricing?.isFreeShipping || false;
  const payableAmount = pricing?.total || 0;

  if (!pricing || !cartId || cartId.trim() === '' || !selectedAddress) {
    return (
      <div
        className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 text-center">
            <p className="text-gray-700 mb-4">Loading checkout information...</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userName =
    user?.displayName || dbUser?.first_name + " " + dbUser?.last_name || "—";
  const userEmail = user?.email || "—";
  const userPhone =
    dbUser && (dbUser as any).phone
      ? (dbUser as any).phone
      : user?.phoneNumber || "—";

  const handlePay = async () => {
    if (!user) {
      toast.error("Please login to proceed");
      return;
    }
    if (!selectedAddress) {
      toast.error("No delivery address selected");
      return;
    }
    if (pricing && pricing.shipping === -1) {
      toast.error("No courier service available for the selected address.");
      return;
    }
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setIsProcessingPayment(true);

    try {
      if (!cartId) {
        setIsProcessingPayment(false);
        toast.error("Unable to retrieve cart information");
        return;
      }

      const orderData = {
        cartId: cartId,
        shippingAddressId: selectedAddress.id,
        billingAddressId: selectedAddress.id,
        couponCode: appliedCoupon || "",
        notes: "",
      };

      const result = await intiateOrder(orderData, token);

      if (result.success && result.checkoutPageUrl) {
        window.location.href = result.checkoutPageUrl;
      } else {
        toast.error(result.message || "Failed to initiate order");
      }
    } catch (error) {
      console.error("Error initiating order:", error);
      toast.error("An error occurred while processing your order");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-4xl max-h-[90vh] h-[90vh] md:h-auto rounded-t-2xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col relative animate-[slideUp_0.3s_ease-out] md:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <h1 className="text-lg font-semibold tracking-wide">CHECKOUT</h1>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-2 lg:gap-8">
            {/* Left Column: Account Info */}
            <div>
              <div className="mb-6">
                <h2 className="text-sm font-bold text-gray-900 tracking-wider mb-3 uppercase">
                  Account Details
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-1.5 text-sm">
                  <p className="font-medium text-gray-900">{userName}</p>
                  <p className="text-gray-600">{userEmail}</p>
                  {userPhone !== "—" && (
                    <p className="text-gray-600">{userPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Delivery Address Display */}
            <div>
              <div className="mb-3">
                <h2 className="text-sm font-bold text-gray-900 tracking-wider uppercase">
                  Delivery Address
                </h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                  <div className="text-sm space-y-1">
                    <p className="font-semibold text-gray-900">
                      {selectedAddress.address_line1}
                    </p>
                    {selectedAddress.address_line2 && (
                      <p className="text-gray-600">
                        {selectedAddress.address_line2}
                      </p>
                    )}
                    <p className="text-gray-600">
                      {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
                    </p>
                    <p className="text-gray-600">{selectedAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Details - Bottom Section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">
              Price Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
               {/* Breakdown */}
               <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{bagTotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount {pricing.appliedOffer && `(${pricing.appliedOffer})`}</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  {pricing.gst > 0 && (
                     <div className="flex justify-between">
                      <span>GST</span>
                      <span>₹{pricing.gst.toFixed(2)}</span>
                     </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === -1 ? "text-gray-500" : isFreeShipping ? "text-green-600" : ""}>
                      {shipping === -1 
                        ? "Not Available" 
                        : isFreeShipping 
                        ? `FREE (₹${shipping.toFixed(2)} saved)` 
                        : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
               </div>

               {/* Total */}
               <div className="flex flex-col justify-center">
                  <div className="flex items-baseline justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                    <span className="text-base font-semibold text-gray-900">Total Amount</span>
                    <span className="text-xl md:text-2xl font-bold text-gray-900">
                      ₹{payableAmount.toFixed(2)}
                    </span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Sticky Pay Button */}
        <div className="border-t p-4 bg-gray-50 shrink-0 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 px-6 font-semibold text-sm tracking-wide text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all uppercase"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={isProcessingPayment || (pricing && pricing.shipping === -1)}
            className={`flex-2 py-3.5 px-6 font-bold text-sm tracking-widest text-white transition-all rounded-lg shadow-md uppercase ${
              isProcessingPayment || (pricing && pricing.shipping === -1)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800 active:scale-[0.99] shadow-lg hover:shadow-xl"
            }`}
          >
            {isProcessingPayment ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                PROCESSING...
              </span>
            ) : pricing && pricing.shipping === -1 ? (
              "SHIPPING NOT AVAILABLE"
            ) : (
              `PAY ₹${payableAmount.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
