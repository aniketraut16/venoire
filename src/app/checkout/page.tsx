"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/cartContext';
import { AddressType, CreateAddressArgs } from '@/types/address';
import { deleteAddress, getAddresses } from '@/utils/address';
import AddressForm from '@/components/Address/AddressForm';
import toast from 'react-hot-toast';
import { ChevronDown, Package, Shield, Truck, Trash2, Pencil, Plus } from 'lucide-react';
import { getCartId } from '@/utils/cart';
import { intiateOrder, MOCK_ORDER_CALLBACK } from '@/utils/orders';
import MockPaymentGateway from '@/components/PaymentGateway/MockPaymentGateway';
import OrderSuccess from '@/components/Order/OrderSuccess';

export default function CheckoutPage() {
    const { user, dbUser, token } = useAuth();
    const { items: cartItems, cartId } = useCart();

    const [addresses, setAddresses] = useState<AddressType[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showAddressForm, setShowAddressForm] = useState<null | { method: 'create' | 'update'; addressId?: string; defaultValues?: CreateAddressArgs }>(null);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    const [couponCode, setCouponCode] = useState<string>("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    const [showPaymentGateway, setShowPaymentGateway] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    
    const [orderSuccess, setOrderSuccess] = useState<{
        orderId: string;
        transactionId: string;
        amount: number;
    } | null>(null);

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

    const bagTotal = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    }, [cartItems]);

    const discount = useMemo(() => {
        if (!appliedCoupon) return 0;
        const code = appliedCoupon.trim().toUpperCase();
        // Simple demo rules: percentage or flat based on code
        if (code === 'SAVE10') return Math.round(bagTotal * 0.10);
        if (code === 'WELCOME100') return 100;
        if (code === 'FREESHIP') return 0; // handled as free shipping by default already
        return 0;
    }, [appliedCoupon, bagTotal]);

    const shipping = 0;
    const payableAmount = Math.max(0, bagTotal - discount + shipping);

    const applyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        if (!code) {
            toast.error('Enter a coupon code');
            return;
        }
        const validCodes = ['SAVE10', 'WELCOME100', 'FREESHIP'];
        if (!validCodes.includes(code)) {
            toast.error('Invalid or expired coupon');
            return;
        }
        setAppliedCoupon(code);
        toast.success('Coupon applied');
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        toast.success('Coupon removed');
    };

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

            if (result.success && result.orderId) {
                setCurrentOrderId(result.orderId);
                setShowPaymentGateway(true);
                toast.success('Order initiated successfully');
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

    const handlePaymentCompleted = async (
        status: "success" | "failed",
        transactionId: string,
        amount: number,
        paymentMethod: "credit_card" | "debit_card" | "netbanking" | "wallet" | "upi",
        gatewayResponse: JSON | null
    ) => {
        setShowPaymentGateway(false);

        if (status === 'failed') {
            toast.error('Payment failed. Please try again.');
            return;
        }

        if (!currentOrderId) {
            toast.error('Order ID not found');
            return;
        }

        try {
            const callbackData = {
                orderId: currentOrderId,
                transactionId: transactionId,
                paymentStatus: status,
                amount: amount,
                paymentMethod: paymentMethod,
                gatewayResponse: gatewayResponse
            };

            const success = await MOCK_ORDER_CALLBACK(callbackData);

            if (success) {
                setOrderSuccess({
                    orderId: currentOrderId,
                    transactionId: transactionId,
                    amount: amount
                });
                toast.success('Order placed successfully!');
            } else {
                toast.error('Failed to complete order. Please contact support.');
            }
        } catch (error) {
            console.error('Error completing order:', error);
            toast.error('An error occurred while completing your order');
        }
    };

    const closeOrderSuccess = () => {
        setOrderSuccess(null);
        setCurrentOrderId(null);
        setAppliedCoupon(null);
        setCouponCode('');
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

                            {/* User Details */}
                            <div className="p-6 border-b">
                                <h2 className="text-sm font-semibold text-gray-900 mb-4">USER DETAILS</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Name</label>
                                        <input className="w-full h-10 px-3 border border-gray-300 bg-gray-100 text-sm" value={userName} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Email</label>
                                        <input className="w-full h-10 px-3 border border-gray-300 bg-gray-100 text-sm" value={userEmail} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Phone</label>
                                        <input className="w-full h-10 px-3 border border-gray-300 bg-gray-100 text-sm" value={userPhone} readOnly />
                                    </div>
                                </div>
                            </div>

                            {/* Address Selection */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-gray-900">DELIVERY ADDRESS</h2>
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
                    <div className="w-full lg:w-104">
                        <div className="bg-white shadow-sm">
                            <div className="flex items-center gap-3 p-6 border-b">
                                <Package className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">ORDER SUMMARY</h2>
                            </div>
                            <div className="p-6">
                                {/* Items (Responsive) */}
                                <div className="mb-6 md:max-h-64 max-h-none overflow-y-auto pr-1">
                                    {cartItems.length === 0 ? (
                                        <p className="text-sm text-gray-600">Your cart is empty.</p>
                                    ) : (
                                        <div className="border border-gray-200">
                                            {/* Header (desktop) */}
                                            <div className="hidden md:grid grid-cols-12 bg-gray-50 text-xs font-semibold text-gray-900">
                                                <div className="px-3 py-2 col-span-5">Name</div>
                                                <div className="px-3 py-2 text-right col-span-2">Qty</div>
                                                <div className="px-3 py-2 text-right col-span-2">Price</div>
                                                <div className="px-3 py-2 text-right col-span-3">Subtotal</div>
                                            </div>
                                            {cartItems.map((item) => {
                                                const price = Number(item.price) || 0;
                                                const qty = Number(item.quantity) || 1;
                                                const subtotal = price * qty;
                                                return (
                                                    <>
                                                        {/* Row (desktop) */}
                                                        <div key={`d-${item.id}`} className="hidden md:grid grid-cols-12 text-sm border-t border-gray-200">
                                                            <div className="px-3 py-2 col-span-5 break-words whitespace-normal" title={item.name}>
                                                                <div className="flex flex-col gap-1">
                                                                    <span>{item.name}</span>
                                                                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300 w-fit">
                                                                        {item.productType === 'clothing' ? item.size?.size : item.ml_volume?.ml_volume}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="px-3 py-2 text-right col-span-2">{qty}</div>
                                                            <div className="px-3 py-2 text-right col-span-2">₹ {price.toLocaleString()}</div>
                                                            <div className="px-3 py-2 text-right col-span-3">₹ {subtotal.toLocaleString()}</div>
                                                        </div>
                                                        {/* Card (mobile) */}
                                                        <div key={`m-${item.id}`} className="md:hidden border-t border-gray-200 px-3 py-3 text-sm">
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
                                                    </>
                                                );
                                            })}
                                            {/* Total row */}
                                            <div className="hidden md:grid grid-cols-12 border-t border-gray-300 bg-gray-50 text-sm font-semibold">
                                                <div className="px-3 py-2 col-span-8 text-right">Total</div>
                                                <div className="px-3 py-2 text-right col-span-4">₹ {bagTotal.toLocaleString()}</div>
                                            </div>
                                            <div className="md:hidden border-t border-gray-300 bg-gray-50 text-sm font-semibold px-3 py-2 flex items-center justify-between">
                                                <div>Total</div>
                                                <div>₹ {bagTotal.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Coupon */}
                                <div className="mb-6">
                                    <label className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide">COUPON</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 h-10 px-3 border border-gray-300 bg-white text-sm"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={!!appliedCoupon}
                                        />
                                        {appliedCoupon ? (
                                            <button onClick={removeCoupon} className="px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm">Remove</button>
                                        ) : (
                                            <button onClick={applyCoupon} className="px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm">Apply</button>
                                        )}
                                    </div>
                                    {appliedCoupon && (
                                        <p className="text-xs text-green-600 mt-2">Applied: {appliedCoupon}</p>
                                    )}
                                </div>

                                {/* Summary Details (post-table) */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Discount</span>
                                        <span className="font-medium text-green-600">- ₹ {discount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Shipping</span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-lg">Payable Amount</p>
                                            <p className="text-xs text-gray-500">(Includes Tax)</p>
                                        </div>
                                        <p className="text-lg font-semibold">₹ {payableAmount.toLocaleString()}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handlePay} 
                                    disabled={isProcessingPayment || cartItems.length === 0}
                                    className="w-full bg-black text-white py-3 font-medium text-sm hover:bg-gray-800 transition-colors mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessingPayment ? 'Processing...' : 'PAY NOW'}
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

            {showPaymentGateway && (
                <MockPaymentGateway
                    amount={payableAmount}
                    onPaymentCompleted={handlePaymentCompleted}
                />
            )}

            {orderSuccess && (
                <OrderSuccess
                    orderId={orderSuccess.orderId}
                    transactionId={orderSuccess.transactionId}
                    amount={orderSuccess.amount}
                    onClose={closeOrderSuccess}
                />
            )}
        </div>
    );
}
