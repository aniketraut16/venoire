'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation';
import { getDetailedPerfume } from '@/utils/perfume';
import { DetailedPerfume } from '@/types/perfume';
import { FiMinus, FiPlus, FiPackage, FiTruck, FiRefreshCw, FiPercent } from 'react-icons/fi';
import { useCart } from '@/contexts/cartContext';

export default function OnePerfumePage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [perfume, setPerfume] = useState<DetailedPerfume | null>(null);
    const [selectedSize, setSelectedSize] = useState<number>(0);
    const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(true);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [accordionOpen, setAccordionOpen] = useState<{
        fragranceNotes: boolean;
        usageTips: boolean;
        brandInfo: boolean;
    }>({
        fragranceNotes: true,
        usageTips: false,
        brandInfo: false,
    });
    const { addToCart } = useCart();
    const ctaButtonsRef = useRef<HTMLDivElement>(null);

    const toggleAccordion = (section: 'fragranceNotes' | 'usageTips' | 'brandInfo') => {
        setAccordionOpen(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        const fetchPerfume = async () => {
            setIsLoading(true);
            const perfumeData = await getDetailedPerfume(slug);
            if (perfumeData) {
                setPerfume(perfumeData);
                setSelectedSizeId(perfumeData.price[selectedSize].id);
            }
            setIsLoading(false);
        };
        fetchPerfume();
    }, [slug]);

    // Scroll handler for sticky bar
    useEffect(() => {
        const handleScroll = () => {
            if (ctaButtonsRef.current) {
                const ctaRect = ctaButtonsRef.current.getBoundingClientRect();
                
                // Check if footer exists and get its position
                const footer = document.querySelector('footer');
                let shouldShow = ctaRect.bottom < 0;
                
                if (footer) {
                    const footerRect = footer.getBoundingClientRect();
                    // Hide sticky bar if footer is visible in viewport
                    if (footerRect.top < window.innerHeight) {
                        shouldShow = false;
                    }
                }
                
                setShowStickyBar(shouldShow);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleQuantityDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleQuantityIncrease = () => {
        setQuantity(quantity + 1);
    };

    if (isLoading || !perfume) {
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

    const handleAddToCart = async () => {
        if (!selectedSizeId) return;
 await addToCart({ productVariantId: selectedSizeId, quantity: quantity });
    }

  return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Product Image as Background */}
            <div className="relative w-full min-h-[75vh] overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={perfume.bannerImage || perfume.coverImage}
                        alt={perfume.name}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/5"></div>
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
            
                <div className="max-w-7xl mx-auto px-4 pt-[25vh] pb-12 h-full relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Left Side - Product Info & Controls */}
                        <div className="max-w-2xl">
                            {/* Product Info & Controls */}
                            <div className="text-white space-y-4">
                                {/* Title & Description */}
                                <div className="space-y-1">
                                    <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                                        {perfume.name}
                                    </h1>
                                    <p className="text-base text-purple-100/90 italic">
                                        {perfume.fragrance}
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

                                {/* Badge Text for Applied Offer */}
                                {perfume.badgeText && (
                                    <div className="pt-2">
                                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400/30 to-emerald-400/30 backdrop-blur-sm text-green-100 px-3 py-1.5 text-sm font-semibold rounded-lg border border-green-300/40 shadow-lg shadow-green-500/20">
                                            <FiPercent className="w-4 h-4 text-green-200" />
                                            {perfume.badgeText}
                                        </span>
                                    </div>
                                )}

                                {/* Size & Quantity Row */}
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {/* Size Selection */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium uppercase tracking-wider opacity-90">
                                            Size (ml)
                                        </label>
                                        <div className="flex gap-2">
                                            {perfume.price.map((priceOption, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedSize(index);
                                                        setSelectedSizeId(perfume.price[index].id);
                                                    }}
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
                                        <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-lg border border-white/20 w-fit">
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
                                <div ref={ctaButtonsRef} className="pt-2">
                                    <button onClick={handleAddToCart} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg uppercase text-sm tracking-wide">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Fragrance Profile Card */}
                    </div>
                </div>
            </div>

            

            {/* Product Gallery and Description Section */}
            <div className="bg-gradient-to-b from-orange-50/30 to-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Side - Sticky Gallery */}
                        <div className="order-1">
                            <div className="lg:sticky lg:top-24">
                                {/* Main Image Display */}
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-3">
                                    <div className="aspect-square bg-gradient-to-br from-orange-50 to-orange-100/30 relative max-h-[500px]">
                                        <img
                                            src={perfume.images[selectedImageIndex] || perfume.coverImage}
                                            alt={perfume.name}
                                            className="w-full h-full object-cover transition-all duration-500"
                                        />
                                    </div>
                                </div>
                                
                                {/* Thumbnail Strip */}
                                <div className="grid grid-cols-4 gap-2">
                                    {perfume.images.slice(0, 4).map((image, index) => (
                                        <button 
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`group relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-2 cursor-pointer ${
                                                selectedImageIndex === index 
                                                    ? 'border-orange-500 ring-2 ring-orange-300' 
                                                    : 'border-orange-200 hover:border-orange-400'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${perfume.name} - Thumbnail ${index + 1}`}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                            />
                                            {selectedImageIndex === index && (
                                                <div className="absolute inset-0 bg-orange-500/10"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Scrollable Content */}
                        <div className="order-2 space-y-6">
                            {/* Product Description Card */}
                            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-gray-900">Product Description</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                                    {perfume.productDescription}
                                </p>
                            </div>

                            {/* Scent Story Card */}
                            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-gray-900">Scent Story</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed italic text-sm bg-orange-50/50 p-6 rounded-lg border-l-4 border-orange-400 whitespace-pre-line">
                                    {perfume.scentStory}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fragrance Notes & Info */}
                    <div className="mt-8">
                        <div className="bg-white">
                            {/* Fragrance Notes Accordion */}
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => toggleAccordion('fragranceNotes')}
                                    className="w-full flex items-center justify-between p-6 hover:bg-orange-50/30 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600"></div>
                                        <h2 className="text-xl font-bold text-gray-900">Fragrance Notes</h2>
                                    </div>
                                    <div className="text-orange-600 text-3xl font-light leading-none">
                                        {accordionOpen.fragranceNotes ? '−' : '+'}
                                    </div>
                                </button>
                                {accordionOpen.fragranceNotes && (
                                    <div className="px-6 pb-6 space-y-3 text-sm">
                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-transparent">
                                            <span className="inline-block w-1.5 h-1.5 bg-orange-500 mt-1.5 flex-shrink-0"></span>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 mb-1">Top Notes</p>
                                                <p className="text-gray-700">{perfume.top_notes}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-transparent">
                                            <span className="inline-block w-1.5 h-1.5 bg-orange-500 mt-1.5 flex-shrink-0"></span>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 mb-1">Middle Notes</p>
                                                <p className="text-gray-700">{perfume.middle_notes}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-transparent">
                                            <span className="inline-block w-1.5 h-1.5 bg-orange-500 mt-1.5 flex-shrink-0"></span>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 mb-1">Base Notes</p>
                                                <p className="text-gray-700">{perfume.base_notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Usage Tips Accordion */}
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => toggleAccordion('usageTips')}
                                    className="w-full flex items-center justify-between p-6 hover:bg-orange-50/30 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600"></div>
                                        <h2 className="text-xl font-bold text-gray-900">Usage Tips</h2>
                                    </div>
                                    <div className="text-orange-600 text-3xl font-light leading-none">
                                        {accordionOpen.usageTips ? '−' : '+'}
                                    </div>
                                </button>
                                {accordionOpen.usageTips && (
                                    <div className="px-6 pb-6">
                                        <p className="text-gray-700 leading-relaxed text-sm bg-gradient-to-br from-orange-50 to-orange-100/50 p-5">
                                            {perfume.usageTips}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Brand Information Accordion */}
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => toggleAccordion('brandInfo')}
                                    className="w-full flex items-center justify-between p-6 hover:bg-orange-50/30 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600"></div>
                                        <h2 className="text-xl font-bold text-gray-900">Brand Information</h2>
                                    </div>
                                    <div className="text-orange-600 text-3xl font-light leading-none">
                                        {accordionOpen.brandInfo ? '−' : '+'}
                                    </div>
                                </button>
                                {accordionOpen.brandInfo && (
                                    <div className="px-6 pb-6">
                                        <p className="text-gray-600 text-xs leading-relaxed">{perfume.brandAndManufacturerInfo}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Available Offers Section */}
                    {perfume.offers && perfume.offers.length > 0 && (
                        <div className="mt-6">
                            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <FiPercent className="w-5 h-5 text-green-600" />
                                        Available Offers
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {perfume.offers.map((offer, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg border border-green-200 hover:border-green-300 transition-colors"
                                        >
                                            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 text-sm mb-1">{offer.offer_name}</h4>
                                                <p className="text-sm text-gray-700 leading-relaxed">{offer.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
                                <p className="text-xs text-gray-600">Replacement delivery for any exchanged product will be delivered within 7-10 days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar - Desktop Only */}
            {perfume && (
                <div
                    className={`hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 transition-transform duration-300 ${
                        showStickyBar ? 'translate-y-0' : 'translate-y-full'
                    }`}
                >
                    <div className="max-w-7xl mx-auto px-6 py-3">
                        <div className="flex items-center justify-between gap-6">
                            {/* Product Info */}
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded overflow-hidden flex-shrink-0">
                                    <img
                                        src={perfume.coverImage}
                                        alt={perfume.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                                        {perfume.name}
                                    </h3>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-lg font-bold text-gray-900">
                                            Rs. {(selectedPrice.price * quantity).toFixed(2)}
                                        </span>
                                        <span className="text-sm text-gray-400 line-through">
                                            Rs. {(selectedPrice.originalPrice * quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Size Selector - Compact */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-600 uppercase">
                                    Size:
                                </span>
                                <div className="flex gap-2">
                                    {perfume.price.map((priceOption, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedSize(index);
                                                setSelectedSizeId(perfume.price[index].id);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                selectedSize === index
                                                    ? 'bg-orange-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {priceOption.quantity} ml
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-600 uppercase">
                                    Qty:
                                </span>
                                <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
                                    <button
                                        onClick={handleQuantityDecrease}
                                        className="p-2 hover:bg-gray-200 transition-colors rounded-l-lg"
                                    >
                                        <FiMinus className="w-3 h-3" />
                                    </button>
                                    <span className="px-4 text-sm font-semibold">{quantity}</span>
                                    <button
                                        onClick={handleQuantityIncrease}
                                        className="p-2 hover:bg-gray-200 transition-colors rounded-r-lg"
                                    >
                                        <FiPlus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button 
                                onClick={handleAddToCart}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-8 rounded-lg transition-all duration-300 uppercase text-sm tracking-wide shadow-md"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
