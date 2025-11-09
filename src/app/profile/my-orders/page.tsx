"use client";
import React from "react";
import { ShoppingBag } from "lucide-react";

export default function MyOrders() {
  return (
    <div className="bg-white border border-gray-200 p-8">
      <h2 className="text-2xl font-light tracking-wide mb-8 uppercase">My Orders</h2>
      <div className="text-center py-12">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600">Coming Soon</p>
        <p className="text-sm text-gray-400 mt-2">Your order history will appear here</p>
      </div>
    </div>
  );
}
