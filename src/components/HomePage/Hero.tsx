"use client";
import React, { useRef } from "react";
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
import { useHomepage } from "@/contexts/HomepageContext";

export default function Hero() {
  const swiperRef = useRef<SwiperType | null>(null);
  const { heroCarousel } = useHomepage();

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
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
        className="w-full h-full"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {heroCarousel.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full cursor-pointer">
              <img
                src={item.image_url}
                alt={`Hero slide ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
