"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getDetailedPerfume, getSimilarPerfumes } from "@/utils/perfume";
import { DetailedPerfume, Perfume } from "@/types/perfume";
import { FiMinus, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  Star,
  CheckCircle2,
  Info,
  BookOpenText,
  Sparkles,
  Leaf,
  Building2,
} from "lucide-react";
import { useCart } from "@/contexts/cartContext";
import { getProductReviews } from "@/utils/products";
import { ProductReviewsResponse } from "@/types/product";
import OnePerfumecard from "@/components/Perfume/OnePerfumecard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
    productDescription: boolean;
    scentStory: boolean;
    usageTips: boolean;
    ingredients: boolean;
    brandInfo: boolean;
  }>({
    productDescription: false,
    scentStory: false,
    usageTips: false,
    ingredients: false,
    brandInfo: false,
  });
  const { addToCart } = useCart();
  const ctaButtonsRef = useRef<HTMLDivElement>(null);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [reviewSortBy, setReviewSortBy] = useState("most_recent");
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [reviewsData, setReviewsData] = useState<ProductReviewsResponse | null>(
    null,
  );
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [similarPerfumes, setSimilarPerfumes] = useState<Perfume[]>([]);

  const toggleAccordion = (
    section:
      | "productDescription"
      | "scentStory"
      | "usageTips"
      | "ingredients"
      | "brandInfo",
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
        const similar = await getSimilarPerfumes(perfumeData.id);
        setSimilarPerfumes(similar);
      }
      setIsLoading(false);
    };
    fetchPerfume();
  }, [slug]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!slug) return;
      setReviewsLoading(true);
      const reviewsResponse = await getProductReviews(
        slug,
        currentReviewPage,
        5,
      );
      setReviewsData(reviewsResponse);
      setReviewsLoading(false);
    };
    fetchReviews();
  }, [slug, currentReviewPage]);

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
        hasScrollableContent && scrollLeft < scrollWidth - clientWidth - 1,
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
              currentScroll + scrollAmount,
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
  const formattedReviewCount =
    perfume.rating_count >= 1000
      ? `${(perfume.rating_count / 1000).toFixed(1)}K`
      : perfume.rating_count.toString();
  const ingredientsText = [perfume.top_notes, perfume.middle_notes, perfume.base_notes]
    .filter((value) => value && value.trim())
    .join("\n");

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
        selectedSizeId,
      );
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0 md:mt-30 mt-25">
      <div className="w-full h-10 bg-yellow-300/60 overflow-hidden relative block">
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
      <div className="bg-white py-4 md:py-16 overflow-hidden">
        <div className="max-w-350 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-20 gap-6 md:gap-12">
            {/* Left Side - Sticky Gallery */}
            <div className="order-1 lg:col-span-9">
              <div className="lg:sticky lg:top-0">
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

            {/* Right Side - Scrollable Content */}
            <div className="order-2 lg:col-span-11 space-y-8">
              <div className=" space-y-5">
                <div className="md:hidden text-gray-900 space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight leading-tight">
                    {perfume.name}
                  </h1>
                  <p className="text-sm uppercase tracking-wide text-gray-600">
                    {perfume.concentration}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={
                            i < Math.round(Number(perfume.rating))
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({formattedReviewCount})</span>
                  </div>
                </div>

                <div className="hidden md:flex flex-wrap items-center gap-2 text-gray-900">
                  <h1 className="text-xl md:text-3xl font-semibold tracking-tight">
                    {perfume.name}
                  </h1>
                  <span className="text-gray-400">|</span>
                  <span className="text-base md:text-lg text-gray-600">
                    {perfume.concentration}
                  </span>
                  <div className="flex items-center gap-1 ml-0 md:ml-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.round(Number(perfume.rating))
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">({formattedReviewCount})</span>
                </div>

                <div className="flex items-center gap-3 text-sm md:text-base">
                  <span className="text-gray-700">{perfume.fragrance}</span>
                  <span className="text-gray-300">|</span>
                  <span className="inline-flex items-center rounded-md bg-rose-50 px-3 py-1 text-gray-700">
                    {perfume.gender}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  {perfume.badgeText && (
                    <p className="text-sm text-gray-700 mb-2">{perfume.badgeText}</p>
                  )}
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-semibold text-orange-600">
                      Rs. {totalPrice.toFixed(2)}
                    </span>
                    {totalOriginalPrice > totalPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        {totalOriginalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-1">Inclusive of all taxes</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {perfume.price.map((priceOption, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSize(index);
                        setSelectedSizeId(perfume.price[index].id);
                      }}
                      className={`min-w-20 px-4 py-2 border rounded-md text-base transition-colors ${
                        selectedSize === index
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                    >
                      {priceOption.quantity} Ml
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3" ref={ctaButtonsRef}>
                  <div className="flex items-center h-11 border-2 border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={handleQuantityDecrease}
                      className="w-11 h-full flex items-center justify-center text-lg text-gray-700"
                      disabled={quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                    <button
                      onClick={handleQuantityIncrease}
                      className="w-11 h-full flex items-center justify-center text-lg text-gray-700"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="h-11 px-8 md:px-12 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-lg md:text-xl font-medium transition-colors"
                  >
                    Add To Cart
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-2">
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion("productDescription")}
                      className="w-full flex items-center justify-between py-4 text-left text-lg md:text-[22px] text-gray-900"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Info size={18} className="text-gray-700" />
                        Product Description
                      </span>
                      <span>{accordionOpen.productDescription ? "−" : "+"}</span>
                    </button>
                    {accordionOpen.productDescription && (
                      <p className="pb-4 text-gray-700 whitespace-pre-line">
                        {perfume.productDescription}
                      </p>
                    )}
                  </div>
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion("scentStory")}
                      className="w-full flex items-center justify-between py-4 text-left text-lg md:text-[22px] text-gray-900"
                    >
                      <span className="inline-flex items-center gap-2">
                        <BookOpenText size={18} className="text-gray-700" />
                        Scent Story
                      </span>
                      <span>{accordionOpen.scentStory ? "−" : "+"}</span>
                    </button>
                    {accordionOpen.scentStory && (
                      <p className="pb-4 text-gray-700 whitespace-pre-line">
                        {perfume.scentStory}
                      </p>
                    )}
                  </div>
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion("usageTips")}
                      className="w-full flex items-center justify-between py-4 text-left text-lg md:text-[22px] text-gray-900"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Sparkles size={18} className="text-gray-700" />
                        Usage Tips
                      </span>
                      <span>{accordionOpen.usageTips ? "−" : "+"}</span>
                    </button>
                    {accordionOpen.usageTips && (
                      <p className="pb-4 text-gray-700 whitespace-pre-line">
                        {perfume.usageTips}
                      </p>
                    )}
                  </div>
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion("ingredients")}
                      className="w-full flex items-center justify-between py-4 text-left text-lg md:text-[22px] text-gray-900"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Leaf size={18} className="text-gray-700" />
                        Ingredients
                      </span>
                      <span>{accordionOpen.ingredients ? "−" : "+"}</span>
                    </button>
                    {accordionOpen.ingredients && (
                      <p className="pb-4 text-gray-700 whitespace-pre-line">
                        {ingredientsText}
                      </p>
                    )}
                  </div>
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion("brandInfo")}
                      className="w-full flex items-center justify-between py-4 text-left text-lg md:text-[22px] text-gray-900"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Building2 size={18} className="text-gray-700" />
                        Brand & Manufacturer Info
                      </span>
                      <span>{accordionOpen.brandInfo ? "−" : "+"}</span>
                    </button>
                    {accordionOpen.brandInfo && (
                      <p className="pb-4 text-gray-700 whitespace-pre-line">
                        {perfume.brandAndManufacturerInfo}
                      </p>
                    )}
                  </div>
                </div>
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

              {/* Header Section - 2 Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 items-center">
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
                      {reviewsData &&
                      reviewsData.ratingBreakdown.totalReviews >= 1000
                        ? `${(reviewsData.ratingBreakdown.totalReviews / 1000).toFixed(1)}K`
                        : reviewsData?.ratingBreakdown.totalReviews ||
                          perfume.rating_count}{" "}
                      reviews
                    </span>
                    <CheckCircle2 size={14} className="text-green-600" />
                  </div>
                </div>

                {/* Right: Star Rating Breakdown */}
                <div className="space-y-2 border-l-0 md:border-l-2 border-gray-200 pl-6">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const ratingBreakdown = reviewsData?.ratingBreakdown;
                    let count = 0;
                    if (ratingBreakdown) {
                      if (star === 5) count = ratingBreakdown.fiveStar;
                      else if (star === 4) count = ratingBreakdown.fourStar;
                      else if (star === 3) count = ratingBreakdown.threeStar;
                      else if (star === 2) count = ratingBreakdown.twoStar;
                      else if (star === 1) count = ratingBreakdown.oneStar;
                    } else {
                      count = Math.floor(
                        (perfume.rating_count * (6 - star)) / 15,
                      );
                    }
                    const totalReviews =
                      ratingBreakdown?.totalReviews || perfume.rating_count;
                    const percentage =
                      totalReviews > 0 ? (count / totalReviews) * 100 : 0;
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
              </div>

              {/* Customer Photos & Videos Section */}
              {reviewsData &&
                reviewsData.data.some(
                  (review) =>
                    review.review_images && review.review_images.length > 0,
                ) && (
                  <div className="mb-10 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Customer photos & videos
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-2 flex-1 overflow-x-auto pb-2 scrollbar-hide">
                        {reviewsData.data
                          .flatMap((review) => review.review_images || [])
                          .filter((img) => img)
                          .map((img, i) => (
                            <div
                              key={i}
                              className="w-20 h-20 bg-gray-100 rounded shrink-0 overflow-hidden"
                            >
                              <img
                                src={img}
                                alt={`Customer photo ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                      </div>
                      {reviewsData.data
                        .flatMap((review) => review.review_images || [])
                        .filter((img) => img).length > 8 && (
                        <a
                          href="#"
                          className="text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap"
                        >
                          See more
                        </a>
                      )}
                    </div>
                  </div>
                )}

              {/* Sort Dropdown */}
              {/* <div className="flex items-center justify-between mb-6">
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
              </div> */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900">Reviews</h3>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6 mb-8">
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                  </div>
                ) : reviewsData &&
                  reviewsData.success &&
                  reviewsData.data.length > 0 ? (
                  reviewsData.data.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">
                              {review.reviewer_name}
                            </span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {new Date(review.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                          {review.review_images &&
                            review.review_images.length > 0 && (
                              <div className="flex gap-2 mb-2">
                                {review.review_images.map((img, idx) => (
                                  <div
                                    key={idx}
                                    className="w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0"
                                  >
                                    <img
                                      src={img}
                                      alt={`Review image ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          <p className="text-gray-800 font-normal leading-relaxed my-2">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentReviewPage(1)}
                  disabled={currentReviewPage === 1 || reviewsLoading}
                  className="px-2 py-1 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  &lt;&lt;
                </button>
                <button
                  onClick={() =>
                    setCurrentReviewPage(Math.max(1, currentReviewPage - 1))
                  }
                  disabled={currentReviewPage === 1 || reviewsLoading}
                  className="px-2 py-1 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  &lt;
                </button>
                {reviewsData &&
                  Array.from(
                    { length: Math.min(5, reviewsData.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentReviewPage(page)}
                          disabled={reviewsLoading}
                          className={`px-3 py-1 text-sm ${
                            currentReviewPage === page
                              ? "bg-gray-900 text-white"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}
                <button
                  onClick={() =>
                    setCurrentReviewPage(
                      Math.min(
                        reviewsData?.totalPages || 1,
                        currentReviewPage + 1,
                      ),
                    )
                  }
                  disabled={
                    currentReviewPage === (reviewsData?.totalPages || 1) ||
                    reviewsLoading
                  }
                  className="px-2 py-1 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  &gt;
                </button>
                <button
                  onClick={() =>
                    setCurrentReviewPage(reviewsData?.totalPages || 1)
                  }
                  disabled={
                    currentReviewPage === (reviewsData?.totalPages || 1) ||
                    reviewsLoading
                  }
                  className="px-2 py-1 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  &gt;&gt;
                </button>
              </div>
            </div>
          </div>

          {/* Similar Perfumes Section */}
          {similarPerfumes.length > 0 && (
            <div className="mt-12 md:mt-20 pt-12 border-t border-gray-100">
              <div className="mb-6 md:mb-8">
                <h3 className="text-section text-gray-900 mb-2 relative inline-block">
                  SIMILAR FRAGRANCES
                  {/* <div className="absolute -bottom-2 left-0 w-12 md:w-16 h-0.5 md:h-1 bg-linear-to-r from-gray-900 to-gray-600"></div> */}
                </h3>
                <p className="text-body text-gray-600 mt-4">
                  Discover more fragrances you might love
                </p>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {similarPerfumes.map((similarPerfume) => (
                  <OnePerfumecard key={similarPerfume.id} perfume={similarPerfume} />
                ))}
              </div>

              {/* Mobile Carousel */}
              <div className="block md:hidden">
                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={16}
                  slidesPerView={1.5}
                  pagination={{ clickable: true }}
                  className="similar-perfumes-swiper pb-8"
                >
                  {similarPerfumes.map((similarPerfume) => (
                    <SwiperSlide key={similarPerfume.id}>
                      <OnePerfumecard perfume={similarPerfume} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}

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
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 transition-colors rounded-lg text-base"
            >
              Add To Cart
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
                      className={`px-4 h-[40px] text-sm font-medium transition-colors border rounded-md ${
                        selectedSize === index
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                    >
                      {priceOption.quantity} Ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-light uppercase tracking-widest text-gray-500">
                  Qty
                </span>
                <div className="flex items-center h-11 border-2 border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={handleQuantityDecrease}
                    className="w-11 h-full flex items-center justify-center text-lg text-gray-700"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                  <button
                    onClick={handleQuantityIncrease}
                    className="w-11 h-full flex items-center justify-center text-lg text-gray-700"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="h-11 px-10 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-lg font-medium transition-colors"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
