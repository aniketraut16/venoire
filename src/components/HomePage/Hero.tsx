"use client";
import React, { useRef, useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Import required modules
import {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

export default function Hero() {
  const swiperRef = useRef<SwiperType | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [scrollScale, setScrollScale] = useState(1);

  const heroImages = [
    "/banner1.jpg",
    "/banner2.jpg",
    "/banner3.jpg",
    "/banner4.jpg",
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate scroll progress (0 to 1)
        // When element is at top of screen, progress = 1
        // When element is at bottom of screen, progress = 0
        const scrollProgress = Math.max(
          0,
          Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight))
        );

        // Scale from 1 to 1.8 based on scroll progress
        const scale = 1 + scrollProgress * 0.8;
        setScrollScale(scale);
      }
    };

    handleScroll(); // Initial call
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative w-full h-[70vh] md:h-[100vh] mx-auto md:mx-auto mobile-full-width overflow-hidden"
    >
      <Swiper
        cssMode={true}
        keyboard={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="hero-swiper overflow-hidden"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {heroImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full overflow-hidden cursor-pointer">
              <img
                src={image}
                alt={`Hero slide ${index + 1}`}
                className="w-full h-full object-contain transition-transform duration-100 ease-out"
                style={{ 
                  maxHeight: "100vh",
                  transform: `scale(${scrollScale})`,
                  transformOrigin: "center center"
                }}
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles for Swiper */}
      <style jsx global>{`
        .hero-swiper {
          width: 100%;
          height: 70vh;
        }
        .hero-swiper .swiper-slide {
          width: 100%;
          height: 100%;
        }
        @media (min-width: 768px) {
          .hero-swiper {
            height: 100vh;
          }
        }
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #9ca3af;
          border-radius: 50%;
          margin: 0 6px;
          transition: all 0.3s;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #fff;
          transform: scale(1.25);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        .swiper-pagination-bullet:hover {
          background: #6b7280;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: #fff !important;
          width: 44px !important;
          height: 44px !important;
    
          background: transparent !important;
         
          padding: 12px;
          top: 50% !important;
          transform: translateY(-50%) !important;
          margin-top: 0 !important;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 24px !important;
          font-weight: 900 !important;
        }
        /* Hide any default navigation styles */
        .swiper-button-next:before,
        .swiper-button-prev:before {
          display: none !important;
        }
        .swiper-button-next,
        .swiper-rtl .swiper-button-prev {
          right: 20px;
        }
        .swiper-button-prev,
        .swiper-rtl .swiper-button-next {
          left: 20px;
        }
          .collections-next ,.collections-prev {
            display: none !important;
          }
        @media (max-width: 768px) {
          .mobile-full-width {
            width: 100vw;
            margin-left: calc(-50vw + 50%);
            position: relative;
          }
          .hero-swiper {
            height: 70vh;
            width: 100vw;
          }
          .hero-swiper .swiper-slide {
            width: 100%;
            height: 100%;
          }
          .hero-swiper .swiper-slide img {
            width: 100vw;
            height: 70vh;
            object-fit: cover;
          }
          .swiper-button-next,
          .swiper-button-prev {
            width: 36px !important;
            height: 36px !important;
          }
          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 16px !important;
          }

        }
      `}</style>
    </div>
  );
}
