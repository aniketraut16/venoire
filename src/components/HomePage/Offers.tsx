"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function Offers() {
  const collectionsSwiperRef = useRef<SwiperType | null>(null);
  const productsSwiperRef = useRef<SwiperType | null>(null);

    return (
    <div className="w-full bg-white">
      {/* Header Section */}
      <motion.div 
        className="text-center py-12 px-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-3 tracking-wide">
          DISCOVER OUR ONLINE EXCLUSIVE COLLECTIONS
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Elevate Your Style: Shop the Freshest Styles from our Online Exclusive Collections
        </p>
      </motion.div>

      {/* Collections Carousel */}
      <div className="max-w-7xl mx-auto px-4 mb-16 relative">
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
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="collections-swiper"
          onSwiper={(swiper) => (collectionsSwiperRef.current = swiper)}
        >
          {collectionsData.map((collection, index) => (
            <SwiperSlide key={index}>
              <motion.div 
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
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-6 left-6">
                  <button className="bg-white text-gray-900 px-6 py-2.5 text-sm font-medium tracking-wider hover:bg-gray-100 transition-colors">
                    {collection.title}
                  </button>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="collections-pagination flex justify-center mt-6"></div>

        {/* Custom Navigation Arrows */}
        <button className="collections-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="collections-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            padding: 0 10px;
          }
        }

        @media (max-width: 640px) {
          .collections-swiper,
          .products-swiper {
            padding: 0;
          }
          .collections-next,
          .collections-prev {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
}

// Collections Data
const collectionsData = [
  {
    title: "WINGS OF GLORY",
    image: "/category/mens.jpg",
  },
  {
    title: "LEOPARDS & LILIES",
    image: "/category/womens.png",
  },
  {
    title: "LEGS NOW TURN HEADS",
    image: "/category/kids.jpeg",
  },
  {
    title: "SUMMER COLLECTION",
    image: "/category/perfumes.jpg",
  },
  {
    title: "GIFT ITEMS",
    image: "/category/gifts.jpg",
  },
];

// Products Data
const productsData = [
  {
    category: "Handbags",
    name: "Women Black Casual Handbag",
    price: 4599,
    image: "/best-sellers/Classic-Crewneck-T-Shirt.png",
    badge: "JUST IN",
    colors: [{ name: "Black", hex: "#000000" }],
  },
  {
    category: "Casual Shirts",
    name: "Men Pink Solid Full Sleeves Casual Shirt",
    price: 2799,
    image: "/best-sellers/Polo-Shirt.png",
    badge: "JUST IN",
    colors: [{ name: "Pink", hex: "#FFC0CB" }],
  },
  {
    category: "Suits And Blazers",
    name: "Boys Green Textured Suit",
    price: 2999,
    image: "/best-sellers/Oxford-Button-Down-Shirt.png",
    badge: "JUST IN",
    colors: [{ name: "Green", hex: "#90EE90" }],
  },
  {
    category: "T-Shirts",
    name: "Men Navy Blue Solid T-Shirt",
    price: 1299,
    image: "/best-sellers/Flannel-Shirt.png",
    badge: "JUST IN",
    colors: [{ name: "Navy", hex: "#000080" }],
  },
  {
    category: "Casual Shirts",
    name: "Men White Printed Casual Shirt",
    price: 1899,
    image: "/best-sellers/Henley-Shirt.png",
    badge: "JUST IN",
    colors: [{ name: "White", hex: "#FFFFFF" }],
  },
  {
    category: "Ethnic Wear",
    name: "Women Beige Ethnic Set",
    price: 3499,
    image: "/best-sellers/Camp-Collar-Shirt.png",
    badge: "JUST IN",
    colors: [{ name: "Beige", hex: "#F5F5DC" }],
    },
];
