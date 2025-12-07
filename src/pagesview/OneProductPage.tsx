'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { getDetailProduct } from '@/utils/products'
import type { DetailProduct, ProductPricing } from '@/types/product'
import { Heart, ShoppingCart, Truck, Tag, Star, Package, Calendar, Loader, ChevronDown, ChevronUp } from 'lucide-react'
import { Lens } from '@/components/ui/lens'
import OnproductImageView from '@/components/Product/OnproductImageView'
import { useLoading } from '@/contexts/LoadingContext';
import { useCart } from '@/contexts/cartContext';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

export default function OneProductPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [product, setProduct] = useState<DetailProduct | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductPricing | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const { startLoading, stopLoading } = useLoading();
  const { addToCart, addToWishlist } = useCart();


  useEffect(() => {
    if (!slug) return
    const fetchProduct = async () => {
      startLoading();
      const res = await getDetailProduct(slug)
      if (res.success && res.data) {
        setProduct(res.data)
        if (res.data.pricing.length > 0) setSelectedVariant(res.data.pricing[0])
      }
      stopLoading();
    }
    fetchProduct()
  }, [slug])

  const handleSizeSelect = (size: string) => {
    if (!product) return
    const variant = product.pricing.find((v) => v.size === size)
    setSelectedVariant(variant || null)
  }

  const toggleWishlist = () => setIsWishlisted((prev) => !prev)

  const displayedPrice = useMemo(() => selectedVariant?.price ?? 0, [selectedVariant])
  const displayedOriginalPrice = useMemo(() => selectedVariant?.originalPrice ?? 0, [selectedVariant])
  const displayedDiscount = useMemo(() => selectedVariant?.discount ?? 0, [selectedVariant])

  const getSelectedVariantId = (): string | null => {
    const idCandidate = selectedVariant?.id ?? null;
    return idCandidate && String(idCandidate).length > 0 ? String(idCandidate) : null;
  }

  const handleAddToCart = async () => {
    const variantId = getSelectedVariantId();
    if (!variantId) return;
    await addToCart({ productVariantId: variantId, quantity: 1 });
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader />
        </div>
      </div>
    )
  }

  const allImages = [product.thumbnail, ...product.images].filter((img): img is string => !!img);

  return (
    <>
      {showImageModal && (
        <OnproductImageView
          images={allImages}
          onClose={() => setShowImageModal(false)}
          initialIndex={currentImageIndex}
        />
      )}
      <div className="min-h-screen bg-white pt-16 lg:pt-25  pb-6 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-12">
            {/* Images - Carousel on Mobile, Grid on Desktop */}
            <div className="lg:col-span-3">
              {/* Mobile Carousel */}
              <div className="block md:hidden">
                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={5}
                  slidesPerView={1.3}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  className="product-image-swiper"
                >
                  {allImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="aspect-[3/5] bg-gray-50 overflow-hidden relative"
                        onClick={() => {
                          setShowImageModal(true)
                          setCurrentImageIndex(index)
                        }}
                      >
                        <img
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 gap-4 p-4">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-50 overflow-hidden relative group cursor-zoom-in"
                    onClick={() => {
                      setShowImageModal(true)
                      setCurrentImageIndex(index)
                    }}
                  >
                    <Lens>
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Lens>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <span className="text-gray-500 text-xs md:text-sm lato-regular">{product.category}</span>
                </div>
                <h1 className="text-xl md:text-2xl pt-serif-regular text-gray-900 mb-2 leading-tight">{product.name}</h1>

                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  ))}
                  <span className="text-xs text-gray-600 lato-regular">(4.8) • 127 reviews</span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 md:gap-3 mb-2 md:mb-3">
                  <span className="text-xl md:text-2xl lato-black text-gray-900">
                    Rs {displayedPrice.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                  {displayedDiscount > 0 && (
                    <>
                      <span className="text-base md:text-lg text-red-700 line-through lato-regular">
                        Rs {displayedOriginalPrice.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-green-600 lato-bold text-xs md:text-sm">
                        Save {displayedDiscount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Sizes */}
              {product.pricing.length > 0 && (
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-xs md:text-sm lato-bold text-gray-900 uppercase tracking-wide">Size</h3>
                  <div className="flex gap-2 flex-wrap">
                    {[...product.pricing].sort((a, b) => {
                      const sizeA = parseInt(a.size ?? '0');
                      const sizeB = parseInt(b.size ?? '0');
                      return sizeA - sizeB;
                    }).map((variant) => (
                      <button
                        key={variant.size}
                        onClick={() => handleSizeSelect(variant.size ?? '')}
                        className={`px-3 md:px-4 py-2 border transition-colors lato-regular text-xs md:text-sm ${
                          selectedVariant?.size === variant.size
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900'
                        }`}
                      >
                        {variant.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons - Desktop Only */}
              <div className="hidden md:block space-y-3">
                <button
                  disabled={!selectedVariant}
                  className="w-full bg-gradient-to-r from-[#d4b500] to-[#af7834] text-white py-3 px-6 lato-bold uppercase tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={!selectedVariant}
                    onClick={handleAddToCart}
                    className="bg-white border border-gray-900 text-gray-900 py-3 px-4 lato-bold uppercase tracking-wide hover:bg-gray-900 hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => addToWishlist(product.id)}
                    className={`w-full py-3 px-4 lato-bold uppercase tracking-wide transition-colors border flex items-center justify-center gap-2 text-sm ${
                      isWishlisted
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                    Wishlist
                  </button>
                </div>
              </div>

              {/* Delivery */}
              <div className="space-y-3 md:space-y-6 pt-4 md:pt-6 border-t border-gray-200">
                <h2 className="text-base md:text-lg lato-bold text-gray-900 uppercase tracking-wide">Delivery Options</h2>

                <div className="flex items-start md:items-center gap-3 mb-4 md:mb-6">
                  <Truck className="h-4 md:h-5 w-4 md:w-5 text-gray-400 mt-0.5 md:mt-0 flex-shrink-0" />
                  <div>
                    <span className="text-green-600 lato-bold text-sm md:text-base">Express Delivery available</span>
                    <p className="text-xs md:text-sm text-gray-600 lato-regular">
                      <button className="underline hover:no-underline">Login</button> or select location to see availability
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex items-start gap-3">
                    <Package className="h-4 md:h-5 w-4 md:w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="lato-bold text-gray-900 text-sm md:text-base">Free Delivery</h4>
                      <p className="text-xs md:text-sm text-gray-600 lato-regular">
                        Easily exchange items if not the right size
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 md:h-5 w-4 md:w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="lato-bold text-gray-900 text-sm md:text-base">7 Days Free Return & Exchange*</h4>
                      <p className="text-xs md:text-sm text-gray-600 lato-regular">
                        Replacement delivery for any exchanged product will be delivered within 7-10 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-gray-200">
                <h3 className="text-base md:text-lg lato-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Tag className="h-4 md:h-5 w-4 md:w-5" />
                  Coupon Code
                </h3>
                <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 focus:outline-none focus:border-gray-900 lato-regular text-sm md:text-base"
                  />
                  <button className="px-6 md:px-8 py-2 md:py-3 bg-gray-900 text-white lato-bold uppercase tracking-wide hover:bg-gray-800 transition-colors text-sm md:text-base">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="mt-12 md:mt-28">
            <div className="bg-white p-4 md:p-12 border border-gray-100 relative overflow-hidden">
              <div className="mb-4 md:mb-8">
                <h3 className="text-xl md:text-3xl pt-serif-bold text-gray-900 mb-3 relative">
                  About This Product
                  <div className="absolute -bottom-2 left-0 w-12 md:w-16 h-0.5 md:h-1 bg-gradient-to-r from-gray-900 to-gray-600"></div>
                </h3>
              </div>

              {/* Product Attributes - Prioritized on Mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12 mb-6 md:mb-8 md:order-2 order-1">
                {product.attributes.map((attr, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 md:py-3 border-b border-gray-100 last:border-b-0 group hover:bg-gray-50 transition-colors px-2 -mx-2"
                  >
                    <span className="lato-bold text-gray-900 text-xs md:text-sm uppercase tracking-wide">{attr.name}:</span>
                    <span className="lato-regular text-gray-700 font-medium text-xs md:text-base">{attr.value}</span>
                  </div>
                ))}
              </div>

              {/* Description with Read More on Mobile */}
              <div className="md:order-1 order-2">
                <p className={`text-sm md:text-xl text-gray-700 leading-relaxed lato-light font-light tracking-wide transition-all duration-300 ${
                  isDescriptionExpanded ? '' : 'line-clamp-3 md:line-clamp-none'
                }`}>
                  {product.description}
                </p>
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="md:hidden mt-2 text-gray-900 lato-bold text-sm flex items-center gap-1 hover:underline"
                >
                  {isDescriptionExpanded ? (
                    <>
                      Read Less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Buttons - Mobile Only */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="flex gap-3">
            <button
              disabled={!selectedVariant}
              onClick={handleAddToCart}
              className="flex-1 bg-gray-900 text-white py-3 px-4 lato-bold uppercase tracking-wide hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>

            <button
              onClick={() => addToWishlist(product.id)}
              className={`p-3 lato-bold uppercase tracking-wide transition-colors border flex items-center justify-center text-sm ${
                isWishlisted
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <Heart className="h-5 w-5" fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
