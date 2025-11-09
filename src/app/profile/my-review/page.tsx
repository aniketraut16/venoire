"use client";
import React from "react";
import { Star } from "lucide-react";

export default function MyReviews() {
  return (
    <div className="bg-white border border-gray-200 p-8">
      <h2 className="text-2xl font-light tracking-wide mb-8 uppercase">My Reviews</h2>
      <div className="text-center py-12">
        <Star size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600">Coming Soon</p>
        <p className="text-sm text-gray-400 mt-2">Your product reviews will appear here</p>
      </div>
    </div>
  );
}
