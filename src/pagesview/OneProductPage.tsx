"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { getDetailProduct, getSimilarProducts } from "@/utils/products";
import type { DetailProduct, ProductPricing, Product } from "@/types/product";
import {
  Heart,
  ShoppingCart,
  Truck,
  Tag,
  Star,
  Package,
  Calendar,
  Loader,
  ChevronDown,
  ChevronUp,
  Percent,
} from "lucide-react";
import { Lens } from "@/components/ui/lens";
import OnproductImageView from "@/components/Product/OnproductImageView";
import { useLoading } from "@/contexts/LoadingContext";
import { useCart } from "@/contexts/cartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ProductCard from "@/components/Product/ProductCard";
import { FaStar } from "react-icons/fa6";

export default function OneProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { openAddToCartModal } = useCart();

  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductPricing | null>(
    null
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { startLoading, stopLoading } = useLoading();
  const { addToCart, addToWishlist } = useCart();
  const ctaButtonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      startLoading();
      const res = await getDetailProduct(slug);
      if (res.success && res.data) {
        setProduct(res.data);
        if (res.data.pricing.length > 0)
          setSelectedVariant(res.data.pricing[0]);

        // Fetch similar products
        const similarRes = await getSimilarProducts(res.data.id);
        if (similarRes.success && similarRes.data) {
          setSimilarProducts(similarRes.data);
        }
      }
      stopLoading();
    };
    fetchProduct();
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

  const handleSizeSelect = (size: string) => {
    if (!product) return;
    const variant = product.pricing.find((v) => v.size === size);
    setSelectedVariant(variant || null);
  };

  const toggleWishlist = () => setIsWishlisted((prev) => !prev);

  const displayedPrice = useMemo(
    () => selectedVariant?.price ?? 0,
    [selectedVariant]
  );
  const displayedOriginalPrice = useMemo(
    () => selectedVariant?.originalPrice ?? 0,
    [selectedVariant]
  );
  const displayedDiscount = useMemo(
    () => selectedVariant?.discount ?? 0,
    [selectedVariant]
  );

  const getSelectedVariantId = (): string | null => {
    const idCandidate = selectedVariant?.id ?? null;
    return idCandidate && String(idCandidate).length > 0
      ? String(idCandidate)
      : null;
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      const maxQuantity = selectedVariant?.itemsRemaining || 10;
      setQuantity((prev) => Math.min(prev + 1, maxQuantity));
    } else {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleAddToCart = async () => {
    const variantId = getSelectedVariantId();
    if (!variantId) return;
    const ok = await addToCart({
      productVariantId: variantId,
      quantity: quantity,
    });
    if (ok) {
      openAddToCartModal(
        {
          productId: product?.id ?? "",
          productName: product?.name ?? "",
          productImage: product?.thumbnail ?? "",
          productType: "clothing",
          productVariants:
            product?.pricing.map((p) => ({
              id: p.id,
              price: p.price,
              originalPrice: p.originalPrice,
              badgeText: "",
              size: p.size as string,
            })) ?? [],
        },
        "added",
        variantId
      );
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader />
        </div>
      </div>
    );
  }

  const allImages = [product.thumbnail, ...product.images].filter(
    (img): img is string => !!img
  );

  return (
    <>
      {showImageModal && (
        <OnproductImageView
          images={allImages}
          onClose={() => setShowImageModal(false)}
          initialIndex={currentImageIndex}
        />
      )}
      <div className="min-h-screen bg-white pt-16 lg:pt-25  pb-6 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-12">
            {/* Images - Carousel on Mobile, Grid on Desktop */}
            <div className="lg:col-span-3">
              {/* Mobile Carousel */}
              <div className="block md:hidden">
                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={5}
                  slidesPerView={1.3}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  className="product-image-swiper"
                >
                  {allImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="aspect-3/5 bg-gray-50 overflow-hidden relative"
                        onClick={() => {
                          setShowImageModal(true);
                          setCurrentImageIndex(index);
                        }}
                      >
                        <img
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 gap-4 p-4">
                {allImages.map((image, index) => (
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
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <span className="text-gray-500 text-meta md:text-body lato-regular">
                    {product.category}
                  </span>
                </div>
                <h1 className="text-section md:text-display pt-serif-regular text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-1 mb-2">
                  <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-meta font-semibold text-gray-900">
                    {parseFloat(product.rating.toString()).toFixed(1)}
                  </span>
                  <span className="text-meta text-gray-400">|</span>
                  {/* <FaCheckCircle className="w-3 h-3 text-blue-500" /> */}
                  <svg
                    viewBox="0 0 18 18"
                    className="w-3 h-3 text-blue-500"
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
                  <span className="text-meta text-gray-600">
                    (
                    {product.rating_count >= 1000
                      ? `${(product.rating_count / 1000).toFixed(1)}K`
                      : product.rating_count}{" "}
                    Reviews)
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 md:gap-3 mb-2 md:mb-3">
                  <span className="text-title md:text-section lato-black text-gray-900">
                    Rs{" "}
                    {displayedPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </span>
                  {displayedDiscount > 0 && (
                    <>
                      <span className="text-body md:text-title text-red-700 line-through lato-regular">
                        Rs{" "}
                        {displayedOriginalPrice.toLocaleString("en-IN", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>

                      {product.badgeText ? (
                        <span className="text-green-600 lato-bold text-meta md:text-body">
                          {product.badgeText}
                        </span>
                      ) : (
                        <span className="text-green-600 lato-bold text-meta md:text-body">
                          Save {displayedDiscount}%
                        </span>
                      )}
                    </>
                  )}
                </div>
                <p className="text-meta md:text-body text-gray-600 lato-regular">Incl. all taxes</p>
              </div>

              {/* Sizes */}
              {product.pricing.length > 0 && (
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-body lato-bold text-gray-900 uppercase tracking-wide">
                    Size
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {[...product.pricing]
                      .sort((a, b) => {
                        const sizeA = parseInt(a.size ?? "0");
                        const sizeB = parseInt(b.size ?? "0");
                        return sizeA - sizeB;
                      })
                      .map((variant) => {
                        const isOutOfStock =
                          variant.availabilityStatus === "out_of_stock";
                        const isLowStock =
                          variant.availabilityStatus === "low_stock";
                        const isSelected =
                          selectedVariant?.size === variant.size;

                        return (
                          <button
                            key={variant.size}
                            onClick={() =>
                              !isOutOfStock &&
                              handleSizeSelect(variant.size ?? "")
                            }
                            disabled={isOutOfStock}
                            className={`relative px-3 md:px-4 py-2 border transition-colors lato-regular text-body ${
                              isOutOfStock
                                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                                : isSelected
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                            }`}
                          >
                            {variant.size}
                            {isLowStock && !isOutOfStock && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                  {selectedVariant && (
                    <div className="text-body">
                      {selectedVariant.availabilityStatus ===
                        "out_of_stock" && (
                        <p className="text-red-600 lato-bold">Out of Stock</p>
                      )}
                      {selectedVariant.availabilityStatus === "low_stock" && (
                        <p className="text-orange-600 lato-bold">
                          Only {selectedVariant.itemsRemaining} left in stock!
                        </p>
                      )}
                      {selectedVariant.availabilityStatus === "in_stock" && (
                        <p className="text-green-600 lato-bold">In Stock</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector - Desktop Only */}
              <div className="hidden md:block space-y-2">
                <h3 className="text-body lato-bold text-gray-900 uppercase tracking-wide">
                  Quantity
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => handleQuantityChange("decrement")}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors lato-bold text-title"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 border-l border-r border-gray-300 lato-bold text-gray-900 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("increment")}
                      disabled={
                        !selectedVariant ||
                        quantity >= (selectedVariant?.itemsRemaining || 10)
                      }
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors lato-bold text-title"
                    >
                      +
                    </button>
                  </div>
                  
                </div>
              </div>

              {/* Buttons - Desktop Only */}
              <div ref={ctaButtonsRef} className="hidden md:block space-y-3">
                {/* <button
                  disabled={
                    !selectedVariant ||
                    selectedVariant.availabilityStatus === "out_of_stock"
                  }
                  className="w-full bg-linear-to-r from-[#d4b500] to-[#af7834] text-white py-3 px-6 lato-bold uppercase tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300"
                >
                  {selectedVariant?.availabilityStatus === "out_of_stock"
                    ? "Out of Stock"
                    : "Buy Now"}
                </button> */}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={
                      !selectedVariant ||
                      selectedVariant.availabilityStatus === "out_of_stock"
                    }
                    onClick={handleAddToCart}
                    className="bg-white border border-gray-900 text-gray-900 py-3 px-4 lato-bold uppercase tracking-wide hover:bg-gray-900 hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-500 flex items-center justify-center gap-2 text-meta"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => addToWishlist(product.id)}
                    className={`w-full py-3 px-4 lato-bold uppercase tracking-wide transition-colors border flex items-center justify-center gap-2 text-meta ${
                      isWishlisted
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <Heart
                      className="h-4 w-4"
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                    Wishlist
                  </button>
                </div>
              </div>

              {product.offers && product.offers.length > 0 && (
                <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-gray-200">
                  <h3 className="text-body md:text-title lato-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    {/* <Percent className="h-4 md:h-5 w-4 md:w-5" /> */}
                    Available Offers
                  </h3>
                  <div className="space-y-2">
                    {product.offers.map((offer, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-linear-to-r from-green-50 to-transparent border border-green-200 hover:border-green-300 transition-colors"
                      >
                        <div className="shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                        <div className="flex-1">
                          <h4 className="lato-bold text-gray-900 text-meta md:text-body mb-0.5">
                            {offer.offer_name}
                          </h4>
                          <p className="text-meta md:text-body text-gray-700 lato-regular">
                            {offer.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery */}
              <div className="space-y-3 md:space-y-6 pt-4 md:pt-6 border-t border-gray-200">
                <h2 className="text-body md:text-title lato-bold text-gray-900 uppercase tracking-wide">
                  Delivery Options
                </h2>

                <div className="flex items-start md:items-center gap-3 mb-4 md:mb-6">
                  <Truck className="h-4 md:h-5 w-4 md:w-5 text-gray-400 mt-0.5 md:mt-0 shrink-0" />
                  <div>
                    <span className="text-green-600 lato-bold text-body md:text-body">
                      Express Delivery available
                    </span>
                    <p className="text-meta md:text-body text-gray-600 lato-regular">
                      <button className="underline hover:no-underline">
                        Login
                      </button>{" "}
                      or select location to see availability
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex items-start gap-3">
                    <Package className="h-4 md:h-5 w-4 md:w-5 text-gray-400 mt-1 shrink-0" />
                    <div>
                      <h4 className="lato-bold text-gray-900 text-body md:text-body">
                        Free Delivery
                      </h4>
                      <p className="text-meta md:text-body text-gray-600 lato-regular">
                        Easily exchange items if not the right size
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 md:h-5 w-4 md:w-5 text-gray-400 mt-1 shrink-0" />
                    <div>
                      <h4 className="lato-bold text-gray-900 text-body md:text-body">
                        2 Days Free Return & Exchange*
                      </h4>
                      <p className="text-meta md:text-body text-gray-600 lato-regular">
                        Replacement delivery for any exchanged product will be
                        delivered within 7-10 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-gray-200">
                <h3 className="text-body md:text-title lato-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Tag className="h-4 md:h-5 w-4 md:w-5" />
                  Coupon Code
                </h3>
                <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 focus:outline-none focus:border-gray-900 lato-regular text-meta md:text-body"
                  />
                  <button className="px-6 md:px-8 py-2 md:py-3 bg-gray-900 text-white lato-bold uppercase tracking-wide hover:bg-gray-800 transition-colors text-meta md:text-body">
                    Apply
                  </button>
                </div>
              </div>

              {/* Available Offers */}
            </div>
          </div>

          {/* Attributes */}
          <div className="mt-12 md:mt-28">
            <div className="bg-white p-4 md:p-12 border border-gray-100 relative overflow-hidden">
              <div className="mb-4 md:mb-8">
                <h3 className="text-section pt-serif-bold text-gray-900 mb-3 relative">
                  About This Product
                  <div className="absolute -bottom-2 left-0 w-12 md:w-16 h-0.5 md:h-1 bg-linear-to-r from-gray-900 to-gray-600"></div>
                </h3>
              </div>

              {/* Product Attributes - Prioritized on Mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12 mb-6 md:mb-8 md:order-2 order-1">
                {product.attributes.map((attr, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 md:py-3 border-b border-gray-100 last:border-b-0 group hover:bg-gray-50 transition-colors px-2 -mx-2"
                  >
                    <span className="lato-bold text-gray-900 text-meta md:text-body uppercase tracking-wide">
                      {attr.name}:
                    </span>
                    <span className="lato-regular text-gray-700 font-medium text-meta md:text-body">
                      {attr.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description with Read More on Mobile */}
              <div className="md:order-1 order-2">
                <p
                  className={`text-body md:text-title text-gray-700 leading-relaxed lato-light font-light tracking-wide transition-all duration-300 ${
                    isDescriptionExpanded
                      ? ""
                      : "line-clamp-3 md:line-clamp-none"
                  }`}
                >
                  {product.description}
                </p>
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="md:hidden mt-2 text-gray-900 lato-bold text-meta flex items-center gap-1 hover:underline"
                >
                  {isDescriptionExpanded ? (
                    <>
                      Read Less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <div className="mt-12 md:mt-20">
              <div className="mb-6 md:mb-8">
                <h3 className="text-section pt-serif-bold text-gray-900 mb-2 relative inline-block">
                  Similar Products
                  <div className="absolute -bottom-2 left-0 w-12 md:w-16 h-0.5 md:h-1 bg-linear-to-r from-gray-900 to-gray-600"></div>
                </h3>
                <p className="text-body md:text-body text-gray-600 lato-regular mt-4">
                  Discover more products you might love
                </p>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {similarProducts.map((similarProduct) => (
                  <ProductCard key={similarProduct.id} {...similarProduct} />
                ))}
              </div>

              {/* Mobile Carousel */}
              <div className="block md:hidden">
                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={16}
                  slidesPerView={1.5}
                  pagination={{ clickable: true }}
                  className="similar-products-swiper"
                >
                  {similarProducts.map((similarProduct) => (
                    <SwiperSlide key={similarProduct.id}>
                      <ProductCard {...similarProduct} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Buttons - Mobile Only */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          {/* <div className="flex items-center gap-3 mb-3">
            <span className="text-meta lato-bold text-gray-900 uppercase">
              Qty:
            </span>
            <div className="flex items-center border border-gray-300">
              <button
                onClick={() => handleQuantityChange("decrement")}
                disabled={quantity <= 1}
                className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors lato-bold"
              >
                -
              </button>
              <span className="px-4 py-1.5 border-l border-r border-gray-300 lato-bold text-gray-900 min-w-[50px] text-center text-meta">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange("increment")}
                disabled={
                  !selectedVariant ||
                  quantity >= (selectedVariant?.itemsRemaining || 10)
                }
                className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors lato-bold"
              >
                +
              </button>
            </div>
          </div> */}
          <div className="flex gap-3">
            <button
              disabled={
                !selectedVariant ||
                selectedVariant.availabilityStatus === "out_of_stock"
              }
              onClick={handleAddToCart}
              className="flex-1 bg-gray-900 text-white py-3 px-4 lato-bold uppercase tracking-wide hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-meta"
            >
              <ShoppingCart className="h-4 w-4" />
              {selectedVariant?.availabilityStatus === "out_of_stock"
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            <button
              onClick={() => addToWishlist(product.id)}
              className={`p-3 lato-bold uppercase tracking-wide transition-colors border flex items-center justify-center text-meta ${
                isWishlisted
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <Heart
                className="h-5 w-5"
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>

        {/* Sticky Bottom Bar - Desktop Only */}
        <div
          className={`hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 transition-transform duration-300 ${
            showStickyBar ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between gap-6">
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                  <img
                    src={product.thumbnail || ""}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-meta font-bold text-gray-900 line-clamp-1 lato-bold">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-title font-bold text-gray-900 lato-black">
                      Rs {displayedPrice.toLocaleString("en-IN")}
                    </span>
                    {displayedDiscount > 0 && (
                      <span className="text-meta text-gray-400 line-through lato-regular">
                        Rs {displayedOriginalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Size Selector - Compact */}
              {product.pricing.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-meta font-medium text-gray-600 lato-bold uppercase">
                    Size:
                  </span>
                  <div className="flex gap-2">
                    {product.pricing.slice(0, 4).map((variant) => {
                      const isOutOfStock =
                        variant.availabilityStatus === "out_of_stock";
                      const isSelected = selectedVariant?.size === variant.size;
                      return (
                        <button
                          key={variant.size}
                          onClick={() =>
                            !isOutOfStock &&
                            handleSizeSelect(variant.size ?? "")
                          }
                          disabled={isOutOfStock}
                          className={`px-3 py-1.5 border transition-colors lato-regular text-meta ${
                            isOutOfStock
                              ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                              : isSelected
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                          }`}
                        >
                          {variant.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector - Compact */}
              <div className="flex items-center gap-2">
                <span className="text-meta font-medium text-gray-600 lato-bold uppercase">
                  Qty:
                </span>
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => handleQuantityChange("decrement")}
                    disabled={quantity <= 1}
                    className="px-2.5 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors lato-bold text-meta"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-l border-r border-gray-300 lato-bold text-gray-900 min-w-[45px] text-center text-meta">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increment")}
                    disabled={
                      !selectedVariant ||
                      quantity >= (selectedVariant?.itemsRemaining || 10)
                    }
                    className="px-2.5 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors lato-bold text-meta"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  disabled={
                    !selectedVariant ||
                    selectedVariant.availabilityStatus === "out_of_stock"
                  }
                  onClick={handleAddToCart}
                  className="bg-gray-900 text-white py-2.5 px-6 lato-bold uppercase tracking-wide hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 text-meta"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>

                <button
                  onClick={() => addToWishlist(product.id)}
                  className={`p-2.5 lato-bold uppercase tracking-wide transition-colors border flex items-center justify-center ${
                    isWishlisted
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <Heart
                    className="h-5 w-5"
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
