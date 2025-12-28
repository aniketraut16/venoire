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
        className="relative aspect-2/3 overflow-hidden"
        onContextMenu={(e) => e.preventDefault()} // Disables right-click context menu on the whole container
      >
        <img
          src={product.thumbnail}
          alt={product.name}
          className="object-cover group-hover:scale-105 transition-transform duration-300 aspect-2/3 select-none pointer-events-none"
          draggable="false" // Prevent drag-and-drop of image
        />

        <span
          className={`absolute md:top-3 md:left-3 bottom-2 left-2 inline-flex items-center justify-center shrink-0 h-auto max-h-7 px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-full text-meta md:text-xs font-semibold border border-black bg-white whitespace-nowrap leading-none
                    ${getTextColor("text-black", "text-black")}`}
        >
          {product.catalog}
        </span>

        {/* Availability Status Badge */}
        {product.availabilityStatus && product.availabilityStatus !== 'in_stock' && (
          <span
            className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 inline-flex items-center justify-center px-2 py-1 rounded text-meta md:text-xs font-bold whitespace-nowrap ${
              product.availabilityStatus === 'out_of_stock'
                ? 'bg-red-600 text-white'
                : 'bg-orange-500 text-white'
            }`}
          >
            {product.availabilityStatus === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
          </span>
        )}

        <button 
        onClick={(e) => handleWishlistClick(e)}
        className="hidden md:block absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200">
          <Heart className={`w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-200 ${isWishlisted ? "text-red-500" : ""}`} />
        </button>

        {isHovered && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
            <div className="flex gap-2">
              {[...sizes].sort((a, b) => {
                const sizeA = parseInt(a.size ?? "0");
                const sizeB = parseInt(b.size ?? "0");
                return sizeA - sizeB;
              }).map((size) => (
                <button
                  key={size.id}
                  className="w-8 h-8 rounded-md text-meta font-medium transition-all duration-200 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="py-3 md:py-4 space-y-1.5 md:space-y-2 pt-serif-regular">
        {/* Category */}
        <p
          className={`text-meta font-medium uppercase tracking-wide ${getTextColor(
            "text-gray-600"
          )}`}
        >
          {product.category}
        </p>

        {/* Product Name */}
        <h3
          className={`text-title font-medium line-clamp-2 ${getTextColor(
            "text-gray-900"
          )}`}
        >
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <span
            className={`text-title font-bold ${getTextColor("text-gray-900")}`}
          >
            Rs{" "}
            {product.price.toLocaleString("en-IN", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
          {product.originalPrice && (
            <span
              className={`text-meta line-through ${getTextColor("text-gray-500")}`}
            >
              Rs{" "}
              {product.originalPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          )}
          {product.badgeText && (
            <span
              className={`text-meta font-medium ${
                mode === "light" ? "text-pink-300" : "text-red-600"
              }`}
            >
              {product.badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
