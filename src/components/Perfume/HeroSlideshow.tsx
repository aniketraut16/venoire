"use client";

import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useHomepage } from "@/contexts/HomepageContext";

export default function HeroSlideshow() {
  const swiperRef = useRef<SwiperType | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [scrollScale, setScrollScale] = useState(1);
  const { perfumeCarousel } = useHomepage();

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        const scrollProgress = Math.max(
          0,
          Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight))
        );

        const scale = 1 + scrollProgress * 0.8;
        setScrollScale(scale);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const imageStyle = {
    transform: `scale(${scrollScale})`,
    transformOrigin: "center center",
  };

  return (
    <div ref={heroRef} className="relative w-full h-screen md:h-screen overflow-hidden">
      {perfumeCarousel.length <= 1 ? (
        <div className="relative w-full h-full overflow-hidden cursor-pointer">
          {perfumeCarousel[0] && (
            <>
              <img
                src={perfumeCarousel[0].image_url}
                alt="Perfume hero"
                className="w-full h-full object-cover transition-transform duration-100 ease-out"
                style={imageStyle}
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </>
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
              <div className="relative w-full h-full overflow-hidden cursor-pointer">
                <img
                  src={item.image_url}
                  alt={`Perfume hero slide ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-100 ease-out"
                  style={imageStyle}
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
