'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { getPerfumeBySlug } from '@/utils/perfume';
import { Perfume } from '@/types/perfume';
import { FiMinus, FiPlus, FiPackage, FiTruck, FiRefreshCw } from 'react-icons/fi';

export default function OnePerfumePage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [perfume, setPerfume] = useState<Perfume | null>(null);
    const [selectedSize, setSelectedSize] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        const perfumeData = getPerfumeBySlug(slug);
        if (perfumeData) {
            setPerfume(perfumeData);
        }
    }, [slug]);

    if (!perfume) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <div className="text-xl text-gray-600">Loading perfume...</div>
                </div>
            </div>
        );
    }

    const selectedPrice = perfume.price[selectedSize];
    const totalPrice = selectedPrice.price * quantity;
    const totalOriginalPrice = selectedPrice.originalPrice * quantity;
    const discount = Math.round(
        ((selectedPrice.originalPrice - selectedPrice.price) / selectedPrice.originalPrice) * 100
    );

    const handleQuantityDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleQuantityIncrease = () => {
        setQuantity(quantity + 1);
    };

  return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Product Image as Background */}
            <div className="relative w-full min-h-[75vh] overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={perfume.coverImage}
                        alt={perfume.name}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-900/50 via-orange-800/45 to-orange-600/50"></div>
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
            
                <div className="max-w-7xl mx-auto px-4 pt-[25vh] pb-12 h-full relative z-10">
                    <div className="max-w-2xl">
                        {/* Product Info & Controls */}
                        <div className="text-white space-y-4">
                            {/* Title & Description */}
                            <div className="space-y-1">
                                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                                    {perfume.name}
                                </h1>
                                <p className="text-base text-orange-100/90 italic">
                                    {perfume.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 pt-2">
                                <span className="text-3xl font-bold">Rs. {totalPrice.toFixed(2)}</span>
                                <span className="text-lg line-through text-orange-200/70">
                                    Rs. {totalOriginalPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-orange-200">Incl. all taxes</span>
                            </div>

                            {/* Size & Quantity Row */}
                            <div className="flex flex-col md:flex-row gap-4 pt-2">
                                {/* Size Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wider opacity-90">
                                        Size (ml)
                                    </label>
                                    <div className="flex gap-2">
                                        {perfume.price.map((priceOption, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedSize(index)}
                                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                    selectedSize === index
                                                        ? 'bg-white text-orange-600 shadow-lg'
                                                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                                                }`}
                                            >
                                                {priceOption.quantity} ml
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wider opacity-90">
                                        Quantity
                                    </label>
                                    <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                                        <button
                                            onClick={handleQuantityDecrease}
                                            className="p-2 hover:bg-white/10 transition-colors rounded-l-lg"
                                        >
                                            <FiMinus className="w-4 h-4" />
                                        </button>
                                        <span className="px-5 text-lg font-semibold">{quantity}</span>
                                        <button
                                            onClick={handleQuantityIncrease}
                                            className="p-2 hover:bg-white/10 transition-colors rounded-r-lg"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <div className="pt-2">
                                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg uppercase text-sm tracking-wide">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gradient-to-b from-white to-orange-50/30 py-6 border-b border-orange-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-orange-100/50 hover:shadow-md transition-shadow">
                            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2.5 rounded-lg">
                                <FiPackage className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm">Premium Quality</h4>
                                <p className="text-xs text-gray-600">Authentic fragrances</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-orange-100/50 hover:shadow-md transition-shadow">
                            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2.5 rounded-lg">
                                <FiTruck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm">Free Shipping</h4>
                                <p className="text-xs text-gray-600">On orders above Rs. 999</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-orange-100/50 hover:shadow-md transition-shadow">
                            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2.5 rounded-lg">
                                <FiRefreshCw className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm">Easy Returns</h4>
                                <p className="text-xs text-gray-600">7-day return policy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Section */}
            <div className="bg-gradient-to-b from-orange-50/30 to-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Product Description Card */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                                <h2 className="text-xl font-bold text-gray-900">Product Description</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-sm">{perfume.productDescription}</p>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-gray-900">Scent Story</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed italic text-sm bg-orange-50/50 p-4 rounded-lg border-l-4 border-orange-400">
                                    {perfume.scentStory}
                                </p>
                            </div>
                        </div>

                        {/* Fragrance Profile Card */}
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 text-white">
                            <h2 className="text-lg font-bold mb-4 opacity-90">Fragrance Profile</h2>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <p className="text-2xl font-bold">{perfume.fragrance}</p>
                            </div>
                            <div className="mt-6 space-y-2 text-sm opacity-90">
                                <p className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                    Gender: <strong>{perfume.gender}</strong>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                    Available: {perfume.price.map(p => `${p.quantity}ml`).join(', ')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fragrance Notes & Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* Fragrance Notes */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                                <h2 className="text-xl font-bold text-gray-900">Fragrance Notes</h2>
                            </div>
                            <div className="space-y-3 text-sm">
                                {perfume.ingredients.split(';').map((note, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-transparent rounded-lg">
                                        <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5"></span>
                                        <p className="text-gray-700 flex-1">{note.trim()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Usage Tips */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                                <h2 className="text-xl font-bold text-gray-900">Usage Tips</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-sm bg-gradient-to-br from-orange-50 to-orange-100/50 p-5 rounded-xl border border-orange-200/50">
                                {perfume.usageTips}
                            </p>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand Information</h3>
                                <p className="text-gray-600 text-xs leading-relaxed">{perfume.brandAndManufacturerInfo}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Gallery</h2>
                        <p className="text-gray-600 text-sm">Explore our perfume from every angle</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {perfume.images.map((image, index) => (
                            <div 
                                key={index} 
                                className="group relative aspect-square bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-orange-100"
                            >
                                <img
                                    src={image}
                                    alt={`${perfume.name} - Image ${index + 1}`}
                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <p className="text-sm font-semibold">View {index + 1}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
