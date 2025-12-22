"use client";
import React, { useEffect, useState } from 'react';
import { Heart, Trash2, ChevronDown, Shield, Package, Truck } from 'lucide-react';
import { useCart } from '@/contexts/cartContext';
import { CartItem, CheckoutPricing } from '@/types/cart';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getCheckoutPricing } from '@/utils/cart';

export default function ShoppingCartPage() {
    const { removeFromCart, updateCartItem, count, cartId } = useCart();
    const cartItems: CartItem[] = [];
    const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
    const [selectedVolumes, setSelectedVolumes] = useState<{ [key: string]: string }>({});
    const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});
    const { user, needsCompleteSetup } = useAuth()
    const { moveToWishlist } = useCart();
    const router = useRouter();
    const [pricing, setPricing] = useState<CheckoutPricing | null>(null);
    const [isLoadingPricing, setIsLoadingPricing] = useState(false);

    const getCurrentQuantity = (item: CartItem): number => {
        const q = selectedQuantities[item.id] ?? item.quantity ?? 1;
        const asNum = Number(q);
        return Number.isFinite(asNum) && asNum > 0 ? asNum : 1;
    };

    const getCurrentVariantId = (item: CartItem): string | null => {
        if (item.productType === "clothing") {
            const selectedSizeValue = selectedSizes[item.id];
            if (selectedSizeValue && item.possibleSizes && item.possibleSizes.length > 0) {
                const match = item.possibleSizes.find(s => s.size === selectedSizeValue);
                if (match) return match.variantId;
            }
            if (item.size?.variantId) return item.size.variantId;
            if (item.size?.size && item.possibleSizes) {
                const match = item.possibleSizes.find(s => s.size === item.size!.size);
                return match ? match.variantId : null;
            }
            return null;
        }
        if (item.productType === "perfume") {
            const selectedVolValue = selectedVolumes[item.id];
            if (selectedVolValue && item.possibleVolumes && item.possibleVolumes.length > 0) {
                const match = item.possibleVolumes.find(v => v.ml_volume === selectedVolValue);
                if (match) return match.variantId;
            }
            if (item.ml_volume?.variantId) return item.ml_volume.variantId;
            if (item.ml_volume?.ml_volume && item.possibleVolumes) {
                const match = item.possibleVolumes.find(v => v.ml_volume === item.ml_volume!.ml_volume);
                return match ? match.variantId : null;
            }
            return null;
        }
        return null;
    };

    const handleSizeChange = async (item: CartItem, newSize: string) => {
        setSelectedSizes(prev => ({ ...prev, [item.id]: newSize }));
        const match = (item.possibleSizes ?? []).find(s => s.size === newSize);
        if (match) {
            await updateCartItem(item.id, { productVariantId: match.variantId, quantity: getCurrentQuantity(item) });
        }
    };

    const handleVolumeChange = async (item: CartItem, newVolume: string) => {
        setSelectedVolumes(prev => ({ ...prev, [item.id]: newVolume }));
        const match = (item.possibleVolumes ?? []).find(v => v.ml_volume === newVolume);
        if (match) {
            await updateCartItem(item.id, { productVariantId: match.variantId, quantity: getCurrentQuantity(item) });
        }
    };

    const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
        const qty = Number(newQuantity);
        setSelectedQuantities(prev => ({ ...prev, [item.id]: qty }));
        const variantId = getCurrentVariantId(item);
        if (variantId) {
            await updateCartItem(item.id, { productVariantId: variantId, quantity: qty });
        }
    };

    useEffect(() => {
        const fetchPricing = async () => {
            if (!cartId) {
                setPricing(null);
                return;
            }
            setIsLoadingPricing(true);
            try {
                const pricingData = await getCheckoutPricing(cartId);
                setPricing(pricingData);
            } catch (error) {
                console.error('Error fetching pricing:', error);
            } finally {
                setIsLoadingPricing(false);
            }
        };
        fetchPricing();
    }, [cartId]);

    const bagTotal = pricing?.subtotal || 0;
    const shipping = pricing?.shippingAmount.shippingAmount || 0;
    const payableAmount = pricing?.totalAmount || 0;
    const discount = pricing?.discountAmount ? (pricing.discountAmount.beforeDiscount - pricing.discountAmount.afterDiscount) : 0;
    const tax = pricing?.taxAmount ? (pricing.taxAmount.afterTaxAddition - pricing.taxAmount.beforeTaxAddition) : 0;

    const handleCheckout = () => {
        if (!user) {
            toast.error('Please login to checkout');
            router.push('/auth?redirect=/checkout');
        } else if (needsCompleteSetup) {
            toast.error('Please complete your profile to checkout');
            router.push('/complete-profile?redirect=/checkout');
        } else {
            router.push('/checkout');
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-32 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
                {/* Mobile: Cart Items */}
                <div className="space-y-4 md:hidden">
                    {cartItems.map((item: CartItem) => (
                        <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                            <div className="flex gap-3 p-4">
                                {/* Product Image */}
                                <div className="w-32 h-48 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
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
                                                {item.name.split(' ')[0]}
                                            </p>
                                            <p className="text-sm text-gray-800 font-medium leading-tight line-clamp-2">
                                                {item.description || item.name}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => moveToWishlist(item)}
                                                className="p-2 hover:bg-pink-50 rounded-full transition-colors"
                                            >
                                                <Heart className="w-5 h-5 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="flex items-baseline gap-2 mb-3">
                                        {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                                            <span className="text-xs text-gray-400 line-through">
                                                ₹ {Number(item.originalPrice).toLocaleString()}
                                            </span>
                                        )}
                                        <span className="text-lg font-bold text-gray-900">
                                            ₹ {Number(item.price).toLocaleString()}
                                        </span>
                                        {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                                            <span className="text-xs font-semibold text-red-600">
                                                {Math.round((1 - Number(item.price) / Number(item.originalPrice)) * 100)}% Off
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-500 mb-3">Inclusive of GST benefit</p>

                                    {/* Size and Quantity Selectors */}
                                    <div className="flex gap-3 mt-auto">
                                        {item.productType === "clothing" && (
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Size:</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full h-9 px-3 pr-8 border border-gray-300 rounded bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                                                        value={selectedSizes[item.id] ?? item.size?.size ?? ""}
                                                        onChange={(e) => handleSizeChange(item, e.target.value)}
                                                    >
                                                        {(item.possibleSizes ?? []).map((s: { size: string; variantId: string }) => (
                                                            <option key={s.variantId} value={s.size}>{s.size}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                </div>
                                            </div>
                                        )}

                                        {item.productType === "perfume" && (
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Volume:</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full h-9 px-3 pr-8 border border-gray-300 rounded bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                                                        value={selectedVolumes[item.id] ?? item.ml_volume?.ml_volume ?? ""}
                                                        onChange={(e) => handleVolumeChange(item, e.target.value)}
                                                    >
                                                        {(item.possibleVolumes ?? []).map((v: { ml_volume: string; variantId: string }) => (
                                                            <option key={v.variantId} value={v.ml_volume}>{v.ml_volume}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Qty:</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full h-9 px-3 pr-8 border border-gray-300 rounded bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                                                    value={selectedQuantities[item.id] ?? item.quantity}
                                                    onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(qty => (
                                                        <option key={qty} value={qty}>{qty}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Mobile: Order Summary */}
                    <div className="bg-gray-100 rounded-lg p-4 mt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-gray-700" />
                            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">Order Summary</h2>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">Bag Total ({count})</span>
                                <span className="font-medium text-gray-900">
                                    {isLoadingPricing ? '...' : `₹ ${bagTotal.toLocaleString()}`}
                                </span>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700">Product Savings:</span>
                                    <span className="font-medium text-green-600">
                                        - ₹ {discount.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {tax > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700">GST Rate Reduction:</span>
                                    <span className="font-medium text-green-600">
                                        - ₹ {tax.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700 flex items-center gap-1">
                                    Shipping Charges
                                    <span className="text-xs text-gray-500">(i)</span>
                                </span>
                                <span className="font-medium text-green-600">
                                    {isLoadingPricing ? '...' : (shipping === 0 ? 'Free' : `₹ ${shipping.toLocaleString()}`)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-300 pt-3 mb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-base text-gray-900">Payable Amount</p>
                                    <p className="text-xs text-gray-500">(Includes Tax)</p>
                                </div>
                                <p className="text-lg font-bold text-gray-900">
                                    {isLoadingPricing ? '...' : `₹ ${payableAmount.toLocaleString()}`}
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-red-600 text-white py-3 rounded font-medium text-sm hover:bg-red-700 transition-colors mb-3"
                        >
                            VIEW COUPONS
                        </button>
                    </div>

                    {/* Mobile: Trust Badges */}
                    <div className="grid grid-cols-3 gap-2 mt-6">
                        <div className="flex flex-col items-center text-center p-3">
                            <Shield className="w-10 h-10 text-gray-600 mb-2" />
                            <p className="text-xs font-medium text-gray-900">Secure</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-3">
                            <Package className="w-10 h-10 text-gray-600 mb-2" />
                            <p className="text-xs font-medium text-gray-900">Easy Returns</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-3">
                            <Truck className="w-10 h-10 text-gray-600 mb-2" />
                            <p className="text-xs font-medium text-gray-900">Free Shipping</p>
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
                                <h1 className="text-lg font-semibold">MY SHOPPING BAG ({count})</h1>
                            </div>

                            {/* Cart Items */}
                            <div className="p-6 flex flex-col gap-6">
                                {cartItems.map((item: CartItem) => (
                                    <div key={item.id} className="flex gap-4 pb-6 border-b last:border-b-0">
                                        {/* Product Image */}
                                        <div className="w-32 h-40 flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="text-sm text-gray-900 font-semibold leading-tight">{item.name}</p>
                                                    <p className="text-xs text-gray-600 leading-tight">{item.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold">₹ {Number(item.price).toLocaleString()}</p>
                                                </div>
                                            </div>

                                            {/* Size and Quantity Selectors */}
                                            <div className="flex gap-4 mt-2 mb-2">
                                                {item.productType === "clothing" && (
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide">SIZE</label>
                                                        <div className="relative">
                                                            <select
                                                                className="w-20 h-10 px-3 pr-8 border border-gray-300 bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                value={selectedSizes[item.id] ?? item.size?.size ?? ""}
                                                                onChange={(e) => handleSizeChange(item, e.target.value)}
                                                            >
                                                                {(item.possibleSizes ?? []).map((s: { size: string; variantId: string }) => (
                                                                    <option key={s.variantId} value={s.size}>{s.size}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                )}

                                                {item.productType === "perfume" && (
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide">VOLUME</label>
                                                        <div className="relative">
                                                            <select
                                                                className="w-24 h-10 px-3 pr-8 border border-gray-300 bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                value={selectedVolumes[item.id] ?? item.ml_volume?.ml_volume ?? ""}
                                                                onChange={(e) => handleVolumeChange(item, e.target.value)}
                                                            >
                                                                {(item.possibleVolumes ?? []).map((v: { ml_volume: string; variantId: string }) => (
                                                                    <option key={v.variantId} value={v.ml_volume}>{v.ml_volume}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide">QUANTITY</label>
                                                    <div className="relative">
                                                        <select
                                                            className="w-16 h-10 px-3 pr-8 border border-gray-300 bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={selectedQuantities[item.id] ?? item.quantity}
                                                            onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                                                        >
                                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(qty => (
                                                                <option key={qty} value={qty}>{qty}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-4 items-end justify-end text-sm">
                                                <button
                                                    onClick={() => moveToWishlist(item)}
                                                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white hover:bg-pink-50 hover:border-pink-300 text-gray-700 hover:text-pink-600 transition-colors cursor-pointer"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                    MOVE TO WISHLIST
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white hover:bg-red-50 hover:border-red-300 text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
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
                        <div className="bg-white shadow-sm">
                            {/* Header */}
                            <div className="flex items-center gap-3 p-6 border-b">
                                <Package className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">ORDER SUMMARY</h2>
                            </div>

                            {/* Summary Details */}
                            <div className="p-6">
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-sm gap-4">
                                        <span className="text-gray-700">Bag Total ({count})</span>
                                        <span className="font-medium whitespace-nowrap">
                                            {isLoadingPricing ? 'Loading...' : `₹ ${bagTotal.toLocaleString()}`}
                                        </span>
                                    </div>
                                    
                                    {pricing?.discountAmount && (pricing.discountAmount.beforeDiscount - pricing.discountAmount.afterDiscount) > 0 && (
                                        <div className="flex justify-between items-center text-sm gap-4">
                                            <span className="text-gray-700">
                                                Product Savings:
                                            </span>
                                            <span className="font-medium text-green-600 whitespace-nowrap">
                                                - ₹ {(pricing.discountAmount.beforeDiscount - pricing.discountAmount.afterDiscount).toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-sm gap-4">
                                        <span className="text-gray-700">
                                            GST Rate Reduction:
                                        </span>
                                        <span className="font-medium text-green-600 whitespace-nowrap">
                                            {isLoadingPricing ? 'Loading...' : (
                                                pricing?.taxAmount ? 
                                                `- ₹ ${(pricing.taxAmount.afterTaxAddition - pricing.taxAmount.beforeTaxAddition).toLocaleString()}` : 
                                                '- ₹ 237'
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm gap-4">
                                        <span className="text-gray-700">Shipping Charges</span>
                                        <span className="font-medium text-green-600 whitespace-nowrap">
                                            {isLoadingPricing ? 'Loading...' : (shipping === 0 ? 'Free' : `₹ ${shipping.toLocaleString()}`)}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-lg">Payable Amount</p>
                                            <p className="text-xs text-gray-500">(Includes Tax)</p>
                                        </div>
                                        <p className="text-lg font-semibold whitespace-nowrap">
                                            {isLoadingPricing ? 'Loading...' : `₹ ${payableAmount.toLocaleString()}`}
                                        </p>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button onClick={handleCheckout} className="w-full bg-black text-white py-3 font-medium text-sm hover:bg-gray-800 transition-colors mb-4">
                                    CHECK OUT ({count})
                                </button>

                                {/* Coupon Link */}
                                <div className="text-center">
                                    <button className="text-red-600 text-sm font-medium hover:text-red-700 transition-colors">
                                        VIEW COUPONS
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-6 bg-white shadow-sm p-6">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="flex flex-col items-center">
                                    <Shield className="w-8 h-8 text-gray-600 mb-2" />
                                    <p className="text-xs font-medium text-gray-900">Secure</p>
                                    <p className="text-xs text-gray-600">Checkout</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Package className="w-8 h-8 text-gray-600 mb-2" />
                                    <p className="text-xs font-medium text-gray-900">Easy returns &</p>
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

            {/* Mobile: Sticky Bottom Checkout Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-xs text-gray-500">Total: ₹ {payableAmount.toLocaleString()}</p>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        className="bg-black text-white px-8 py-3 rounded font-semibold text-sm hover:bg-gray-800 transition-colors"
                    >
                        CHECK OUT ({count})
                    </button>
                </div>
            </div>
        </div>
    );
}