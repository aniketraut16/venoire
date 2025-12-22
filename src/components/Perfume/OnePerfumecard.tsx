"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { Perfume } from "@/types/perfume";  
import { useCart } from "@/contexts/cartContext";

interface OnePerfumecardProps {
  perfume: Perfume;
}

export default function OnePerfumecard({ perfume }: OnePerfumecardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { openAddToCartModal } = useCart();

  // Create array of all images [coverImage, ...images]
  const allImages = [perfume.coverImage, ...(perfume.images || [])];

  const lowestPrice = Math.min(...perfume.price.map((p) => p.price));
  const lowestOriginalPrice = Math.min(
    ...perfume.price.map((p) => p.originalPrice)
  );
  const lowestPriceItem = perfume.price.filter(
    (p) => p.price === lowestPrice
  )[0];
  const lowestBadgeText = lowestPriceItem?.badgeText;
  const lowestQuantity = lowestPriceItem?.quantity;

  // Fixed rating data - using perfume ID to generate consistent rating
  // const rating = 4.6;
  // const reviewCount = 1.1;

  // Image cycling effect on hover - starts immediately, changes every 2 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHovered && allImages.length > 1) {
      // Immediately change to next image
      setCurrentImageIndex(1);

      // Then set interval to continue cycling
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
      }, 2000); // Change image every 2 seconds
    } else {
      setCurrentImageIndex(0); // Reset to first image when not hovering
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, allImages.length]);

  // Get gender badge text
  const getGenderBadge = () => {
    if (perfume.gender === "Unisex") return "UNISEX";
    if (perfume.gender === "Mens") return "MEN";
    if (perfume.gender === "Womens") return "WOMEN";
    return "";
  };

  return (
    <Link
      href={`/perfume/${perfume.slug}`}
      className="group relative overflow-hidden transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden flex items-center justify-center rounded-sm">
        <img
          src={allImages[currentImageIndex]}
          alt={perfume.name}
          className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Top Badge - Gender */}
        <div className="absolute top-1 left-2 z-10">
          <span
            className={`text-white text-[10px] font-semibold px-3 py-1 rounded uppercase tracking-wide ${
              perfume.gender === "Unisex"
                ? "bg-purple-500"
                : perfume.gender === "Mens"
                ? "bg-blue-500"
                : "bg-pink-500"
            }`}
          >
            {getGenderBadge()}
          </span>
        </div>

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
        <p className="text-xs text-gray-500 uppercase tracking-wide">PERFUME</p>

        {/* Product Name with Quantity */}
        <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight">
          {perfume.name} - {lowestQuantity}ml
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <FaStar className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-sm font-semibold text-gray-900">
            {parseFloat(perfume.rating.toString()).toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">|</span>
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
          <span className="text-xs text-gray-600">
            (
            {perfume.rating_count >= 1000
              ? `${(perfume.rating_count / 1000).toFixed(1)}K`
              : perfume.rating_count}{" "}
            Reviews)
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
              productId: perfume.id,
              productName: perfume.name,
              productImage: perfume.coverImage,
              productType: "perfume",
              productVariants: perfume.price.map((p) => ({
                id: p.id,
                price: p.price,
                originalPrice: p.originalPrice,
                badgeText: p.badgeText,
                ml_volume: p.quantity.toString(),
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
