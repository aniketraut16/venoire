"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useHomepage } from "@/contexts/HomepageContext";

export default function HeroSlideshow() {
  const swiperRef = useRef<SwiperType | null>(null);
  const { perfumeCarousel } = useHomepage();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {perfumeCarousel.length <= 1 ? (
        <div className="relative w-full h-full cursor-pointer">
          {perfumeCarousel[0] && (
            <img
              src={perfumeCarousel[0].image_url}
              alt="Perfume hero"
              className="w-full h-full object-cover object-center"
            />
          )}
        </div>
      ) : (
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
          {perfumeCarousel.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full cursor-pointer">
                <img
                  src={item.image_url}
                  alt={`Perfume hero slide ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
