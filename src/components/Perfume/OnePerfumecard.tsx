"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { Perfume } from "@/types/perfume";
import { useRouter } from "next/navigation";

interface OnePerfumecardProps {
  perfume: Perfume;
}

export default function OnePerfumecard({ perfume }: OnePerfumecardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Create array of all images [coverImage, ...images]
  const allImages = [perfume.coverImage, ...(perfume.images || [])];
  
  const lowestPrice = Math.min(...perfume.price.map((p) => p.price));
  const lowestOriginalPrice = Math.min(
    ...perfume.price.map((p) => p.originalPrice)
  );
  const lowestBadgeText = perfume.price.filter((p) => p.price === lowestPrice)[0].badgeText;

  // Fixed rating data - using perfume ID to generate consistent rating
  const rating = 4;
  const reviewCount = ((perfume.id.charCodeAt(0) + perfume.id.charCodeAt(1)) % 10) + 1;

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

  return (
    <Link
      href={`/perfume/${perfume.slug}`}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {perfume.gender === "Unisex" && (
          <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            Unisex
          </span>
        )}
        {perfume.gender === "Mens" && (
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            Men
          </span>
        )}
        {perfume.gender === "Womens" && (
          <span className="bg-pink-100 text-pink-700 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            Women
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-xl">
        <img
          src={allImages[currentImageIndex]}
          alt={perfume.name}
          className="object-contain group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Add to Cart Button - Shows on Hover */}
        <div className="absolute inset-0 flex p-2 items-end justify-center bg-black/10 group-hover:bg-opacity-40 transition-all duration-300 opacity-0 group-hover:opacity-100">
          <button 
            onClick={(e) => {
              e.preventDefault();
              router.push(`/perfume/${perfume.slug}`);
              // Add to cart logic here
            }}
            className="bg-white border-2 border-red-500 text-red-500 font-semibold px-8 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 uppercase text-sm transform scale-90 group-hover:scale-100 w-full cursor-pointer"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">

        {/* Product Name */}
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-red-500 transition-colors line-clamp-1">
          {perfume.name}
        </h3>

        {/* Description - Truncated */}
        {perfume.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {perfume.description}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            Rs. {lowestPrice}
          </span>
          <span className="text-sm text-gray-400 line-through">
            Rs. {lowestOriginalPrice}
          </span>
          {lowestBadgeText && (
            <span className="text-sm text-red-300">
              {lowestBadgeText}
            </span>
          )}
        </div>

        {/* Fragrance Notes */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          <span className="text-sm text-red-300">
            {perfume.price[0].quantity} ML
          </span>
        </div>
      </div>
    </Link>
  );
}
