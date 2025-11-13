"use client";
import React from "react";
import { Star } from "lucide-react";

export default function MyReviews() {
  return (
    <div className="bg-white border border-gray-200 p-4 md:p-8">
      <h2 className="text-xl md:text-2xl font-light tracking-wide mb-6 md:mb-8 uppercase">My Reviews</h2>
      <div className="text-center py-8 md:py-12">
        <Star size={40} className="mx-auto text-gray-300 mb-4 md:hidden" />
        <Star size={48} className="mx-auto text-gray-300 mb-4 hidden md:block" />
        <p className="text-base md:text-lg text-gray-600">Coming Soon</p>
        <p className="text-xs md:text-sm text-gray-400 mt-2 px-4">Your product reviews will appear here</p>
      </div>
    </div>
  );
}
