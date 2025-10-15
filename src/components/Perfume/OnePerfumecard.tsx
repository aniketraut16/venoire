"use client";

import React from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { Perfume } from "@/types/perfume";

interface OnePerfumecardProps {
  perfume: Perfume;
}

export default function OnePerfumecard({ perfume }: OnePerfumecardProps) {
  const lowestPrice = Math.min(...perfume.price.map((p) => p.price));
  const lowestOriginalPrice = Math.min(
    ...perfume.price.map((p) => p.originalPrice)
  );
  const discount = Math.round(
    ((lowestOriginalPrice - lowestPrice) / lowestOriginalPrice) * 100
  );

  // Mock rating data
  const rating = 4;
  const reviewCount = Math.floor(Math.random() * 10) + 1;

  return (
    <Link
      href={`/perfume/${perfume.slug}`}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {perfume.gender === "Unisex" && (
          <span className="bg-gray-800 text-white text-xs font-medium px-3 py-1 rounded-full">
            Unisex
          </span>
        )}
        {perfume.gender === "Men" && (
          <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            Men
          </span>
        )}
        {perfume.gender === "Women" && (
          <span className="bg-pink-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            Women
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-xl">
        <img
          src={perfume.coverImage}
          alt={perfume.name}
          className="object-contain group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Add to Cart Button - Shows on Hover */}
        <div className="absolute inset-0 flex p-2 items-end justify-center bg-black/10 group-hover:bg-opacity-40 transition-all duration-300 opacity-0 group-hover:opacity-100">
          <button 
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic here
            }}
            className="bg-white border-2 border-red-500 text-red-500 font-semibold px-8 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 uppercase text-sm transform scale-90 group-hover:scale-100 w-full"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">

        {/* Product Name */}
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-red-500 transition-colors line-clamp-1">
          {perfume.name}
        </h3>

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
        </div>

        {/* Fragrance Notes */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          <span className="text-sm text-red-300">
            {perfume.fragrance}
          </span>
        </div>
      </div>
    </Link>
  );
}
