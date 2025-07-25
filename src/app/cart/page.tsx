"use client";
import React, { useState } from 'react';
import { ShoppingBag, Heart, Trash2, ChevronDown, Shield, Package, Truck, Info } from 'lucide-react';

type CartItem = {
    id: string;
    quantity: number;
    size: string;
    possibleSizes: string[];
    price: number;
    name: string;
    brand: string;
    image: string;
};

const cartDetails = [
    {
        id: "1",
        quantity: 1,
        size: "39",
        possibleSizes: ["36", "38", "39", "40", "42"],
        price: 2299,
        name: "Men White Slim Fit Stripe Full Sleeves Casual Shirt",
        brand: "PETER ENGLAND",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop",
    },
    {
        id: "2",
        quantity: 2,
        size: "40",
        possibleSizes: ["38", "40", "42", "44"],
        price: 1999,
        name: "Women Black Casual Top",
        brand: "VERO MODA",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop",
    },
    {
        id: "3",
        quantity: 1,
        size: "42",
        possibleSizes: ["40", "42", "44", "46"],
        price: 3499,
        name: "Unisex Blue Denim Jacket",
        brand: "LEVI'S",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop",
    },
];

const getCartDetails = () => {
    return cartDetails;
};

export default function ShoppingCartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(getCartDetails());
    const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
    const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});

    const updateSize = (itemId: string, newSize: string) => {
        setSelectedSizes(prev => ({ ...prev, [itemId]: newSize }));
    };

    const updateQuantity = (itemId: string, newQuantity: number) => {
        setSelectedQuantities(prev => ({ ...prev, [itemId]: newQuantity }));
    };

    const removeItem = (itemId: string) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
    };

    const moveToWishlist = (itemId: string) => {
        // Handle move to wishlist logic
        console.log('Move to wishlist:', itemId);
    };

    const bagTotal = cartItems.reduce((total, item) => total + item.price, 0);
    const shipping = 0; // Free shipping
    const payableAmount = bagTotal + shipping;

    return (
        <div className="min-h-screen bg-gray-50 pt-35">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side - Shopping Bag */}
                    <div className="flex-1">
                        <div className="bg-white  shadow-sm">
                            {/* Header */}
                            <div className="flex items-center gap-3 p-6 border-b">
                                <ShoppingBag className="w-5 h-5" />
                                <h1 className="text-lg font-semibold">MY SHOPPING BAG (1)</h1>
                            </div>

                            {/* Cart Items */}
                            <div className="p-6 flex flex-col gap-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="w-32 h-40 flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover "
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{item.brand}</h3>
                                                    <p className="text-sm text-gray-700 leading-tight">{item.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold">₹ {item.price.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            {/* Size and Quantity Selectors */}
                                            <div className="flex gap-4 mt-2 mb-2">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide">SIZE</label>
                                                    <div className="relative">
                                                        <select
                                                            className="w-20 h-10 px-3 pr-8 border border-gray-300  bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={selectedSizes[item.id] || item.size}
                                                            onChange={(e) => updateSize(item.id, e.target.value)}
                                                        >
                                                            {item.possibleSizes.map(size => (
                                                                <option key={size} value={size}>{size}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide">QUANTITY</label>
                                                    <div className="relative">
                                                        <select
                                                            className="w-16 h-10 px-3 pr-8 border border-gray-300  bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={selectedQuantities[item.id] || item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                        >
                                                            {[1, 2, 3, 4, 5].map(qty => (
                                                                <option key={qty} value={qty}>{qty}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-6 text-sm">
                                                <button
                                                    onClick={() => moveToWishlist(item.id)}
                                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                    MOVE TO WISHLIST
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
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
                    <div className="w-full lg:w-80">
                        <div className="bg-white  shadow-sm">
                            {/* Header */}
                            <div className="flex items-center gap-3 p-6 border-b">
                                <Package className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">ORDER SUMMARY</h2>
                            </div>

                            {/* Summary Details */}
                            <div className="p-6">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Bag Total (1)</span>
                                        <span className="font-medium">₹ {bagTotal.toLocaleString()}</span>
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

                                {/* Checkout Button */}
                                <button className="w-full bg-black text-white py-3  font-medium text-sm hover:bg-gray-800 transition-colors mb-4">
                                    CHECKOUT (1)
                                </button>



                                {/* Coupon Link */}
                                <div className="text-center">
                                    <button className="text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors">
                                        LOGIN TO APPLY COUPON
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-6 bg-white  shadow-sm p-6">
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
        </div>
    );
}