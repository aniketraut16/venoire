"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Heart,
  Trash2,
  ChevronDown,
  Shield,
  Package,
  Truck,
  Minus,
  Plus,
  MapPin,
  AlertCircle,
  Pencil,
  Trash,
} from "lucide-react";
import { useCart } from "@/contexts/cartContext";
import { CartItem } from "@/types/cart";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import CheckoutPageModal from "@/components/common/CheckOutModal";
import { getAddresses, deleteAddress } from "@/utils/address";
import { AddressType, CreateAddressArgs } from "@/types/address";
import AddressForm from "@/components/Address/AddressForm";

function ShoppingCartPage() {
  const {
    removeFromCart,
    updateCartItem,
    count,
    cartItems,
    pricing,
    isCartLoading,
    cartId,
    fetchCart,
  } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedVolumes, setSelectedVolumes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const { user, needsCompleteSetup, token } = useAuth();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || null;
  const checkoutmodal = searchParams.get("checkoutmodal") || "false";
  const { moveToWishlist } = useCart();
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState<null | {
    method: "create" | "update";
    addressId?: string;
    defaultValues?: CreateAddressArgs;
  }>(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  const getCurrentQuantity = (item: CartItem): number => {
    const q = selectedQuantities[item.id] ?? item.quantity ?? 1;
    const asNum = Number(q);
    return Number.isFinite(asNum) && asNum > 0 ? asNum : 1;
  };

  useEffect(() => {
    if (user && token) {
      loadAddresses();
    }
  }, [user, token, showAddressForm]);

  useEffect(() => {
    if (!user && !isCartLoading) {
      router.push("/auth?redirect=/cart");
    }
  }, [user, isCartLoading, router]);

  const loadAddresses = async () => {
    if (!token) return;
    setIsLoadingAddresses(true);
    const response = await getAddresses(token);
    if (response.success && response.data.length > 0) {
      setAddresses(response.data);
      const defaultAddress = response.data.find((addr) => addr.is_default);
      const firstAddress = defaultAddress || response.data[0];
      
      if (firstAddress) {
        setSelectedAddressId(firstAddress.id);
        await fetchCart(firstAddress.postal_code);
      }
    } else if (response.success) {
      setAddresses([]);
    }
    setIsLoadingAddresses(false);
  };

  const handleAddressChange = async (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find((addr) => addr.id === addressId);
    if (selectedAddress) {
      await fetchCart(selectedAddress.postal_code);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!token) return;
    
    const confirmed = window.confirm("Delete this address?");
    if (!confirmed) return;
    
    const res = await deleteAddress(addressId, token);
    if (res.success) {
      toast.success("Address deleted");
      const updatedAddresses = addresses.filter((a) => a.id !== addressId);
      setAddresses(updatedAddresses);
      
      if (selectedAddressId === addressId) {
        const newSelected = updatedAddresses.find(a => a.is_default) || updatedAddresses[0];
        if (newSelected) {
          setSelectedAddressId(newSelected.id);
          await fetchCart(newSelected.postal_code);
        } else {
          setSelectedAddressId("");
        }
      }
    } else {
      toast.error(res.message || "Failed to delete address");
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

  useEffect(() => {
    if (checkoutmodal === "true" && !showCheckoutModal) {
      if (user && needsCompleteSetup) {
        router.push("/complete-profile?redirect=/cart?checkoutmodal=true");
        return;
      }
      if (!user) {
        router.push("/auth?redirect=/cart?checkoutmodal=true");
        return;
      }

      if (!selectedAddressId && !isLoadingAddresses) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('checkoutmodal');
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
        router.push(newUrl);
        return;
      }

      if (selectedAddressId) {
        setShowCheckoutModal(true);
      }
    }
  }, [checkoutmodal, showCheckoutModal, selectedAddressId, isLoadingAddresses]);

  const getCurrentVariantId = (item: CartItem): string | null => {
    if (item.productType === "clothing") {
      const selectedSizeValue = selectedSizes[item.id];
      if (
        selectedSizeValue &&
        item.possibleSizes &&
        item.possibleSizes.length > 0
      ) {
        const match = item.possibleSizes.find(
          (s) => s.size === selectedSizeValue
        );
        if (match) return match.variantId;
      }
      if (item.size?.variantId) return item.size.variantId;
      if (item.size?.size && item.possibleSizes) {
        const match = item.possibleSizes.find(
          (s) => s.size === item.size!.size
        );
        return match ? match.variantId : null;
      }
      return null;
    }
    if (item.productType === "perfume") {
      const selectedVolValue = selectedVolumes[item.id];
      if (
        selectedVolValue &&
        item.possibleVolumes &&
        item.possibleVolumes.length > 0
      ) {
        const match = item.possibleVolumes.find(
          (v) => v.ml_volume === selectedVolValue
        );
        if (match) return match.variantId;
      }
      if (item.ml_volume?.variantId) return item.ml_volume.variantId;
      if (item.ml_volume?.ml_volume && item.possibleVolumes) {
        const match = item.possibleVolumes.find(
          (v) => v.ml_volume === item.ml_volume!.ml_volume
        );
        return match ? match.variantId : null;
      }
      return null;
    }
    return null;
  };

  const handleSizeChange = async (item: CartItem, newSize: string) => {
    setSelectedSizes((prev) => ({ ...prev, [item.id]: newSize }));
    const match = (item.possibleSizes ?? []).find((s) => s.size === newSize);
    if (match) {
      await updateCartItem(item.id, {
        productVariantId: match.variantId,
        quantity: getCurrentQuantity(item),
      });
    }
  };

  const handleVolumeChange = async (item: CartItem, newVolume: string) => {
    setSelectedVolumes((prev) => ({ ...prev, [item.id]: newVolume }));
    const match = (item.possibleVolumes ?? []).find(
      (v) => v.ml_volume === newVolume
    );
    if (match) {
      await updateCartItem(item.id, {
        productVariantId: match.variantId,
        quantity: getCurrentQuantity(item),
      });
    }
  };

  const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
    const qty = Number(newQuantity);
    setSelectedQuantities((prev) => ({ ...prev, [item.id]: qty }));
    const variantId = getCurrentVariantId(item);
    if (variantId) {
      await updateCartItem(item.id, {
        productVariantId: variantId,
        quantity: qty,
      });
    }
  };

  const bagTotal = pricing?.subtotal || 0;
  const shipping = pricing?.shipping || 0;
  const isFreeShipping = pricing?.isFreeShipping || false;
  const payableAmount = pricing?.total || 0;
  const discount = pricing?.discount || 0;
  const tax = pricing?.gst || 0;

  const handleCheckout = () => {
    if (!user) {
      router.push("/auth?redirect=/cart?checkoutmodal=true");
      return;
    }
    
    if (needsCompleteSetup) {
      router.push("/complete-profile?redirect=/cart?checkoutmodal=true");
      return;
    }
    
    if (isCartLoading || isLoadingAddresses) {
      return;
    }
    
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    
    if (shipping === -1) {
      toast.error("Delivery not available for this address. Please select a different one.");
      return;
    }
    
    if (!pricing || !cartId || cartId.trim() === "") {
      toast.error("Unable to proceed. Please refresh and try again.");
      return;
    }
    
    setShowCheckoutModal(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-28 pb-32 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
          {/* Mobile: Cart Items */}
          <div className="space-y-4 md:hidden">
            {cartItems.map((item: CartItem) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="flex gap-3 p-4">
                  {/* Product Image */}
                  <div className="w-32 h-48 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    {/* Top Section: Brand, Name, Actions */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-1">
                          {item.name.length >23 ? `${item.name.substring(0,23)}...` : item.name}
                        </p>
                        <p className="text-xs text-gray-800 font-medium leading-tight line-clamp-2">
                          {item.description || item.name}
                        </p>
                      </div>
                      <div className="flex">
                        <button
                          onClick={() => moveToWishlist(item)}
                          className="p-2  rounded-full transition-colors"
                        >
                          <Heart className="w-5 h-5 text-pink-600" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-2">
                      {/* Total Price - Most Prominent */}
                      <p className="text-xl font-bold text-gray-900 mb-1 flex items-center">
                        ₹ {Number(item.price * item.quantity).toLocaleString()}
                        {item.badgeText && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs ml-2 font-semibold bg-green-100 text-green-800 rounded">
                          {item.badgeText}
                        </span>
                      )}
                      </p>

                      {/* Unit Price - Secondary */}
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-600 mb-1">
                          ₹ {Number(item.price).toLocaleString()} each
                        </p>
                      )}

                      

                      {/* Savings - Accent */}
                      {item.price > 0 && item.originalPrice > item.price && (
                        <p className="text-xs text-green-600 font-medium">
                          Saved ₹
                          {Math.round(
                            item.originalPrice - item.price
                          ).toLocaleString()}{" "}
                          {item.badgeText && `(Incl. Offer)`}
                        </p>
                      )}
                    </div>

                    {/* Offer Badges */}
                    <div className="flex flex-wrap gap-2 mb-1">
                  
                      {item.buyXGetYOffer.applicable &&
                        item.buyXGetYOffer.x > item.quantity && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                            {`Add ${
                              item.buyXGetYOffer.x - item.quantity
                            } more to get ${item.buyXGetYOffer.y} free`}
                          </span>
                        )}
                    </div>

                    {/* <p className="text-xs text-gray-500 mb-3">Inclusive of GST benefit</p> */}

                    {/* Size and Quantity Selectors */}
                    <div className="flex gap-3 mt-auto">
                      {item.productType === "clothing" && (
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Size:
                          </label>
                          <div className="relative">
                            <select
                              className="w-full h-9 px-3 pr-8 border border-gray-300 rounded bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                              value={
                                selectedSizes[item.id] ?? item.size?.size ?? ""
                              }
                              onChange={(e) =>
                                handleSizeChange(item, e.target.value)
                              }
                            >
                              {(item.possibleSizes ?? []).map(
                                (s: { size: string; variantId: string }) => (
                                  <option key={s.variantId} value={s.size}>
                                    {s.size}
                                  </option>
                                )
                              )}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {item.productType === "perfume" && (
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Volume:
                          </label>
                          <div className="relative">
                            <select
                              className="w-full h-9 px-3 pr-8 border border-gray-300 rounded bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                              value={
                                selectedVolumes[item.id] ??
                                item.ml_volume?.ml_volume ??
                                ""
                              }
                              onChange={(e) =>
                                handleVolumeChange(item, e.target.value)
                              }
                            >
                              {(item.possibleVolumes ?? []).map(
                                (v: {
                                  ml_volume: string;
                                  variantId: string;
                                }) => (
                                  <option key={v.variantId} value={v.ml_volume}>
                                    {v.ml_volume}
                                  </option>
                                )
                              )}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Qty:
                        </label>
                        <div className="flex items-center border border-gray-300 rounded max-w-[120px] h-9">
                          <button
                            onClick={() => {
                              const currentQty =
                                selectedQuantities[item.id] ?? item.quantity;
                              if (currentQty > 1) {
                                handleQuantityChange(item, currentQty - 1);
                              }
                            }}
                            disabled={
                              (selectedQuantities[item.id] ?? item.quantity) <=
                              1
                            }
                            className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="flex-1 text-center text-sm font-medium">
                            {selectedQuantities[item.id] ?? item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              const currentQty =
                                selectedQuantities[item.id] ?? item.quantity;
                              handleQuantityChange(item, currentQty + 1);
                            }}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                          {item.buyXGetYOffer.applicable &&
                            item.buyXGetYOffer.x < item.quantity && (
                              <div className="mt-1 text-xs font-medium text-green-600 flex items-center gap-1">
                                <span className="inline-block">🎁</span>
                                <span>+{item.buyXGetYOffer.y} FREE</span>
                              </div>
                            )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile: Address Selection */}
            {user && (
              <div className="bg-white rounded-lg p-4 mt-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-700" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Delivery Address
                    </h3>
                  </div>
                  <button
                    onClick={openCreateAddress}
                    className="text-xs px-2 py-1 bg-black text-white hover:bg-gray-800 transition-colors rounded"
                  >
                    + Add
                  </button>
                </div>

                {isLoadingAddresses ? (
                  <p className="text-xs text-gray-500 italic">Loading addresses...</p>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded border border-dashed border-gray-300">
                    <p className="text-xs text-gray-600 mb-2">
                      No addresses found.
                    </p>
                    <button
                      onClick={openCreateAddress}
                      className="text-xs font-medium text-black hover:underline"
                    >
                      Add an address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className={`space-y-2 overflow-y-auto ${showAllAddresses ? 'max-h-none' : 'max-h-[250px]'}`}>
                      {(showAllAddresses ? addresses : addresses.slice(0, 2)).map((addr) => (
                        <div
                          key={addr.id}
                          className={`relative border rounded-lg p-2 transition-all cursor-pointer ${
                            selectedAddressId === addr.id
                              ? "border-black bg-gray-50 ring-1 ring-black/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleAddressChange(addr.id)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="pt-0.5">
                              <div
                                className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                                  selectedAddressId === addr.id
                                    ? "border-black"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedAddressId === addr.id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1 text-xs overflow-hidden pr-12">
                              <div className="flex items-center gap-1 mb-0.5">
                                <span className="font-semibold text-gray-900 truncate">
                                  {addr.address_line1.slice(0, 25)}{addr.address_line1.length > 25 && "..."}
                                </span>
                                {addr.is_default && (
                                  <span className="text-[9px] font-bold px-1 py-0.5 bg-gray-200 text-gray-700 rounded-sm shrink-0">
                                    DEFAULT
                                  </span>
                                )}
                              </div>
                              {addr.address_line2 && (
                                <p className="text-gray-600 text-[10px] truncate">
                                  {addr.address_line2}
                                </p>
                              )}
                              <p className="text-gray-600 text-[10px]">
                                {addr.city}, {addr.state} {addr.postal_code}
                              </p>
                            </div>
                            
                            <div className="absolute top-1 right-1 flex items-center gap-0.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); openEditAddress(addr); }}
                                className="p-1 text-gray-400 hover:text-black transition-colors bg-white rounded"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors bg-white rounded"
                              >
                                <Trash className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {addresses.length > 2 && (
                      <button
                        onClick={() => setShowAllAddresses(!showAllAddresses)}
                        className="text-[10px] font-semibold text-gray-600 hover:text-black underline transition-colors"
                      >
                        {showAllAddresses ? "Show Less" : `View All (${addresses.length})`}
                      </button>
                    )}
                    
                    {shipping === -1 && selectedAddressId && (
                      <div className="mt-2 flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-red-700">
                          No courier service available for this address. Please select a different address.
                        </p>
                      </div>
                    )}
                    {shipping === -1 && !selectedAddressId && (
                      <div className="mt-2 flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-yellow-700">
                          Please select a delivery address to calculate shipping charges.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Mobile: Order Summary */}
            <div className="bg-gray-100 rounded-lg p-4 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-700" />
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Bag Total ({count})</span>
                  <span className="font-medium text-gray-900">
                    {isCartLoading ? "..." : `₹ ${bagTotal.toLocaleString()}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Product Savings:</span>
                    <span className="font-medium text-green-600">
                      - ₹ {discount.toLocaleString()}{" "}
                      {pricing?.appliedOffer && `(${pricing.appliedOffer})`}
                    </span>
                  </div>
                )}

                {tax > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">GST:</span>
                    <span className="font-medium text-green-600">
                      Included in Subtotal
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 flex items-center gap-1">
                    Shipping Charges
                    {/* <span className="text-xs text-gray-500">(i)</span> */}
                  </span>
                  <span className={`font-medium ${shipping === -1 ? 'text-gray-500' : isFreeShipping ? 'text-green-600' : 'text-gray-900'}`}>
                    {isCartLoading
                      ? "..."
                      : shipping === -1
                      ? "Not Available"
                      : isFreeShipping
                      ? `Free (₹${shipping.toLocaleString()} saved)`
                      : `₹ ${shipping.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-3 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-base text-gray-900">
                      Payable Amount
                    </p>
                    <p className="text-xs text-gray-500">(Includes Tax)</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {isCartLoading
                      ? "..."
                      : `₹ ${payableAmount.toLocaleString()}`}
                  </p>
                </div>
              </div>

              {/* <button 
                            onClick={handleCheckout}
                            className="w-full bg-red-600 text-white py-3 rounded font-medium text-sm hover:bg-red-700 transition-colors mb-3"
                        >
                            VIEW COUPONS
                        </button> */}
            </div>

            {/* Mobile: Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="flex flex-col items-center text-center p-3">
                <Shield className="w-10 h-10 text-gray-600 mb-2" />
                <p className="text-xs font-medium text-gray-900">Secure</p>
              </div>
              <div className="flex flex-col items-center text-center p-3">
                <Package className="w-10 h-10 text-gray-600 mb-2" />
                <p className="text-xs font-medium text-gray-900">
                  Easy Returns
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-3">
                <Truck className="w-10 h-10 text-gray-600 mb-2" />
                <p className="text-xs font-medium text-gray-900">
                  Free Shipping
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Original Layout */}
          <div className="hidden md:flex flex-col lg:flex-row gap-8">
            {/* Left Side - Shopping Bag */}
            <div className="flex-1">
              <div className="bg-white shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b">
                  <Package className="w-5 h-5" />
                  <h1 className="text-lg font-semibold">
                    MY SHOPPING BAG ({count})
                  </h1>
                </div>

                {/* Cart Items */}
                <div className="p-6 flex flex-col gap-6">
                  {cartItems.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-6 border-b last:border-b-0"
                    >
                      {/* Product Image */}
                      <div className="w-32 h-40 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-semibold leading-tight">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-600 leading-tight mb-2">
                              {item.description}
                            </p>

                            {/* Offer Badges */}
                            <div className="flex flex-wrap gap-2">
                              {item.badgeText && (
                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">
                                  {item.badgeText}
                                </span>
                              )}
                              {item.buyXGetYOffer.applicable &&
                                item.buyXGetYOffer.x > item.quantity && (
                                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                                    {`Add ${
                                      item.buyXGetYOffer.x - item.quantity
                                    } more to get ${item.buyXGetYOffer.y} free`}
                                  </span>
                                )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            {/* Total Price - Most Prominent */}
                            <p className="text-xl font-bold text-gray-900 mb-1">
                              ₹{" "}
                              {Number(
                                item.price * item.quantity
                              ).toLocaleString()}
                            </p>

                            {/* Unit Price - Secondary */}
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-600 mb-1">
                                ₹ {Number(item.price).toLocaleString()} each
                              </p>
                            )}

                            {/* Original Price - Tertiary */}
                            {item.originalPrice &&
                              Number(item.originalPrice) >
                                Number(item.price) && (
                                <p className="text-xs text-gray-400 line-through mb-1">
                                  ₹{" "}
                                  {Number(item.originalPrice).toLocaleString()}
                                </p>
                              )}

                            {/* Savings - Accent */}
                            {item.price > 0 &&
                              item.originalPrice > item.price && (
                                <p className="text-xs text-green-600 font-medium">
                                  Saved ₹
                                  {Math.round(
                                    item.originalPrice - item.price
                                  ).toLocaleString()}{" "}
                                  {item.badgeText && `(Incl. Offer)`}
                                </p>
                              )}
                          </div>
                        </div>

                        {/* Size and Quantity Selectors */}
                        <div className="flex gap-4 mt-2 mb-2">
                          {item.productType === "clothing" && (
                            <div>
                              <label className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide">
                                SIZE
                              </label>
                              <div className="relative">
                                <select
                                  className="w-20 h-10 px-3 pr-8 rounded border border-gray-300 bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={
                                    selectedSizes[item.id] ??
                                    item.size?.size ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleSizeChange(item, e.target.value)
                                  }
                                >
                                  {(item.possibleSizes ?? []).map(
                                    (s: {
                                      size: string;
                                      variantId: string;
                                    }) => (
                                      <option key={s.variantId} value={s.size}>
                                        {s.size}
                                      </option>
                                    )
                                  )}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                              </div>
                            </div>
                          )}

                          {item.productType === "perfume" && (
                            <div>
                              <label className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide">
                                VOLUME
                              </label>
                              <div className="relative">
                                <select
                                  className="w-24 h-10 px-3 rounded pr-8 border border-gray-300 bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={
                                    selectedVolumes[item.id] ??
                                    item.ml_volume?.ml_volume ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleVolumeChange(item, e.target.value)
                                  }
                                >
                                  {(item.possibleVolumes ?? []).map(
                                    (v: {
                                      ml_volume: string;
                                      variantId: string;
                                    }) => (
                                      <option
                                        key={v.variantId}
                                        value={v.ml_volume}
                                      >
                                        {v.ml_volume}
                                      </option>
                                    )
                                  )}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide">
                              QUANTITY
                            </label>
                            <div className="flex items-center border border-gray-300 rounded w-24 h-10">
                              <button
                                onClick={() => {
                                  const currentQty =
                                    selectedQuantities[item.id] ??
                                    item.quantity;
                                  if (currentQty > 1) {
                                    handleQuantityChange(item, currentQty - 1);
                                  }
                                }}
                                disabled={
                                  (selectedQuantities[item.id] ??
                                    item.quantity) <= 1
                                }
                                className="h-full px-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border-r border-gray-300"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <div className="flex-1 flex items-center justify-center h-full">
                                <span className="text-sm font-medium">
                                  {selectedQuantities[item.id] ?? item.quantity}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  const currentQty =
                                    selectedQuantities[item.id] ??
                                    item.quantity;
                                  handleQuantityChange(item, currentQty + 1);
                                }}
                                className="h-full px-2 hover:bg-gray-100 transition-colors flex items-center justify-center border-l border-gray-300"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            {item.buyXGetYOffer.applicable &&
                              item.buyXGetYOffer.x < item.quantity && (
                                <div className="mt-1 text-xs font-medium text-green-600 flex items-center gap-1">
                                  <span className="inline-block">🎁</span>
                                  <span>+{item.buyXGetYOffer.y} FREE</span>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 items-end justify-end text-sm">
                          <button
                            onClick={() => moveToWishlist(item)}
                            className="flex items-center rounded gap-2 px-3 py-2 border border-gray-300 bg-pink-50 hover:bg-pink-100 hover:border-pink-400 text-pink-600 hover:text-pink-700 transition-colors cursor-pointer"
                          >
                            <Heart className="w-4 h-4" />
                            MOVE TO WISHLIST
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center rounded gap-2 px-3 py-2 border border-gray-300 bg-red-50 hover:bg-red-100 hover:border-red-400 text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="w-full lg:w-96">
              <div className="sticky top-25">
                {/* Address Selection */}
                {user && (
                  <div className="bg-white shadow-sm mb-6">
                    <div className="flex items-center justify-between p-6 border-b">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">DELIVERY ADDRESS</h2>
                      </div>
                      <button
                        onClick={openCreateAddress}
                        className="text-xs px-3 py-1.5 bg-black text-white hover:bg-gray-800 transition-colors rounded"
                      >
                        + Add New
                      </button>
                    </div>
                    <div className="p-6">
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
                          <div className={`space-y-3 overflow-y-auto pr-1 ${showAllAddresses ? 'max-h-none' : 'max-h-[300px]'}`}>
                            {(showAllAddresses ? addresses : addresses.slice(0, 2)).map((addr) => (
                              <div
                                key={addr.id}
                                className={`relative border rounded-lg p-3 transition-all cursor-pointer ${
                                  selectedAddressId === addr.id
                                    ? "border-black bg-gray-50 ring-1 ring-black/5"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => handleAddressChange(addr.id)}
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
                                  <div className="flex-1 text-sm overflow-hidden pr-16">
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
                                      <Trash className="w-3.5 h-3.5" />
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
                          
                          {shipping === -1 && selectedAddressId && (
                            <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                              <p className="text-sm text-red-700">
                                No courier service available for this address. Please select a different address.
                              </p>
                            </div>
                          )}
                          {shipping === -1 && !selectedAddressId && (
                            <div className="mt-3 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                              <p className="text-sm text-yellow-700">
                                Please select a delivery address to calculate shipping charges.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-white shadow-sm ">
                  {/* Header */}
                  <div className="flex items-center gap-3 p-6 border-b">
                    <Package className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">ORDER SUMMARY</h2>
                  </div>

                  {/* Summary Details */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center text-sm gap-4">
                        <span className="text-gray-700">
                          Bag Total ({count})
                        </span>
                        <span className="font-medium whitespace-nowrap">
                          {isCartLoading
                            ? "Loading..."
                            : `₹ ${bagTotal.toLocaleString()}`}
                        </span>
                      </div>

                      {pricing && pricing.discount > 0 && (
                        <div className="flex justify-between items-center text-sm gap-4">
                          <span className="text-gray-700">Discount:</span>
                          <span className="font-medium text-green-600 whitespace-nowrap">
                            - ₹ {pricing.discount.toLocaleString()}{" "}
                            {pricing?.appliedOffer &&
                              `(${pricing.appliedOffer})`}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm gap-4">
                        <span className="text-gray-700">GST:</span>
                        <span className="font-medium text-green-600 whitespace-nowrap">
                          {isCartLoading
                            ? "Loading..."
                            : "Included in Subtotal"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm gap-4">
                        <span className="text-gray-700">Shipping Charges</span>
                        <span className={`font-medium whitespace-nowrap ${shipping === -1 ? 'text-gray-500' : isFreeShipping ? 'text-green-600' : 'text-gray-900'}`}>
                          {isCartLoading
                            ? "Loading..."
                            : shipping === -1
                            ? "Not Available"
                            : isFreeShipping
                            ? `Free (₹${shipping.toLocaleString()} saved)`
                            : `₹ ${shipping.toLocaleString()}`}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">
                            Payable Amount
                          </p>
                          <p className="text-xs text-gray-500">
                            (Includes Tax)
                          </p>
                        </div>
                        <p className="text-lg font-semibold whitespace-nowrap">
                          {isCartLoading
                            ? "Loading..."
                            : `₹ ${payableAmount.toLocaleString()}`}
                        </p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={shipping === -1}
                      className={`w-full py-3 font-medium text-sm transition-colors mb-4 ${
                        shipping === -1
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {shipping === -1 ? 'SHIPPING NOT AVAILABLE' : 'CHECK OUT'}
                    </button>

                    {/* Coupon Link */}
                    {/* <div className="text-center">
                                    <button className="text-red-600 text-sm font-medium hover:text-red-700 transition-colors">
                                        VIEW COUPONS
                                    </button>
                                </div> */}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 bg-white shadow-sm p-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <Shield className="w-8 h-8 text-gray-600 mb-2" />
                      <p className="text-xs font-medium text-gray-900">
                        Secure
                      </p>
                      <p className="text-xs text-gray-600">Checkout</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Package className="w-8 h-8 text-gray-600 mb-2" />
                      <p className="text-xs font-medium text-gray-900">
                        Easy returns &
                      </p>
                      <p className="text-xs text-gray-600">exchanges</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Truck className="w-8 h-8 text-gray-600 mb-2" />
                      <p className="text-xs font-medium text-gray-900">Free</p>
                      <p className="text-xs text-gray-600">shipping</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Sticky Bottom Checkout Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xl font-medium text-gray-700">
                Total: ₹ {payableAmount.toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={shipping === -1}
              className={`px-12 py-3 rounded font-semibold text-sm transition-colors ${
                shipping === -1
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {shipping === -1 ? 'SHIPPING NOT AVAILABLE' : 'CHECK OUT'}
            </button>
          </div>
        </div>
      </div>
      
      {showAddressForm && (
        <AddressForm
          method={showAddressForm.method}
          addressId={showAddressForm.addressId}
          defaultValues={showAddressForm.defaultValues}
          onCancel={() => setShowAddressForm(null)}
        />
      )}
      
      {showCheckoutModal && (
        <CheckoutPageModal
          open={showCheckoutModal}
          onClose={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('from');
            params.delete('checkoutmodal');
            const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
            router.push(newUrl);
            setShowCheckoutModal(false);
          }}
          pricing={pricing}
          cartId={cartId}
          appliedCoupon={null}
          selectedAddress={addresses.find(addr => addr.id === selectedAddressId) || null}
        />
      )}
    </>
  );
}

export default function ShoppingCartPageSuspense() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ShoppingCartPage />
    </Suspense>
  );
}
