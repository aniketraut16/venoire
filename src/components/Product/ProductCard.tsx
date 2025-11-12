import { Product } from "@/types/product";
import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useCart } from "@/contexts/cartContext";

export default function ProductCard(product: Product) {
  const [isHovered, setIsHovered] = useState(false);
  const sizes = product.size;
  const mode = product.mode || "dark";
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToWishlist, removeFromWishlist } = useCart();

  // Utility to switch text color based on mode
  const getTextColor = (defaultColor: string, lightColor = "text-white") =>
    mode === "light" ? lightColor : defaultColor;

  const handleProductClick = () => {
    window.open(`/product/${product.slug}`, "_blank");
  };

  const handleWishlistClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist(product.id);
      setIsWishlisted(true);
    }
  };

  return (
    <div
      className="group relative overflow-hidden transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {/* Image Container */}
      <div
        className="relative aspect-[2/3] overflow-hidden"
        onContextMenu={(e) => e.preventDefault()} // Disables right-click context menu on the whole container
      >
        <img
          src={product.thumbnail}
          alt={product.name}
          className="object-cover group-hover:scale-105 transition-transform duration-300 aspect-[2/3] select-none pointer-events-none"
          draggable="false" // Prevent drag-and-drop of image
        />

        <div
          className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold border border-black
                    ${getTextColor("text-black")}`}
        >
          {product.catalog}
        </div>

        <button 
        onClick={(e) => handleWishlistClick(e)}
        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200">
          <Heart className={`w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-200 ${isWishlisted ? "text-red-500" : ""}`} />
        </button>

        {isHovered && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className="w-8 h-8 rounded-md text-sm font-medium transition-all duration-200 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="py-4 space-y-2 pt-serif-regular">
        {/* Category */}
        <p
          className={`text-sm font-medium uppercase tracking-wide ${getTextColor(
            "text-gray-600"
          )}`}
        >
          {product.category}
        </p>

        {/* Product Name */}
        <h3
          className={`text-lg font-medium line-clamp-2 ${getTextColor(
            "text-gray-900"
          )}`}
        >
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-center gap-2">
          <span
            className={`text-lg font-bold ${getTextColor("text-gray-900")}`}
          >
            {product.price.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </span>
          <span
            className={`text-sm line-through ${getTextColor("text-gray-500")}`}
          >
            {product.originalPrice.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </span>
          <span
            className={`text-xs font-medium ${
              mode === "light" ? "text-pink-300" : "text-red-600"
            }`}
          >
            {product.discount}% OFF
          </span>
        </div>
      </div>
    </div>
  );
}
