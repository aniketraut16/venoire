'use client'
import React, { useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

export default function Hero() {
    const [activeIndex, setActiveIndex] = useState(0)
    const swiperRef = useRef<SwiperType | null>(null)

    const heroImages = [
        '/banner1.png',
        '/banner2.png',
        '/banner3.png',
        '/banner4.png',
        '/banner5.png',
    ]

    return (
        <div className="relative max-w-7xl mx-auto">
            {/* Hero Carousel */}
            <div className="w-full">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        el: '.custom-pagination',
                        bulletClass: 'custom-bullet',
                        bulletActiveClass: 'custom-bullet-active',
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper
                    }}
                    className="hero-swiper overflow-hidden"
                >
                    {heroImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative w-full h-[450px] overflow-hidden rounded-lg cursor-pointer">
                                <img
                                    src={image}
                                    alt={`Hero slide ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Custom Dots Navigation */}
            <div className="flex justify-center mt-8 mb-4">
                <div className="custom-pagination flex space-x-3">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            className={`custom-bullet ${activeIndex === index ? 'custom-bullet-active' : ''}`}
                            onClick={() => {
                                if (swiperRef.current) {
                                    swiperRef.current.slideTo(index)
                                }
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
                .hero-swiper {
                    width: 100%;
                    height: 450px;
                }

                .hero-swiper .swiper-slide {
                    width: 100%;
                    height: 100%;
                }

                .custom-pagination {
                    position: static !important;
                    display: flex !important;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                }

                .custom-bullet {
                    width: 12px !important;
                    height: 12px !important;
                    background: #9CA3AF !important;
                    border-radius: 50% !important;
                    border: none !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                    opacity: 1 !important;
                    margin: 0 !important;
                }

                .custom-bullet-active {
                    background: #000 !important;
                    transform: scale(1.25) !important;
                    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5) !important;
                }

                .custom-bullet:hover {
                    background: #6B7280 !important;
                    transform: scale(1.1) !important;
                }

                .custom-bullet-active:hover {
                    background: #000 !important;
                    transform: scale(1.25) !important;
                }

                /* Hide default Swiper pagination */
                .swiper-pagination {
                    display: none !important;
                }
            `}</style>
        </div>
    )
}
