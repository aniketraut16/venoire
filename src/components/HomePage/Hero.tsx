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
import { useHomepage } from "@/contexts/HomepageContext";

export default function Hero() {
  const swiperRef = useRef<SwiperType | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [scrollScale, setScrollScale] = useState(1);
  const { heroCarousel } = useHomepage();

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate scroll progress (0 to 1)
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
      className="relative w-full h-screen md:h-screen overflow-hidden"
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
            <div className="relative w-full h-full overflow-hidden cursor-pointer">
              <img
                src={item.image_url}
                alt={`Hero slide ${index + 1}`}
                className="w-full h-full object-cover md:object-contain transition-transform duration-100 ease-out"
                style={{ 
                  transform: `scale(${scrollScale})`,
                  transformOrigin: "center center"
                }}
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
