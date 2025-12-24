import { Pricing } from "@/types/cart";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AddressType, CreateAddressArgs } from "@/types/address";
import { deleteAddress, getAddresses } from "@/utils/address";
import toast from "react-hot-toast";
import { Shield, Trash2, Pencil, Plus, X } from "lucide-react";
import { intiateOrder } from "@/utils/orders";
import AddressForm from "../Address/AddressForm";

interface CheckOutModalProps {
  open: boolean;
  onClose: () => void;
  pricing: Pricing | null;
  cartId: string;
  appliedCoupon: string | null;
}

export default function CheckoutPageModal({
  open,
  onClose,
  pricing,
  cartId,
  appliedCoupon = null,
}: CheckOutModalProps) {
  if (!open) return null;

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { user, dbUser, token } = useAuth();
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState<null | {
    method: "create" | "update";
    addressId?: string;
    defaultValues?: CreateAddressArgs;
  }>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!token) return;
      setIsLoadingAddresses(true);
      const res = await getAddresses(token);
      if (res.success) {
        setAddresses(res.data || []);
      }
      setIsLoadingAddresses(false);
    };
    loadAddresses();
  }, [token, showAddressForm]);

  useEffect(() => {
    if (addresses.length > 0) {
      const def = addresses.find((a) => a.is_default);
      setSelectedAddressId(
        (prev) => prev ?? (def ? def.id : addresses[0]?.id ?? null)
      );
    } else {
      setSelectedAddressId(null);
    }
  }, [addresses]);

  const bagTotal = pricing?.subtotal || 0;
  const discount = pricing?.discount || 0;
  const shipping = pricing?.shipping || 0;
  const payableAmount = pricing?.total || 0;

  if (!pricing || !cartId || cartId.trim() === '') {
    return (
      <div
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
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

  const handleDeleteAddress = async (addressId: string) => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }
    const confirmed = window.confirm("Delete this address?");
    if (!confirmed) return;
    const res = await deleteAddress(addressId, token);
    if (res.success) {
      toast.success("Address deleted");
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } else {
      toast.error(res.message || "Failed to delete");
    }
  };

  const openCreateAddress = () => {
    setShowAddressForm({ method: "create" });
  };

  const openEditAddress = (addr: AddressType) => {
    const defaults: CreateAddressArgs = {
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 || "",
      city: addr.city,
      postal_code: addr.postal_code,
      country: addr.country,
      state: addr.state || "",
      is_default: addr.is_default,
    };
    setShowAddressForm({
      method: "update",
      addressId: addr.id,
      defaultValues: defaults,
    });
  };

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
    if (!selectedAddressId) {
      toast.error("Select a delivery address");
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
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
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
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center md:p-4"
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
          <div className="grid md:grid-cols-2 gap-8">
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

            {/* Right Column: Address Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900 tracking-wider uppercase">
                  Delivery Address
                </h2>
                <button
                  onClick={openCreateAddress}
                  className="text-xs flex items-center gap-1 px-2 py-1 bg-black text-white hover:bg-gray-800 transition-colors rounded"
                >
                  <Plus className="w-3 h-3" />
                  Add New
                </button>
              </div>

              {isLoadingAddresses ? (
                <p className="text-sm text-gray-500 italic">Loading addresses...</p>
              ) : addresses.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded border border-dashed border-gray-300">
                  <p className="text-sm text-gray-600 mb-2">
                    No addresses found.
                  </p>
                  <button
                    onClick={openCreateAddress}
                    className="text-sm font-medium text-black hover:underline"
                  >
                    Add an address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {(showAllAddresses ? addresses : addresses.slice(0, 2)).map((addr) => (
                      <div
                        key={addr.id}
                        className={`relative border rounded-lg p-3 transition-all cursor-pointer ${
                          selectedAddressId === addr.id
                            ? "border-black bg-gray-50 ring-1 ring-black/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedAddressId(addr.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="pt-0.5">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                selectedAddressId === addr.id
                                  ? "border-black"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedAddressId === addr.id && (
                                <div className="w-2 h-2 rounded-full bg-black" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 text-sm overflow-hidden">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-semibold text-gray-900 truncate">
                                {addr.address_line1.slice(0, 30)}{addr.address_line1.length > 30 && "..."}
                              </span>
                              {addr.is_default && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded-sm shrink-0">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            {addr.address_line2 && (
                              <p className="text-gray-600 text-xs truncate">
                                {addr.address_line2}
                              </p>
                            )}
                            <p className="text-gray-600 text-xs">
                              {addr.city}, {addr.state} {addr.postal_code}
                            </p>
                            <p className="text-gray-600 text-xs">{addr.country}</p>
                          </div>
                          
                          {/* Floating Actions */}
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); openEditAddress(addr); }}
                                className="p-1.5 text-gray-400 hover:text-black transition-colors bg-white"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors bg-white"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {addresses.length > 2 && (
                    <button
                      onClick={() => setShowAllAddresses(!showAllAddresses)}
                      className="text-xs font-semibold text-gray-600 hover:text-black underline transition-colors"
                    >
                      {showAllAddresses ? "Show Less" : `View All (${addresses.length})`}
                    </button>
                  )}
                </div>
              )}
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
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
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
            disabled={isProcessingPayment || !selectedAddressId}
            className={`flex-[2] py-3.5 px-6 font-bold text-sm tracking-widest text-white transition-all rounded-lg shadow-md uppercase ${
              isProcessingPayment || !selectedAddressId
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
            ) : (
              `PAY ₹${payableAmount.toFixed(2)}`
            )}
          </button>
        </div>
        {!selectedAddressId && addresses.length > 0 && (
          <p className="text-xs text-red-500 text-center pb-2 bg-gray-50">
            * Please select a delivery address to proceed
          </p>
        )}
      </div>

      {/* Address Form Modal - Rendered conditionally outside the animated container */}
      {showAddressForm && (
        <AddressForm
          method={showAddressForm.method}
          addressId={showAddressForm.addressId}
          defaultValues={showAddressForm.defaultValues}
          onCancel={() => setShowAddressForm(null)}
        />
      )}
    </div>
  );
}
