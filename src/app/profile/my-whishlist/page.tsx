"use client";
import React, { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import ProductCard from "@/components/Product/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/cartContext";
import { useLoading } from "@/contexts/LoadingContext";
import { getWishlist } from "@/utils/wishlist";
import { Product } from "@/types/product";

export default function MyWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { token } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const { removeFromWishlist } = useCart();

  const fetchWishlist = async () => {
    if (token) {
      startLoading();
      try {
        const wishlistData = await getWishlist(token);
        setWishlist(wishlistData);
      } finally {
        stopLoading();
      }
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
    fetchWishlist();
  };

  return (
    <div className="bg-white border border-gray-200 p-4 md:p-8">
      <h2 className="text-xl md:text-2xl font-light tracking-wide mb-6 md:mb-8 uppercase">My Wishlist</h2>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <div className="bg-gray-100 rounded-full p-6 md:p-8 mb-4 md:mb-6 inline-block">
            <Heart size={48} className="text-gray-400 md:hidden" />
            <Heart size={64} className="text-gray-400 hidden md:block" />
          </div>
          <h3 className="text-xl md:text-2xl font-light text-gray-800 mb-2">Your Wishlist is Empty</h3>
          <p className="text-sm md:text-base text-gray-600 text-center mb-6 md:mb-8 max-w-md mx-auto px-4">
            Start adding your favorite items to your wishlist and keep track of products you love.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-xs md:text-sm text-gray-600 mb-4">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in your wishlist
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {wishlist.map((product: Product) => (
              <div key={product.id} className="flex flex-col">
                <ProductCard {...product} />
                <div className="flex flex-col w-full gap-2 mt-2 md:mt-3">
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="border border-gray-300 text-gray-700 px-3 md:px-4 py-2 w-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 text-xs md:text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={14} className="md:w-4 md:h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
