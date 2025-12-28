"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getDetailedPerfume } from "@/utils/perfume";
import { DetailedPerfume } from "@/types/perfume";
import {
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import { useCart } from "@/contexts/cartContext";

export default function OnePerfumePage() {
  const params = useParams();
  const { openAddToCartModal } = useCart();

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

  const toggleAccordion = (
    section: "fragranceNotes" | "usageTips" | "brandInfo"
  ) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
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
        const footer = document.querySelector("footer");
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    const ok = await addToCart({ productVariantId: selectedSizeId, quantity: quantity });
    if (ok) {
    openAddToCartModal({
      productId: perfume.id,
      productName: perfume.name,
      productImage: perfume.coverImage,
      productType: "perfume",
      productVariants: perfume.price.map((p) => ({
        id: p.id,
        price: p.price,
        originalPrice: p.originalPrice,
        badgeText: "",
        ml_volume: p.quantity.toString(),
      })),
    }, "added", selectedSizeId);}
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Product Image as Background */}
      <div className="relative w-full min-h-[65vh] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={perfume.bannerImage || perfume.coverImage}
            alt={perfume.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/20 via-black/10 to-black/5"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-[20vh] pb-10 h-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Product Info & Controls (40-45% width) */}
            <div className="max-w-xl lg:max-w-md">
              <div className="text-white space-y-4">
                {/* Title & Fragrance */}
                <div className="space-y-1">
                  <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight">
                    {perfume.name}
                  </h1>
                  <p className="text-sm text-white/60 tracking-wide uppercase font-light">
                    {perfume.fragrance}
                  </p>
                </div>

                {/* Price - Calm & Dominant */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-light tracking-tight">
                      Rs. {totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs text-white/40 line-through font-light">
                      Rs. {totalOriginalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-white/50 font-light">
                      Incl. all taxes
                    </span>
                  </div>
                </div>

                {/* Badge Text - Subtle */}
                {perfume.badgeText && (
                  <div className="pt-1">
                    <span className="inline-block text-xs text-white/70 font-light tracking-wide">
                      {perfume.badgeText}
                    </span>
                  </div>
                )}

                {/* Size & Quantity */}
                <div className="flex flex-wrap gap-4 pt-3">
                  {/* Size Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-light uppercase tracking-widest text-white/70">
                      Size
                    </label>
                    <div className="flex gap-2">
                      {perfume.price.map((priceOption, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedSize(index);
                            setSelectedSizeId(perfume.price[index].id);
                          }}
                          className={`px-4 py-2.5 text-sm font-light transition-all border ${
                            selectedSize === index
                              ? "bg-white text-gray-900 border-white"
                              : "bg-transparent text-white border-white/30 hover:border-white/60"
                          }`}
                        >
                          {priceOption.quantity}ml
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-light uppercase tracking-widest text-white/70">
                      Quantity
                    </label>
                    <div className="flex items-center border border-white/30 w-fit h-[42px]">
                      <button
                        onClick={handleQuantityDecrease}
                        className="px-3 h-full hover:bg-white/10 transition-colors flex items-center justify-center"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="px-5 text-sm font-light">
                        {quantity}
                      </span>
                      <button
                        onClick={handleQuantityIncrease}
                        className="px-3 h-full hover:bg-white/10 transition-colors flex items-center justify-center"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button - Luxury Dark */}
                <div ref={ctaButtonsRef} className="pt-4">
                  <button
                    onClick={handleAddToCart}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-light py-3 px-12 transition-all duration-300 uppercase text-xs tracking-widest border border-gray-900 hover:border-gray-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Image Only */}
          </div>
        </div>
      </div>

       {/* Special Offer - Inline Ribbon */}
       {/* {perfume.offers && perfume.offers.length > 0 && (
         <div className="bg-white">
           <div className="max-w-7xl mx-auto px-4 py-4">
             <div className="group inline-flex items-center gap-2 hover:opacity-80 transition-opacity duration-300">
               <p className="text-sm text-gray-800 tracking-wide">
                 <span className="font-medium">{perfume.offers[0].offer_name}</span>
                 {perfume.offers[0].text && (
                   <>
                     <span className="mx-2 text-gray-400">·</span>
                     <span className="text-gray-600 font-light">{perfume.offers[0].text}</span>
                   </>
                 )}
               </p>
             </div>
           </div>
         </div>
       )} */}

       {/* Product Gallery and Description Section */}
       <div className="bg-white py-16">
         <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Side - Sticky Gallery */}
            <div className="order-1 lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                {/* Main Image Display */}
                <div className="bg-gray-50 mb-3 overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={
                        perfume.images[selectedImageIndex] || perfume.coverImage
                      }
                      alt={perfume.name}
                      className="w-full h-full object-contain transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="grid grid-cols-4 gap-2">
                  {perfume.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`group relative aspect-square bg-gray-50 overflow-hidden transition-all duration-300 cursor-pointer border-2 ${
                        selectedImageIndex === index
                          ? "border-gray-900 opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${perfume.name} - Thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Scrollable Content */}
            <div className="order-2 lg:col-span-3 space-y-12">
              {/* Product Description & Scent Story - Merged Flow */}
              <div className="space-y-10">
                {/* Product Description */}
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-gray-500 font-normal mb-5">
                    About This Fragrance
                  </h2>
                  <p className="text-gray-800 leading-relaxed text-base font-normal whitespace-pre-line">
                    {perfume.productDescription}
                  </p>
                </div>

                {/* Scent Story */}
                <div className="border-l-2 border-gray-200 pl-6">
                  <h2 className="text-xs uppercase tracking-widest text-gray-500 font-normal mb-5">
                    The Story
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base font-normal italic whitespace-pre-line">
                    {perfume.scentStory}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fragrance Notes - Enhanced Composition */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Fragrance Composition
                </h2>
                <p className="text-sm text-gray-600">
                  The art of perfumery in three layers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Top Notes */}
                <div className="relative bg-linear-to-br from-amber-50 to-orange-50 p-8 border border-amber-200/50">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-400 to-orange-400"></div>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg
                        className="w-8 h-8 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-2">
                        Top Notes
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        First Impression
                      </p>
                    </div>
                    <p className="text-sm text-gray-800 font-normal leading-relaxed">
                      {perfume.top_notes}
                    </p>
                  </div>
                </div>

                {/* Heart Notes */}
                <div className="relative bg-linear-to-br from-rose-50 to-pink-50 p-8 border border-rose-200/50">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-rose-400 to-pink-400"></div>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg
                        className="w-8 h-8 text-rose-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-rose-900 font-semibold mb-2">
                        Heart Notes
                      </p>
                      <p className="text-xs text-gray-500 mb-3">The Soul</p>
                    </div>
                    <p className="text-sm text-gray-800 font-normal leading-relaxed">
                      {perfume.middle_notes}
                    </p>
                  </div>
                </div>

                {/* Base Notes */}
                <div className="relative bg-linear-to-br from-slate-50 to-stone-50 p-8 border border-slate-200/50">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-slate-600 to-stone-600"></div>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg
                        className="w-8 h-8 text-slate-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-900 font-semibold mb-2">
                        Base Notes
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Lasting Foundation
                      </p>
                    </div>
                    <p className="text-sm text-gray-800 font-normal leading-relaxed">
                      {perfume.base_notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Concentration Info */}
              {perfume.concentration && (
                <div className="mt-8 text-center">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Concentration
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {perfume.concentration}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-gray-500 font-normal mb-2">
                    Customer Reviews
                  </h2>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-light">
                      {Number(perfume.rating).toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600 font-normal tracking-tight">

<span>
                        

                      ({perfume.rating_count >= 1000 
                        ? `${(perfume.rating_count / 1000).toFixed(1)}K` 
                        : perfume.rating_count} reviews)
                    
                    
                        </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-gray-900 text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-800 font-normal leading-relaxed mb-2">
                    "Long-lasting and sophisticated. Perfect for evening wear."
                  </p>
                  <p className="text-xs text-gray-500 font-normal">
                    Verified Buyer
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-gray-900 text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-800 font-normal leading-relaxed mb-2">
                    "Elegant fragrance with great projection. Highly recommend."
                  </p>
                  <p className="text-xs text-gray-500 font-normal">
                    Verified Buyer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Tips & Brand Info - Minimal Accordion */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="max-w-4xl mx-auto">
              {/* Usage Tips */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleAccordion("usageTips")}
                  className="w-full flex items-center justify-between py-5 transition-colors text-left"
                >
                  <h2 className="text-xs uppercase tracking-widest text-gray-900 font-medium">
                    Usage Tips
                  </h2>
                  <div className="text-gray-400 text-2xl font-light leading-none">
                    {accordionOpen.usageTips ? "−" : "+"}
                  </div>
                </button>
                {accordionOpen.usageTips && (
                  <div className="pb-5">
                    <p className="text-gray-700 leading-relaxed text-sm font-normal">
                      {perfume.usageTips}
                    </p>
                  </div>
                )}
              </div>

              {/* Brand Information */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleAccordion("brandInfo")}
                  className="w-full flex items-center justify-between py-5 transition-colors text-left"
                >
                  <h2 className="text-xs uppercase tracking-widest text-gray-900 font-medium">
                    Brand Information
                  </h2>
                  <div className="text-gray-400 text-2xl font-light leading-none">
                    {accordionOpen.brandInfo ? "−" : "+"}
                  </div>
                </button>
                {accordionOpen.brandInfo && (
                  <div className="pb-5">
                    <p className="text-gray-700 text-sm leading-relaxed font-normal">
                      {perfume.brandAndManufacturerInfo}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

           {/* Additional Offers Section - Only if more than 1 offer */}
           {perfume.offers && perfume.offers.length > 1 && (
             <div className="mt-16 pt-12 border-t border-gray-100">
               <div className="max-w-4xl mx-auto">
                 <h2 className="text-xs uppercase tracking-widest text-gray-500 font-normal mb-6">
                   Additional Offers
                 </h2>
                 <div className="space-y-5">
                   {perfume.offers.slice(1).map((offer, index) => (
                     <div
                       key={index}
                       className="border-l-2 border-gray-200 pl-5"
                     >
                       <h4 className="text-sm text-gray-900 font-medium mb-2">
                         {offer.offer_name}
                       </h4>
                       <p className="text-sm text-gray-700 font-normal leading-relaxed">
                         {offer.text}
                       </p>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>

      {/* <div className="bg-linear-to-b from-white to-orange-50/30 py-6 border-b border-orange-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-orange-100/50 hover:shadow-md transition-shadow">
                            <div className="bg-linear-to-br from-orange-400 to-orange-600 p-2.5 rounded-lg">
                                <FiPackage className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm">Premium Quality</h4>
                                <p className="text-xs text-gray-600">Authentic fragrances</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-orange-100/50 hover:shadow-md transition-shadow">
                            <div className="bg-linear-to-br from-orange-400 to-orange-600 p-2.5 rounded-lg">
                                <FiTruck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm">Free Shipping</h4>
                                <p className="text-xs text-gray-600">On orders above Rs. 999</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-orange-100/50 hover:shadow-md transition-shadow">
                            <div className="bg-linear-to-br from-orange-400 to-orange-600 p-2.5 rounded-lg">
                                <FiRefreshCw className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm">Easy Returns</h4>
                                <p className="text-xs text-gray-600">Replacement delivery for any exchanged product will be delivered within 7-10 days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

      {/* Sticky Bottom Bar - Desktop Only */}
      {perfume && (
        <div
          className={`hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 transition-transform duration-300 ${
            showStickyBar ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-8">
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gray-50 overflow-hidden shrink-0">
                  <img
                    src={perfume.coverImage}
                    alt={perfume.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-light text-gray-900 line-clamp-1">
                    {perfume.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-light text-gray-900">
                      Rs. {(selectedPrice.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Size Selector - Compact */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-light uppercase tracking-widest text-gray-500">
                  Size
                </span>
                <div className="flex gap-2">
                  {perfume.price.map((priceOption, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSize(index);
                        setSelectedSizeId(perfume.price[index].id);
                      }}
                      className={`px-3 h-[42px] text-xs font-light transition-all border ${
                        selectedSize === index
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {priceOption.quantity}ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-light uppercase tracking-widest text-gray-500">
                  Qty
                </span>
                <div className="flex items-center border border-gray-300 h-[42px]">
                  <button
                    onClick={handleQuantityDecrease}
                    className="px-3 h-full hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <FiMinus className="w-3 h-3" />
                  </button>
                  <span className="px-4 text-sm font-light">{quantity}</span>
                  <button
                    onClick={handleQuantityIncrease}
                    className="px-3 h-full hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <FiPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="bg-gray-900 hover:bg-gray-800 text-white font-light h-[42px] px-10 transition-all duration-300 uppercase text-xs tracking-widest"
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
