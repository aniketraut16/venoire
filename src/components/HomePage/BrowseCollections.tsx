"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { CategoryorCollection } from "@/types/homepage";
import { useRouter } from "next/navigation";

export default function BrowseCollections({ collections }: { collections: CategoryorCollection[] }) {
  const collectionsSwiperRef = useRef<SwiperType | null>(null);
  const router = useRouter();
    return (
    <div className="w-full bg-white">
      {/* Header Section */}
      <motion.div 
        className="text-center py-8 sm:py-10 md:py-12 px-4 sm:px-6"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-section text-gray-900 mb-2 sm:mb-3 tracking-wide px-2">
          DISCOVER OUR ONLINE EXCLUSIVE COLLECTIONS
        </h1>
        <p className="text-body text-gray-600 px-4">
          Elevate Your Style: Shop the Freshest Styles from our Online Exclusive Collections
        </p>
      </motion.div>

      {/* Collections Carousel */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 mb-12 sm:mb-14 md:mb-16 relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: ".collections-next",
            prevEl: ".collections-prev",
          }}
          pagination={{
            clickable: true,
            el: ".collections-pagination",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            480: {
              slidesPerView: 1.5,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="collections-swiper"
          onSwiper={(swiper) => (collectionsSwiperRef.current = swiper)}
        >
          {collections.map((collection: CategoryorCollection, index: number) => (
            <SwiperSlide key={index}>
              <motion.div 
                onClick={() => router.push(`/d/${collection.slug}`)}
                className="relative overflow-hidden rounded-none group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
              >
                <div className="aspect-3/4 overflow-hidden">
                  <img
                    src={collection.image || '/fallback.png'}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        e.currentTarget.src = '/fallback.png'
                    }}
                  />
                </div>
                <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6">
                  <button className="bg-white text-gray-900 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm font-medium tracking-wider hover:bg-gray-100 transition-colors">
                    {collection.name}
                  </button>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="collections-pagination flex justify-center mt-4 sm:mt-5 md:mt-6"></div>

        {/* Custom Navigation Arrows - Hidden on Mobile */}
        <button className="collections-prev hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white w-8 h-8 md:w-10 md:h-10 rounded-full items-center justify-center shadow-lg transition-all">
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="collections-next hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white w-8 h-8 md:w-10 md:h-10 rounded-full items-center justify-center shadow-lg transition-all">
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

  

      {/* Custom Styles */}
      <style jsx global>{`
        .collections-swiper,
        .products-swiper {
          position: relative;
          padding: 0 50px;
        }

        .collections-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 1;
          margin: 0 6px;
          transition: all 0.3s;
        }

        .collections-pagination .swiper-pagination-bullet-active {
          background: #047857;
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .collections-swiper,
          .products-swiper {
            padding: 0 8px;
          }
        }

        @media (max-width: 640px) {
          .collections-swiper,
          .products-swiper {
            padding: 0 4px;
          }
        }
        
        @media (max-width: 480px) {
          .collections-swiper,
          .products-swiper {
            padding: 0;
          }
        }
      `}</style>
        </div>
    );
}

