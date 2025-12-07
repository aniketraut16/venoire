'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { Instagram } from 'lucide-react'
import { config } from '@/variables/config'

const reels = [
//   {
//     id: 1,
//     url: 'https://www.instagram.com/reel/DPygBPjkdUr/',
//     embedUrl: 'https://www.instagram.com/reel/DPygBPjkdUr/embed/captioned'
//   },
  {
    id: 2,
    url: 'https://www.instagram.com/reel/DR1FyJSkgoK/',
    embedUrl: 'https://www.instagram.com/reel/DR1FyJSkgoK/embed/captioned'
  },
  {
    id: 3,
    url: 'https://www.instagram.com/reel/DRep44wknRi/',
    embedUrl: 'https://www.instagram.com/reel/DRep44wknRi/embed/captioned'
  },
  {
    id: 4,
    url: 'https://www.instagram.com/reel/DRU_cOEDTVm/',
    embedUrl: 'https://www.instagram.com/reel/DRU_cOEDTVm/embed/captioned'
  }
]

export default function InstaReels() {
  const [activeReel, setActiveReel] = useState<number | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const iframeRefs = useRef<{ [key: number]: HTMLIFrameElement | null }>({})
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Load Instagram embed script and process embeds
    const loadInstagramEmbeds = () => {
      if (typeof window !== 'undefined' && (window as any).instgrm) {
        (window as any).instgrm.Embeds.process()
      }
    }

    // Try to load embeds after a short delay
    const timer = setTimeout(loadInstagramEmbeds, 1000)

    // Create intersection observer to detect when reels are in viewport
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const reelId = parseInt(entry.target.getAttribute('data-reel-id') || '0')
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveReel(reelId)
          }
        })
      },
      { threshold: 0.5 }
    )

    // Observe all reel containers
    const reelElements = document.querySelectorAll('[data-reel-id]')
    reelElements.forEach((el) => observerRef.current?.observe(el))

    return () => {
      clearTimeout(timer)
      observerRef.current?.disconnect()
    }
  }, [])

  const handleReelClick = (reelId: number) => {
    setActiveReel(reelId)
  }

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
            href={config.INSTAGRAM_URL}
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
