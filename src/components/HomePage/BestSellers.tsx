"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { useHomepage } from "@/contexts/HomepageContext";
import { Perfume } from "@/types/perfume";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/cartContext";

// Unified Card Component that handles both Perfume and Product
interface BestSellerCardProps {
  item: Perfume | Product;
}

function BestSellerCard({ item }: BestSellerCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { openAddToCartModal } = useCart();

  // Type guard to check if item is a Perfume
  const isPerfume = (item: Perfume | Product): item is Perfume => {
    return "coverImage" in item && "fragrance" in item;
  };

  // Get all images based on type
  const allImages = isPerfume(item)
    ? [item.coverImage, ...(item.images || [])]
    : [item.thumbnail];

  // Get pricing information
  const { lowestPrice, lowestOriginalPrice, lowestBadgeText, lowestQuantity } =
    isPerfume(item)
      ? {
          lowestPrice: Math.min(...item.price.map((p) => p.price)),
          lowestOriginalPrice: Math.min(
            ...item.price.map((p) => p.originalPrice)
          ),
          lowestBadgeText: item.price.find(
            (p) => p.price === Math.min(...item.price.map((p) => p.price))
          )?.badgeText,
          lowestQuantity: item.price.find(
            (p) => p.price === Math.min(...item.price.map((p) => p.price))
          )?.quantity,
        }
      : {
          lowestPrice: item.price,
          lowestOriginalPrice: item.originalPrice,
          lowestBadgeText: item.badgeText,
          lowestQuantity: null,
        };

  // Get rating information
  const rating = isPerfume(item) ? parseFloat(item.rating.toString()) : 4.5;
  const ratingCount = isPerfume(item) ? item.rating_count : 0;

  // Get gender badge (only for perfumes)
  const getGenderBadge = () => {
    if (!isPerfume(item)) return null;
    if (item.gender === "Unisex") return "UNISEX";
    if (item.gender === "Mens") return "MEN";
    if (item.gender === "Womens") return "WOMEN";
    return "";
  };

  const getGenderColor = () => {
    if (!isPerfume(item)) return "bg-gray-500";
    if (item.gender === "Unisex") return "bg-purple-500";
    if (item.gender === "Mens") return "bg-blue-500";
    if (item.gender === "Womens") return "bg-pink-500";
    return "bg-gray-500";
  };

  // Get category label
  const categoryLabel = isPerfume(item)
    ? "PERFUME"
    : item.category || "PRODUCT";

  // Get link URL
  const linkUrl = isPerfume(item)
    ? `/perfume/${item.slug}`
    : `/product/${item.slug}`;

  // Image cycling effect on hover
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHovered && allImages.length > 1) {
      setCurrentImageIndex(1);

      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
      }, 2000);
    } else {
      setCurrentImageIndex(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, allImages.length]);

  return (
    <Link
      href={linkUrl}
      className="group relative overflow-hidden transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden flex items-center justify-center rounded-sm">
        <img
          src={allImages[currentImageIndex]}
          alt={item.name}
          className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Top Badge - Gender (only for perfumes) */}
        {isPerfume(item) && (
          <div className="absolute top-1 left-2 z-10">
            <span
              className={`text-white text-[10px] font-semibold px-3 py-1 rounded uppercase tracking-wide ${getGenderColor()}`}
            >
              {getGenderBadge()}
            </span>
          </div>
        )}

        {/* Discount Badge - Bottom Left */}
        {lowestBadgeText && (
          <div className="absolute bottom-3 left-2 z-10">
            <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wide shadow-md">
              {lowestBadgeText}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2 flex-grow flex flex-col mt-3">
        {/* Category Label */}
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {categoryLabel}
        </p>

        {/* Product Name with Quantity */}
        <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight">
          {item.name}
          {lowestQuantity && ` - ${lowestQuantity}ml`}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <FaStar className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-sm font-semibold text-gray-900">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">|</span>
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
          <span className="text-xs text-gray-600">
            {ratingCount > 0
              ? `(${
                  ratingCount >= 1000
                    ? `${(ratingCount / 1000).toFixed(1)}K`
                    : ratingCount
                } Reviews)`
              : "(New)"}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xl font-bold text-gray-900">
            ₹{lowestPrice.toFixed(2)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ₹{lowestOriginalPrice.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            openAddToCartModal({
              productId: item.id,
              productName: item.name,
              productImage: isPerfume(item) ? item.coverImage : item.thumbnail,
              productType: isPerfume(item) ? "perfume" : "clothing",
              productVariants: isPerfume(item)
                ? item.price.map((p) => ({
                    id: p.id,
                    price: p.price,
                    originalPrice: p.originalPrice ?? 0,
                    badgeText: p.badgeText ?? "",
                    ml_volume: p.quantity.toString(),
                  }))
                : item.size.map((s) => ({
                    id: s.id,
                    price: s.price,
                    originalPrice: s.originalPrice ?? 0,
                    badgeText: s.badgeText ?? "",
                    size: s.size,
                  })),
            });
          }}
          className="w-full bg-black text-white font-semibold py-3 rounded hover:bg-gray-800 transition-colors duration-300 uppercase text-sm mt-2"
        >
          ADD TO CART
        </button>
      </div>
    </Link>
  );
}

// Main Best Sellers Component
export default function BestSellers() {
  const { bestSellers, isLoading } = useHomepage();

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl  font-bold text-[#0f182c]">BEST SELLERS</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-lg h-80"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!bestSellers || bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f182c]">BEST SELLERS</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.slice(0, 8).map((item) => (
            <BestSellerCard key={item.id} item={item} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/search"
            className="inline-block bg-white hover:bg-black text-black hover:text-white border border-black py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
