"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/cartContext';
import { AddressType, CreateAddressArgs } from '@/types/address';
import { deleteAddress, getAddresses } from '@/utils/address';
import AddressForm from '@/components/Address/AddressForm';
import toast from 'react-hot-toast';
import { Package, Shield, Truck, Trash2, Pencil, Plus } from 'lucide-react';
import { intiateOrder, MOCK_ORDER_CALLBACK } from '@/utils/orders';
import { Pricing, CartItem } from '@/types/cart';

export default function CheckoutPage() {
    const { user, dbUser, token } = useAuth();
    const { cartId, cartItems, pricing: cartPricing } = useCart();

    const [addresses, setAddresses] = useState<AddressType[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showAddressForm, setShowAddressForm] = useState<null | { method: 'create' | 'update'; addressId?: string; defaultValues?: CreateAddressArgs }>(null);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    
    const [pricing, setPricing] = useState<Pricing | null>(cartPricing);

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
            const def = addresses.find(a => a.is_default);
            setSelectedAddressId(prev => prev ?? (def ? def.id : addresses[0]?.id ?? null));
        } else {
            setSelectedAddressId(null);
        }
    }, [addresses]);


    const bagTotal = pricing?.subtotal || 0;
    const discount = pricing?.discount || 0;
    const shipping = pricing?.shipping || 0;
    const payableAmount = pricing?.total || 0;



    const handleDeleteAddress = async (addressId: string) => {
        if (!token) {
            toast.error('Authentication required');
            return;
        }
        const confirmed = window.confirm('Delete this address?');
        if (!confirmed) return;
        const res = await deleteAddress(addressId, token);
        if (res.success) {
            toast.success('Address deleted');
            setAddresses(prev => prev.filter(a => a.id !== addressId));
        } else {
            toast.error(res.message || 'Failed to delete');
        }
    };

    const openCreateAddress = () => {
        setShowAddressForm({ method: 'create' });
    };

    const openEditAddress = (addr: AddressType) => {
        const defaults: CreateAddressArgs = {
            address_line1: addr.address_line1,
            address_line2: addr.address_line2 || '',
            city: addr.city,
            postal_code: addr.postal_code,
            country: addr.country,
            state: addr.state || '',
            is_default: addr.is_default,
        };
        setShowAddressForm({ method: 'update', addressId: addr.id, defaultValues: defaults });
    };

    const handlePay = async () => {
        if (!user) {
            toast.error('Please login to proceed');
            return;
        }
        if (!selectedAddressId) {
            toast.error('Select a delivery address');
            return;
        }
        if (!token) {
            toast.error('Authentication required');
            return;
        }
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setIsProcessingPayment(true);

        try {
            if (!cartId) {
                toast.error('Unable to retrieve cart information');
                setIsProcessingPayment(false);
                return;
            }

            const orderData = {
                cartId: cartId,
                shippingAddressId: selectedAddressId,
                billingAddressId: selectedAddressId,
                couponCode: appliedCoupon || '',
                notes: ''
            };

            const result = await intiateOrder(orderData, token);

            if (result.success && result.checkoutPageUrl) {
                window.location.href = result.checkoutPageUrl;
            } else {
                toast.error(result.message || 'Failed to initiate order');
            }
        } catch (error) {
            console.error('Error initiating order:', error);
            toast.error('An error occurred while processing your order');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const userName = user?.displayName || dbUser?.first_name + ' ' + dbUser?.last_name || '—';
    const userEmail = user?.email || '—';
    const userPhone = dbUser && (dbUser as any).phone ? (dbUser as any).phone : (user?.phoneNumber || '—');

    return (
        <div className="min-h-screen bg-gray-50 md:pt-35 pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: User details and addresses */}
                    <div className="flex-1">
                        <div className="bg-white shadow-sm">
                            <div className="flex items-center gap-3 p-6 border-b">
                                <Shield className="w-5 h-5" />
                                <h1 className="text-lg font-semibold">CHECKOUT</h1>
                            </div>

                            {/* Account Summary */}
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-gray-900 tracking-wide">ACCOUNT</h2>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p className="text-gray-900">{userName}</p>
                                    <p className="text-gray-700">{userEmail}</p>
                                    {userPhone !== '—' && <p className="text-gray-700">{userPhone}</p>}
                                </div>
                            </div>

                            {/* Address Selection */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-sm font-semibold text-gray-900 tracking-wide">DELIVERY ADDRESS</h2>
                                        <p className="text-xs text-gray-600 mt-0.5">Required</p>
                                    </div>
                                    <button onClick={openCreateAddress} className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer">
                                        <Plus className="w-4 h-4" />
                                        Add Address
                                    </button>
                                </div>

                                {isLoadingAddresses ? (
                                    <p className="text-sm text-gray-600">Loading addresses...</p>
                                ) : addresses.length === 0 ? (
                                    <p className="text-sm text-gray-600">No addresses found. Please add one.</p>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {addresses.map(addr => (
                                            <div key={addr.id} className={`border ${selectedAddressId === addr.id ? 'border-black' : 'border-gray-200'} p-4 text-sm bg-white`}>
                                                <div className="flex items-start justify-between gap-4">
                                                    <label className="flex items-start gap-3 cursor-pointer w-full">
                                                        <input
                                                            type="radio"
                                                            name="address"
                                                            checked={selectedAddressId === addr.id}
                                                            onChange={() => setSelectedAddressId(addr.id)}
                                                            className="mt-1"
                                                        />
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-gray-900">{addr.address_line1}</span>
                                                                {addr.is_default && (
                                                                    <span className="text-xs px-2 py-0.5 border border-gray-300">Default</span>
                                                                )}
                                                            </div>
                                                            {addr.address_line2 ? (
                                                                <p className="text-gray-700">{addr.address_line2}</p>
                                                            ) : null}
                                                            <p className="text-gray-700">{addr.city}, {addr.state || ''} {addr.postal_code}</p>
                                                            <p className="text-gray-700">{addr.country}</p>
                                                        </div>
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => openEditAddress(addr)} className="p-2 border border-gray-300 hover:bg-gray-50" aria-label="Edit address">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 border border-gray-300 hover:bg-red-50" aria-label="Delete address">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary and Payment */}
                    <div className="w-full lg:w-[28rem]">
                        <div className="bg-white shadow-sm">
                            <div className="flex items-center gap-3 p-6 border-b">
                                <Package className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">ORDER SUMMARY</h2>
                            </div>
                            <div className="p-6">
                                {/* Items (Responsive) */}
                                <div className="mb-6 md:max-h-80 max-h-none overflow-y-auto pr-1">
                                    {cartItems.length === 0 ? (
                                        <p className="text-sm text-gray-600">Your cart is empty.</p>
                                    ) : (
                                        <div className="border border-gray-200">
                                            {/* Header (desktop) */}
                                            <div className="hidden md:grid grid-cols-12 bg-gray-50 text-xs font-semibold text-gray-900">
                                                <div className="px-3 py-2 col-span-5">Name</div>
                                                <div className="px-3 py-2 text-right col-span-1">Qty</div>
                                                <div className="px-3 py-2 text-right col-span-3">Price</div>
                                                <div className="px-3 py-2 text-right col-span-3">Subtotal</div>
                                            </div>
                                            {cartItems.map((item) => {
                                                const price = Number(item.price) || 0;
                                                const qty = Number(item.quantity) || 1;
                                                const subtotal = price * qty;
                                                return (
                                                    <React.Fragment key={item.id}>
                                                        {/* Row (desktop) */}
                                                        <div className="hidden md:grid grid-cols-12 text-sm border-t border-gray-200">
                                                            <div className="px-3 py-2 col-span-5 break-words whitespace-normal" title={item.name}>
                                                                <div className="flex flex-col gap-1">
                                                                    <span>{item.name}</span>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300 w-fit">
                                                                            {item.productType === 'clothing' ? item.size?.size : item.ml_volume?.ml_volume}
                                                                        </span>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="px-3 py-2 text-right col-span-1">{item.buyXGetYOffer.applicable && item.buyXGetYOffer.x <= qty? item.buyXGetYOffer.y + qty: qty}</div>
                                                            <div className="px-3 py-2 text-right col-span-3">₹ {price.toLocaleString()}</div>
                                                            <div className="px-3 py-2 text-right col-span-3">₹ {subtotal.toLocaleString()}</div>
                                                        </div>
                                                        {/* Card (mobile) */}
                                                        <div className="md:hidden border-t border-gray-200 px-3 py-3 text-sm">
                                                            <div className="font-semibold text-gray-900 mb-2 break-words whitespace-normal" title={item.name}>{item.name}</div>
                                                           
                                                            
                                                            <div className="grid grid-cols-2 gap-y-2 text-gray-800">
                                                                <div className="text-gray-600">Variant</div>
                                                                <div className="text-right">{item.productType === 'clothing' ? item.size?.size : item.ml_volume?.ml_volume}</div>
                                                                <div className="text-gray-600">Quantity</div>
                                                                <div className="text-right">{qty}</div>
                                                                <div className="text-gray-600">Price</div>
                                                                <div className="text-right">₹ {price.toLocaleString()}</div>
                                                            </div>
                                                            <div className="mt-3 pt-2 border-t flex items-center justify-between">
                                                                <span className="font-medium">Subtotal</span>
                                                                <span className="font-semibold">₹ {subtotal.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            })}
                                            {/* Total row */}
                                            <div className="hidden md:grid grid-cols-12 border-t border-gray-300 bg-gray-50 text-sm font-semibold">
                                                <div className="px-3 py-2 col-span-8 text-right">Total</div>
                                                <div className="px-3 py-2 text-right col-span-4">
                                                    {`₹ ${bagTotal.toLocaleString()}`}
                                                </div>
                                            </div>
                                            <div className="md:hidden border-t border-gray-300 bg-gray-50 text-sm font-semibold px-3 py-2 flex items-center justify-between">
                                                <div>Total</div>
                                                <div>{`₹ ${bagTotal.toLocaleString()}`}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>


                                {/* Applied Coupon Display (if exists) */}
                                {appliedCoupon && (
                                    <div className="mb-6 p-3 bg-green-50 border border-green-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-900 mb-0.5">COUPON APPLIED</p>
                                                <p className="text-sm text-gray-700">{appliedCoupon}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {/* Summary Details (post-table) */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-sm gap-4">
                                        <span className="text-gray-700">Subtotal</span>
                                        <span className="font-medium whitespace-nowrap">
                                            ₹ {bagTotal.toLocaleString()}
                                        </span>
                                    </div>

                                    {pricing && pricing.discount > 0 && (
                                        <div className="flex justify-between items-center text-sm gap-4">
                                            <span className="text-gray-700">
                                                Discount
                                            </span>
                                            <span className="font-medium text-green-600 whitespace-nowrap">
                                                - ₹ {pricing.discount.toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-sm gap-4">
                                        <span className="text-gray-700">
                                            Tax
                                        </span>
                                        <span className="font-medium whitespace-nowrap">
                                            Included in Subtotal
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm gap-4">
                                        <span className="text-gray-700">Shipping</span>
                                        <span className="font-medium text-green-600 whitespace-nowrap">
                                            {(shipping === 0 ? 'Free' : `₹ ${shipping.toLocaleString()}`)}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-lg">Final Amount Payable</p>
                                            <p className="text-xs text-gray-500">(Includes all taxes)</p>
                                        </div>
                                        <p className="text-lg font-semibold whitespace-nowrap">
                                            ₹ {payableAmount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handlePay} 
                                    disabled={isProcessingPayment || cartItems.length === 0}
                                    className="w-full bg-black text-white py-3 font-medium text-sm hover:bg-gray-800 transition-colors mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    
                                >
                                    {isProcessingPayment ? 'Processing...' : `Pay ₹${payableAmount.toLocaleString()}`}
                                </button>
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
