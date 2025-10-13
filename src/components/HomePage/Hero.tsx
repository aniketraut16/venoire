"use client";
import React, { useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
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

  const heroImages = [
    "/banner1.png",
    "/banner2.png",
    "/banner3.png",
    "/banner4.png",
    "/banner5.png",
  ];

  return (
    <div className="relative w-full mx-auto md:mx-auto mobile-full-width">
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        mousewheel={true}
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
                className="w-full h-full object-cover"
                style={{ maxHeight: "90vh" }}
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
          height: 90vh;
        }
        .hero-swiper .swiper-slide {
          width: 100%;
          height: 100%;
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
          color: #fff;
          width: 44px;
          height: 44px;
          border: 1px solid #fff;
          background: transparent;
          border-radius: 50%;
          padding: 12px;
          top: 50%;
          transform: translateY(-50%);
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 20px;
        }
        .swiper-button-next,
        .swiper-rtl .swiper-button-prev {
          right: 20px;
        }
        .swiper-button-prev,
        .swiper-rtl .swiper-button-next {
          left: 20px;
        }
        @media (max-width: 768px) {
          .mobile-full-width {
            width: 100vw;
            margin-left: calc(-50vw + 50%);
            position: relative;
          }
          .hero-swiper {
            height: 100vh;
            width: 100vw;
          }
          .hero-swiper .swiper-slide {
            width: 100%;
            height: 100%;
          }
          .hero-swiper .swiper-slide img {
            width: 100vw;
            height: 100vh;
            object-fit: cover;
          }
          .swiper-button-next,
          .swiper-button-prev {
            width: 36px;
            height: 36px;
          }
          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
