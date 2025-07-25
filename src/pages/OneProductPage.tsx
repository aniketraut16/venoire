'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation';
import { getDetailProduct } from '@/utils/products';
import { Heart, ShoppingCart, Truck, RotateCcw, Shield, Tag, Star, ChevronDown, MapPin, User, Package, Calendar } from 'lucide-react';
import { Lens } from '@/components/ui/lens';
import OnproductImageView from '@/components/Product/OnproductImageView';

export default function OneProductPage() {
    const params = useParams();
    const slug = params?.slug as string;
    console.log(slug);
    const product = getDetailProduct(slug);

    // State management
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
    const [showImageModal, setShowImageModal] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    // Early return if product not found
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl lato-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 lato-regular">The product you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };

    const calculateDiscountedPrice = () => {
        return Math.round(product.price * (1 - product.discount / 100));
    };

    const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];

    return (
        <>
            {showImageModal && <OnproductImageView images={product.images} onClose={() => setShowImageModal(false)} initialIndex={currentImageIndex} />}
            <div className="min-h-screen bg-white pt-45">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Product Images - 3/5 */}
                        <div className="lg:col-span-3">
                            {/* Main Images Grid */}
                            <div className="grid grid-cols-2 gap-4 p-4">
                                {product.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="aspect-square bg-gray-50 overflow-hidden relative group cursor-zoom-in"
                                        onClick={() => {
                                            setShowImageModal(true);
                                            setCurrentImageIndex(index);
                                        }}
                                    >
                                        <Lens>
                                            <img
                                                src={image}
                                                alt={`${product.name} view ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </Lens>
                                        {/* <img
                                        src={image}
                                        alt={`${product.name} view ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    /> */}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Information - 2/5 */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Header - More Compact */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs lato-bold uppercase tracking-wide">
                                        {product.catalog}
                                    </span>
                                    <span className="text-gray-500 text-sm lato-regular">{product.category}</span>
                                </div>
                                <h1 className="text-2xl pt-serif-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>

                                {/* Rating - Compact */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-gray-900 text-gray-900" />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-600 lato-regular">(4.8) • 127 reviews</span>
                                </div>

                                {/* Pricing - Compact */}
                                <div className="flex items-baseline gap-3 mb-3">
                                    <span className="text-2xl lato-black text-gray-900">
                                        ${calculateDiscountedPrice()}
                                    </span>
                                    {product.discount > 0 && (
                                        <span className="text-lg text-gray-400 line-through lato-regular">
                                            ${product.originalPrice}
                                        </span>
                                    )}
                                    {product.discount > 0 && (
                                        <span className="text-green-600 lato-bold text-sm">
                                            Save ${product.originalPrice - calculateDiscountedPrice()}
                                        </span>
                                    )}
                                </div>

                                {/* Stock Status */}
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 ${product.itemsRemaining > 5 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                    <span className={`text-xs lato-regular ${product.itemsRemaining > 5 ? 'text-green-600' : 'text-orange-600'}`}>
                                        {product.itemsRemaining} items remaining
                                    </span>
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="space-y-3">
                                <h3 className="text-sm lato-bold text-gray-900 uppercase tracking-wide">Size</h3>
                                <div className="flex gap-2">
                                    {product.size.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeSelect(size)}
                                            className={`px-4 py-2 border transition-colors lato-regular text-sm ${selectedSize === size
                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons - Restructured */}
                            <div className="space-y-3">
                                {/* Buy Now - Full Width */}
                                <button
                                    disabled={!selectedSize}
                                    className="w-full bg-gray-900 text-white py-3 px-6 lato-bold uppercase tracking-wide hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Buy Now
                                </button>

                                {/* Add to Cart & Wishlist - Half Width Each */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        disabled={!selectedSize}
                                        className="bg-white border border-gray-900 text-gray-900 py-3 px-4 lato-bold uppercase tracking-wide hover:bg-gray-900 hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Add to Cart
                                    </button>

                                    <button
                                        onClick={toggleWishlist}
                                        className={`py-3 px-4 lato-bold uppercase tracking-wide transition-colors border flex items-center justify-center gap-2 text-sm ${isWishlisted
                                            ? 'border-red-500 bg-red-50 text-red-600'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                            }`}
                                    >
                                        <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                                        Wishlist
                                    </button>
                                </div>
                            </div>

                            {/* Delivery Options */}
                            <div className="space-y-6 pt-6 border-t border-gray-200">
                                <div>
                                    <h2 className="text-lg lato-bold text-gray-900 uppercase tracking-wide mb-4">Delivery Options</h2>

                                    {/* Location Selector */}
                                    <div className="mb-6">
                                        <p className="text-sm text-gray-600 lato-regular mb-3">Select to see availability to <span className="lato-bold">your location</span></p>
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                                                className="w-full flex items-center justify-between p-4 border border-gray-300 bg-white text-left lato-regular hover:border-gray-400 transition-colors"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                    {selectedLocation || 'Select your location'}
                                                </span>
                                                <ChevronDown className="h-4 w-4 text-gray-400" />
                                            </button>

                                            {showLocationDropdown && (
                                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 z-10">
                                                    {locations.map((location) => (
                                                        <button
                                                            key={location}
                                                            onClick={() => {
                                                                setSelectedLocation(location);
                                                                setShowLocationDropdown(false);
                                                            }}
                                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 lato-regular transition-colors"
                                                        >
                                                            {location}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Express Delivery */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <Truck className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <span className="text-green-600 lato-bold">Express Delivery available</span>
                                            <p className="text-sm text-gray-600 lato-regular">
                                                <button className="underline hover:no-underline">Login</button> or select location to see availability
                                            </p>
                                        </div>
                                    </div>

                                    {/* Delivery Features */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex items-start gap-3">
                                            <Package className="h-5 w-5 text-gray-400 mt-1" />
                                            <div>
                                                <h4 className="lato-bold text-gray-900">Free Delivery</h4>
                                                <p className="text-sm text-gray-600 lato-regular">Not the right size? You can easily exchange this item to get the right one</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                                            <div>
                                                <h4 className="lato-bold text-gray-900">15 Days Free Return & Exchange*</h4>
                                                <p className="text-sm text-gray-600 lato-regular">Easy returns and exchanges within 15 days</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Coupon Code */}
                            <div className="space-y-4 pt-6 border-t border-gray-200">
                                <h3 className="text-lg lato-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                    <Tag className="h-5 w-5" />
                                    Coupon Code
                                </h3>
                                <div className="flex">
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 lato-regular"
                                    />
                                    <button className="px-8 py-3 bg-gray-900 text-white lato-bold uppercase tracking-wide hover:bg-gray-800 transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Section - Enhanced */}
                    <div className="mt-28 relative">

                        <div className="space-y-20 relative">
                            {/* Product Description - Enhanced */}
                            <div className="relative">
                                <div className="bg-white p-12 border border-gray-100 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="mb-8">
                                            <h3 className="text-3xl pt-serif-bold text-gray-900 mb-3 relative">
                                                About This Product
                                                <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-gray-900 to-gray-600"></div>
                                            </h3>
                                        </div>

                                        <div className="prose prose-lg max-w-none mb-12">
                                            <p className="text-xl text-gray-700 leading-relaxed lato-light font-light tracking-wide">
                                                {product.description}
                                            </p>
                                        </div>

                                        {/* Enhanced Specifications */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                            <div className="space-y-6">

                                                <div className="bg-white border border-gray-100 p-6 transition-shadow duration-300">
                                                    <div className="space-y-4">
                                                        {[
                                                            { label: 'Material', value: product.material },
                                                            { label: 'Fit', value: product.fit },
                                                            { label: 'Pattern', value: product.pattern },
                                                            { label: 'Sleeves', value: product.sleeves }
                                                        ].map((item, index) => (
                                                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 group hover:bg-gray-50 transition-colors px-2 -mx-2">
                                                                <span className="lato-bold text-gray-900 text-sm uppercase tracking-wide">{item.label}:</span>
                                                                <span className="lato-regular text-gray-700 font-medium">{item.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="bg-white border border-gray-100 p-6 transition-shadow duration-300">
                                                    <div className="space-y-4">
                                                        {[
                                                            { label: 'Occasion', value: product.occasion },
                                                            { label: 'Color', value: product.color },
                                                            { label: 'Type', value: product.productType },
                                                            { label: 'Collection', value: product.collection }
                                                        ].map((item, index) => (
                                                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 group hover:bg-gray-50 transition-colors px-2 -mx-2">
                                                                <span className="lato-bold text-gray-900 text-sm uppercase tracking-wide">{item.label}:</span>
                                                                <span className="lato-regular text-gray-700 font-medium">{item.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
