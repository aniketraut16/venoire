"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHomepage } from "@/contexts/HomepageContext";

export default function PerfumeBanner() {
  const { perfumeBanners } = useHomepage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const bannerItems = perfumeBanners.length > 0 
    ? perfumeBanners
    : [
        { id: "1", text: "Discover Our Signature Scents", url: "#", banner_group: "perfume" as const },
        { id: "2", text: "Limited Edition Fragrances Available Now", url: "#", banner_group: "perfume" as const },
        { id: "3", text: "Free Sample with Every Purchase", url: "#", banner_group: "perfume" as const }
      ];

  const increaseIndex = () => {
    if (isAnimating || bannerItems.length <= 1) return;
    setIsAnimating(true);
    setPrevIndex(currentIndex);
    setDirection('left');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
      setTimeout(() => setIsAnimating(false), 400);
    }, 0);
  };

  const decreaseIndex = () => {
    if (isAnimating || bannerItems.length <= 1) return;
    setIsAnimating(true);
    setPrevIndex(currentIndex);
    setDirection('right');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
      setTimeout(() => setIsAnimating(false), 400);
    }, 0);
  };

  useEffect(() => {
    if (bannerItems.length <= 1) return;
    
    const interval = setInterval(() => {
      increaseIndex();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, bannerItems.length]);

  if (bannerItems.length === 0) return null;

  const currentBanner = bannerItems[currentIndex];
  const prevBanner = bannerItems[prevIndex];

  return (
    <div className="w-full bg-linear-to-r from-pink-50 via-purple-50 to-pink-50 py-4 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <button
          onClick={decreaseIndex}
          disabled={isAnimating || bannerItems.length <= 1}
          className="text-gray-700 hover:text-pink-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="relative flex-1 h-8 flex items-center justify-center overflow-hidden">
          {/* Previous/Outgoing Item */}
          {isAnimating && (
            <Link
              href={prevBanner.url}
              target={prevBanner.url.startsWith("http") ? "_blank" : "_self"}
              rel={prevBanner.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-gray-800 text-sm md:text-base font-medium tracking-wide absolute inset-0 flex items-center justify-center hover:text-pink-600 transition-colors"
              style={{
                animation: direction === 'left'
                  ? 'slideOutLeft 0.4s ease-out forwards'
                  : 'slideOutRight 0.4s ease-out forwards'
              }}
            >
              {prevBanner.text}
            </Link>
          )}

          {/* Current/Incoming Item */}
          <Link
            key={currentIndex}
            href={currentBanner.url}
            target={currentBanner.url.startsWith("http") ? "_blank" : "_self"}
            rel={currentBanner.url.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-gray-800 text-sm md:text-base font-medium tracking-wide absolute inset-0 flex items-center justify-center hover:text-pink-600 transition-colors"
            style={{
              animation: direction && isAnimating
                ? `${direction === 'left' ? 'slideInLeft' : 'slideInRight'} 0.4s ease-out`
                : 'none'
            }}
          >
            {currentBanner.text}
          </Link>
        </div>

        <button
          onClick={increaseIndex}
          disabled={isAnimating || bannerItems.length <= 1}
          className="text-gray-700 hover:text-pink-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <style jsx>{`
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
