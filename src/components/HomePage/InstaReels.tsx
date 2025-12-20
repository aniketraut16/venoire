'use client'
import React from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { Instagram } from 'lucide-react'
import { siteConfig } from '@/variables/config'


export default function InstaReels() {

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Instagram size={28} className="text-pink-600 sm:w-8 sm:h-8" strokeWidth={1.5} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight">
              Follow Our Journey
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto px-4">
            Discover our latest collections, behind-the-scenes moments, and style inspiration on Instagram
          </p>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12 justify-items-center">
          <blockquote className="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DR1FyJSkgoK/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>
          <blockquote className="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DRep44wknRi/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>
          <blockquote className="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DRU_cOEDTVm/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>
          <blockquote className="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DRQE2_MDfzk/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>
        </div>

        {/* CTA Button */}
        <div className="text-center px-4">
          <Link
            href={siteConfig.INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white text-xs sm:text-sm tracking-widest uppercase rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Instagram size={18} className="sm:w-5 sm:h-5" strokeWidth={2} />
            <span className="whitespace-nowrap">Follow Us on Instagram</span>
          </Link>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      {/* Instagram Embed Script */}
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && (window as any).instgrm) {
            (window as any).instgrm.Embeds.process()
          }
        }}
      />
    </section>
  )
}
