"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getDetailedPerfume } from "@/utils/perfume";
import { DetailedPerfume } from "@/types/perfume";
import { FiMinus, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Star, CheckCircle2 } from "lucide-react";
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
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [reviewSortBy, setReviewSortBy] = useState("most_recent");
  const [currentReviewPage, setCurrentReviewPage] = useState(1);

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

  // Check scroll position for thumbnail strip
  const checkScrollPosition = () => {
    if (thumbnailScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        thumbnailScrollRef.current;
      const hasScrollableContent = scrollWidth > clientWidth;
      setCanScrollLeft(hasScrollableContent && scrollLeft > 1);
      setCanScrollRight(
        hasScrollableContent && scrollLeft < scrollWidth - clientWidth - 1
      );
    }
  };

  useEffect(() => {
    // Check scroll position after container and images are rendered
    const checkAfterRender = () => {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        setTimeout(() => {
          checkScrollPosition();
        }, 150);
      });
    };

    checkAfterRender();

    const scrollContainer = thumbnailScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollPosition);
      // Also check on resize
      window.addEventListener("resize", checkAfterRender);

      // Check when images load
      const images = scrollContainer.querySelectorAll("img");
      let loadedCount = 0;
      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          checkAfterRender();
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener("load", onImageLoad);
          img.addEventListener("error", onImageLoad);
        }
      });

      if (loadedCount === images.length) {
        checkAfterRender();
      }

      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkAfterRender);
        images.forEach((img) => {
          img.removeEventListener("load", onImageLoad);
          img.removeEventListener("error", onImageLoad);
        });
      };
    }
  }, [perfume]);

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailScrollRef.current) {
      const container = thumbnailScrollRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      const currentScroll = container.scrollLeft;
      const scrollTo =
        direction === "left"
          ? Math.max(0, currentScroll - scrollAmount)
          : Math.min(
              container.scrollWidth - container.clientWidth,
              currentScroll + scrollAmount
            );

      container.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });

      // Update scroll position after a short delay to ensure smooth scroll completes
      setTimeout(() => {
        checkScrollPosition();
      }, 300);
    }
  };

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
    const ok = await addToCart({
      productVariantId: selectedSizeId,
      quantity: quantity,
    });
    if (ok) {
      openAddToCartModal(
        {
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
        },
        "added",
        selectedSizeId
      );
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Hero Section with Product Image as Background */}

      <div className="space-y-1 grow flex md:hidden flex-col mt-30 px-4">
        {/* Category Label */}

        {/* Product Name with Quantity */}
        <h3 className="font-medium text-section text-gray-900 tracking-[0.6px]">
          {perfume.name} - {perfume.price[selectedSize].quantity}ml
        </h3>
        <p className="text-[12px] text-gray-700 uppercase tracking-wide">
          {perfume.concentration}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 text-[14px] font-medium mt-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            className="icon icon-star"
            viewBox="0 0 24 24"
            width="14"
            height="14"
          >
            <path
              d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"
              fill="#FFB503"
            ></path>
          </svg>
          <span className=" text-gray-900">
            {parseFloat(perfume.rating.toString()).toFixed(1)}
          </span>
          <span className=" text-gray-400">|</span>

          <svg
            viewBox="0 0 18 18"
            className="icon icon-whatsapp-verified"
            height="14"
            width="14"
            preserveAspectRatio="xMidYMid meet"
            version="1.1"
            x="0px"
            y="0px"
            enableBackground="new 0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              id="Star-2"
              fill="#005eff"
              points="9,16 7.1,16.9 5.8,15.2 3.7,15.1 3.4,13 1.5,12 2.2,9.9 1.1,8.2 2.6,6.7 2.4,4.6 4.5,4 5.3,2 7.4,2.4 9,1.1 10.7,2.4 12.7,2 13.6,4 15.6,4.6 15.5,6.7 17,8.2 15.9,9.9 16.5,12 14.7,13 14.3,15.1 12.2,15.2 10.9,16.9 "
            ></polygon>
            <polygon
              id="Check-Icon"
              fill="#FFFFFF"
              points="13.1,7.3 12.2,6.5 8.1,10.6 5.9,8.5 5,9.4 8,12.4 "
            ></polygon>
          </svg>
          <span className=" text-gray-600">
            (
            {perfume.rating_count >= 1000
              ? `${(perfume.rating_count / 1000).toFixed(1)}K`
              : perfume.rating_count}{" "}
            Reviews)
          </span>
        </div>
      </div>
      <div className="relative w-full min-h-[65vh] overflow-hidden hidden md:block">
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
                    className="bg-white  text-gray-900  hover:bg-gray-50 font-light py-3 px-12 transition-all duration-300 uppercase text-xs tracking-widest border border-gray-900 hover:border-gray-700"
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

      <div className="w-full h-10 bg-yellow-300/60 overflow-hidden relative hidden md:block">
        <div className="flex items-center h-full">
          <div className="flex whitespace-nowrap animate-marquee hover:paused">
            <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
              🎁 Free shipping on orders over $100
            </span>
            <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
              ✨ Buy 2 Get 15% Off - Limited Time
            </span>
            <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
              💝 Free gift wrapping with every purchase
            </span>
            <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
              🌟 New arrivals - Explore our latest collection
            </span>
            {/* Duplicate for seamless loop */}
            <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
              🎁 Free shipping on orders over $100
            </span>
            <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
              ✨ Buy 2 Get 15% Off - Limited Time
            </span>
            <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
              💝 Free gift wrapping with every purchase
            </span>
            <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
              🌟 New arrivals - Explore our latest collection
            </span>
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
      <div className="bg-white py-4 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-12">
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
                      className="w-full h-full object-contain transition-all duration-500 rounded-md"
                    />
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="relative w-full flex items-center gap-2">
                  {/* Left Arrow */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const container = thumbnailScrollRef.current;
                      if (container && container.scrollLeft > 0) {
                        scrollThumbnails("left");
                      }
                    }}
                    className={`shrink-0 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-sm transition-all z-20 pointer-events-auto ${
                      canScrollLeft
                        ? "hover:bg-gray-50 cursor-pointer opacity-100"
                        : "cursor-not-allowed opacity-50"
                    }`}
                    type="button"
                  >
                    <FiChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* Scrollable Thumbnail Container - Shows exactly 6 thumbnails */}
                  <div
                    ref={thumbnailScrollRef}
                    className="flex-1 overflow-x-auto pb-2 thumbnail-scrollbar"
                    style={{
                      width: "calc(6 * 4.5rem + 5 * 0.5rem)",
                      maxWidth: "100%",
                    }}
                  >
                    <div
                      className="flex gap-2"
                      style={{ width: "max-content" }}
                    >
                      {Array.from({ length: 1 }, (_, i) => {
                        const originalIndex =
                          i % perfume.images.slice(0, 4).length;
                        const image = perfume.images.slice(0, 4)[originalIndex];
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedImageIndex(i)}
                            className={`group shrink-0 w-18 h-18 relative bg-gray-50 overflow-hidden transition-all duration-300 cursor-pointer rounded-md border-2 ${
                              selectedImageIndex === i
                                ? "border-gray-900 opacity-100"
                                : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${perfume.name} - Thumbnail ${i + 1}`}
                              className="object-cover w-full h-full rounded-md"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const container = thumbnailScrollRef.current;
                      if (container) {
                        const { scrollLeft, scrollWidth, clientWidth } =
                          container;
                        if (scrollLeft < scrollWidth - clientWidth - 1) {
                          scrollThumbnails("right");
                        }
                      }
                    }}
                    className={`shrink-0 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-sm transition-all z-20 pointer-events-auto ${
                      canScrollRight
                        ? "hover:bg-gray-50 cursor-pointer opacity-100"
                        : "cursor-not-allowed opacity-50"
                    }`}
                    type="button"
                  >
                    <FiChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                <style jsx>{`
                  .thumbnail-scrollbar::-webkit-scrollbar {
                    height: 8px;
                  }
                  .thumbnail-scrollbar::-webkit-scrollbar-track {
                    background: #f3f4f6;
                    border-radius: 4px;
                  }
                  .thumbnail-scrollbar::-webkit-scrollbar-thumb {
                    background: #9ca3af;
                    border-radius: 4px;
                  }
                  .thumbnail-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #6b7280;
                  }
                  .thumbnail-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #9ca3af #f3f4f6;
                  }
                `}</style>
              </div>
            </div>

            {/* Mobile Pricing Section - After Gallery */}
            <div className="flex flex-col gap-2 md:hidden order-2">
              {/* Pricing and Quantity Row */}
              <div className="flex items-center justify-between gap-4 pt-2">
                {/* Left Side - Pricing */}
                <div className="flex-1">
                 
                
                  {/* Current Price */}
                  <div className="mb-1">
                    <span className="text-2xl font-medium tracking-tight text-gray-900">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* MRP and Taxes */}
                  <div className="flex flex-col gap-0.5">
                    {totalOriginalPrice > totalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        MRP: ₹{totalOriginalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      Inclusive of all taxes
                    </span>
                  </div>
                </div>

                {/* Right Side - Quantity Selector */}
                <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={handleQuantityDecrease}
                    className="px-4 py-2.5 h-full hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-700"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="px-5 py-2.5 text-sm font-medium text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={handleQuantityIncrease}
                    className="px-4 py-2.5 h-full hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-700"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Badge Text - Subtle */}
              {perfume.badgeText && (
                <div className="pt-1">
                  <span className="inline-block text-xs text-gray-600 font-light tracking-wide">
                    {perfume.badgeText}
                  </span>
                </div>
              )}
            </div>

            {/* Right Side - Scrollable Content */}
            <div className="order-2 lg:col-span-3 space-y-12">
              {/* Product Description & Scent Story - Merged Flow */}
              <div className="space-y-10">
                {/* Product Description */}
                <div>
                  <h2 className="text-section uppercase mb-5">
                    About This Fragrance
                  </h2>
                  <div className="mb-8">
                    <div className="max-w-5xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Top Notes */}
                        <div className="relative bg-linear-to-br from-amber-50 to-orange-50 p-5 border border-amber-200/50">
                          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-400 to-orange-400"></div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <svg
                                className="w-5 h-5 text-amber-600 shrink-0"
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
                              <div>
                                <p className="text-xs uppercase tracking-widest text-amber-900 font-semibold">
                                  Top Notes
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  First Impression
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-800 font-normal leading-relaxed space-y-1">
                              {perfume.top_notes
                                ?.split("•")
                                .filter((note) => note.trim())
                                .map((note, index) => (
                                  <p key={index}> • {note.trim()}</p>
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Heart Notes */}
                        <div className="relative bg-linear-to-br from-rose-50 to-pink-50 p-5 border border-rose-200/50">
                          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-rose-400 to-pink-400"></div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <svg
                                className="w-5 h-5 text-rose-600 shrink-0"
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
                              <div>
                                <p className="text-xs uppercase tracking-widest text-rose-900 font-semibold">
                                  Heart Notes
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  The Soul
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-800 font-normal leading-relaxed space-y-1">
                              {perfume.middle_notes
                                ?.split("•")
                                .filter((note) => note.trim())
                                .map((note, index) => (
                                  <p key={index}> • {note.trim()}</p>
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Base Notes */}
                        <div className="relative bg-linear-to-br from-slate-50 to-stone-50 p-5 border border-slate-200/50">
                          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-slate-600 to-stone-600"></div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <svg
                                className="w-5 h-5 text-slate-700 shrink-0"
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
                              <div>
                                <p className="text-xs uppercase tracking-widest text-slate-900 font-semibold">
                                  Base Notes
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Lasting Foundation
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-800 font-normal leading-relaxed space-y-1">
                              {perfume.base_notes
                                ?.split("•")
                                .filter((note) => note.trim())
                                .map((note, index) => (
                                  <p key={index}> • {note.trim()}</p>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Concentration Info */}
                      {/* {perfume.concentration && (
                <div className="mt-8 text-center">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Concentration
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {perfume.concentration}
                  </p>
                </div>
              )} */}
                    </div>
                  </div>
                  <p className="text-gray-800 leading-relaxed text-base font-normal whitespace-pre-line">
                    {perfume.productDescription}
                  </p>
                </div>

                {/* Scent Story */}
                <div className="border-l-2 border-yellow-600 pl-6">
                  <h2 className="text-sm uppercase tracking-widest text-yellow-600 font-normal mb-5">
                    The Story
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base font-normal italic whitespace-pre-line">
                    {perfume.scentStory}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-10 bg-yellow-300/60 overflow-hidden relative block md:hidden mt-6 "
          style={{
            transform:"scale(1.2)",
          }}
          >
            <div className="flex items-center h-full">
              <div className="flex whitespace-nowrap animate-marquee hover:paused">
                <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
                  🎁 Free shipping on orders over $100
                </span>
                <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
                  ✨ Buy 2 Get 15% Off - Limited Time
                </span>
                <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
                  💝 Free gift wrapping with every purchase
                </span>
                <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
                  🌟 New arrivals - Explore our latest collection
                </span>
                {/* Duplicate for seamless loop */}
                <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
                  🎁 Free shipping on orders over $100
                </span>
                <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
                  ✨ Buy 2 Get 15% Off - Limited Time
                </span>
                <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
                  💝 Free gift wrapping with every purchase
                </span>
                <span className="inline-flex items-center px-8 text-sm font-light text-gray-900">
                  🌟 New arrivals - Explore our latest collection
                </span>
              </div>
            </div>
          </div>
          {/* Usage Tips & Brand Info - Minimal Accordion */}
          <div className="mt-2 md:mt-16 pt-12 border-t border-gray-100">
            <div className="max-w-4xl mx-auto">
              {/* Usage Tips */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleAccordion("usageTips")}
                  className="w-full flex items-center justify-between py-5 transition-colors text-left"
                >
                  <h2 className="text-title uppercase tracking-widest text-gray-900 font-medium">
                    Usage Tips
                  </h2>
                  <div className="text-gray-400 text-section font-medium leading-none">
                    {accordionOpen.usageTips ? "−" : "+"}
                  </div>
                </button>
                {accordionOpen.usageTips && (
                  <div className="pb-5">
                    <p className="text-gray-700 leading-relaxed text-body font-normal">
                      {perfume.usageTips
                        ?.split("•")
                        .filter((note) => note.trim())
                        .map((note, index) => (
                          <p key={index}> • {note.trim()}</p>
                        ))}
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
                  <h2 className="text-title uppercase tracking-widest text-gray-900 font-medium">
                    Brand Information
                  </h2>
                  <div className="text-gray-400 text-section font-medium leading-none">
                    {accordionOpen.brandInfo ? "−" : "+"}
                  </div>
                </button>
                {accordionOpen.brandInfo && (
                  <div className="pb-5">
                    <p className="text-gray-700 text-body leading-relaxed font-normal">
                      {perfume.brandAndManufacturerInfo}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="max-w-4xl mx-auto">
              {/* Title - Centered */}
              <h2 className="text-center text-section uppercase tracking-widest text-black font-normal mb-10">
                Customer Reviews
              </h2>

              {/* Header Section - 3 Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-center">
                {/* Left: Overall Rating */}
                <div className="flex flex-col items-center">
                  {/* Stars above rating */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const rating = Number(perfume.rating);
                      const fullStars = Math.floor(rating);
                      const hasHalfStar = rating % 1 >= 0.5;

                      if (i < fullStars) {
                        return (
                          <Star
                            key={i}
                            size={20}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        );
                      } else if (i === fullStars && hasHalfStar) {
                        return (
                          <div key={i} className="relative w-5 h-5">
                            <Star
                              size={20}
                              className="absolute inset-0 text-gray-300"
                            />
                            <div
                              className="absolute inset-0"
                              style={{ clipPath: "inset(0 50% 0 0)" }}
                            >
                              <Star
                                size={20}
                                className="fill-yellow-400 text-yellow-400"
                              />
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <Star key={i} size={20} className="text-gray-300" />
                        );
                      }
                    })}
                  </div>

                  {/* Rating Number */}
                  <span className="text-6xl font-normal text-gray-900 mb-2">
                    {Number(perfume.rating).toFixed(2)}
                  </span>

                  {/* Review Count with Checkmark */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-title text-gray-600">
                      Based on{" "}
                      {perfume.rating_count >= 1000
                        ? `${(perfume.rating_count / 1000).toFixed(1)}K`
                        : perfume.rating_count}{" "}
                      reviews
                    </span>
                    <CheckCircle2 size={14} className="text-green-600" />
                  </div>
                </div>

                {/* Middle: Star Rating Breakdown */}
                <div className="space-y-2 border-l-0 border-r-0 md:border-l-2 md:border-r-2 border-gray-200 pl-6 pr-6">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = Math.floor(
                      (perfume.rating_count * (6 - star)) / 15
                    );
                    const percentage =
                      perfume.rating_count > 0
                        ? (count / perfume.rating_count) * 100
                        : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        {/* Visual Stars */}
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < star
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        {/* Review Count */}
                        <span className="text-meta text-gray-800 w-16 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Write Review Button */}
                <div className="flex items-start justify-center">
                  <button className="bg-black text-white px-6 py-2.5 text-sm font-normal hover:bg-gray-800 transition-colors">
                    Write a review
                  </button>
                </div>
              </div>

              {/* Customer Photos & Videos Section */}
              <div className="mb-10 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Customer photos & videos
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2 flex-1 overflow-x-auto pb-2 scrollbar-hide">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="w-20 h-20 bg-gray-100 rounded shrink-0 overflow-hidden"
                      >
                        <img
                          src={
                            perfume.images[i % perfume.images.length] ||
                            perfume.coverImage
                          }
                          alt={`Customer photo ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap"
                  >
                    See more
                  </a>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-md font-medium text-gray-900">Reviews</h3>
                <select
                  value={reviewSortBy}
                  onChange={(e) => setReviewSortBy(e.target.value)}
                  className="text-md text-gray-700 border border-gray-300 px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="most_recent">Most Recent</option>
                  <option value="highest_rating">Highest Rating</option>
                  <option value="lowest_rating">Lowest Rating</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6 mb-8">
                {/* Review 1 */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          Ritika Chopra
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">3 weeks ago</p>
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
                        <img
                          src={perfume.coverImage}
                          alt="Review image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-gray-800 font-normal leading-relaxed my-2">
                        CEO naam jaisa hi hai, pehno toh sab notice karte hain.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          Vikrant Joshi
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">3 weeks ago</p>
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
                        <img
                          src={perfume.images[0] || perfume.coverImage}
                          alt="Review image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-gray-800 font-normal leading-relaxed my-2">
                        Perfect balance of strength and smoothness in the
                        fragrance.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        Rajeev Khurana
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">3 weeks ago</p>

                    <p className="text-gray-800 font-normal leading-relaxed mb-2">
                      Has that rich, bossy vibe. Great for formal wear.
                    </p>
                  </div>
                </div>

                {/* Review 4 */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        NIMISH GOEL
                      </span>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">5 months ago</p>

                    <p className="text-gray-800 font-normal leading-relaxed mb-2">
                      Awsome fregnance
                    </p>
                  </div>
                </div>

                {/* Review 5 */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        Varun Pratap
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(4)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">
                            ★
                          </span>
                        ))}
                        <span className="text-gray-300 text-sm">★</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">5 months ago</p>

                    <p className="text-gray-800 font-normal leading-relaxed mb-2">
                      Lasts decently, but not all day. Still very classy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentReviewPage(Math.max(1, currentReviewPage - 1))
                  }
                  disabled={currentReviewPage === 1}
                  className="px-2 py-1 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  &lt;&lt;
                </button>
                <button
                  onClick={() =>
                    setCurrentReviewPage(Math.max(1, currentReviewPage - 1))
                  }
                  disabled={currentReviewPage === 1}
                  className="px-2 py-1 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  &lt;
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentReviewPage(page)}
                    className={`px-3 py-1 text-sm ${
                      currentReviewPage === page
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentReviewPage(Math.min(3, currentReviewPage + 1))
                  }
                  disabled={currentReviewPage === 3}
                  className="px-2 py-1 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  &gt;
                </button>
                <button
                  onClick={() =>
                    setCurrentReviewPage(Math.min(3, currentReviewPage + 1))
                  }
                  disabled={currentReviewPage === 3}
                  className="px-2 py-1 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  &gt;&gt;
                </button>
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

      {/* Sticky Bottom Bar - Mobile Only */}
      {perfume && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg">
          <div className="px-4 py-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3.5 px-6 transition-all duration-300 uppercase text-sm tracking-wider"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

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
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
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
