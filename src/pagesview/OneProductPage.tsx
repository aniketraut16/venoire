'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { getDetailProduct } from '@/utils/products'
import type { DetailProduct, ProductPricing } from '@/types/product'
import { Heart, ShoppingCart, Truck, Tag, Star, Package, Calendar, Loader } from 'lucide-react'
import { Lens } from '@/components/ui/lens'
import OnproductImageView from '@/components/Product/OnproductImageView'
import { useLoading } from '@/contexts/LoadingContext';
import { useCart } from '@/contexts/cartContext';

export default function OneProductPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [product, setProduct] = useState<DetailProduct | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductPricing | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { startLoading, stopLoading } = useLoading();
  const { addToCart } = useCart();


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

  return (
    <>
      {showImageModal && (
        <OnproductImageView
          images={product.images}
          onClose={() => setShowImageModal(false)}
          initialIndex={currentImageIndex}
        />
      )}
      <div className="min-h-screen bg-white pt-25">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Images */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 gap-4 p-4">
                {product.images.map((image, index) => (
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
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 text-sm lato-regular">{product.category}</span>
                </div>
                <h1 className="text-2xl pt-serif-regular text-gray-900 mb-2 leading-tight">{product.name}</h1>

                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  ))}
                  <span className="text-xs text-gray-600 lato-regular">(4.8) • 127 reviews</span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-2xl lato-black text-gray-900">${displayedPrice}</span>
                  {displayedDiscount > 0 && (
                    <>
                      <span className="text-lg text-red-700 line-through lato-regular">
                        ${displayedOriginalPrice}
                      </span>
                      <span className="text-green-600 lato-bold text-sm">
                        Save {displayedDiscount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Sizes */}
              {product.pricing.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm lato-bold text-gray-900 uppercase tracking-wide">Size</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.pricing.map((variant) => (
                      <button
                        key={variant.size}
                        onClick={() => handleSizeSelect(variant.size ?? '')}
                        className={`px-4 py-2 border transition-colors lato-regular text-sm ${
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

              {/* Buttons */}
              <div className="space-y-3">
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
                    onClick={toggleWishlist}
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
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <h2 className="text-lg lato-bold text-gray-900 uppercase tracking-wide mb-4">Delivery Options</h2>

                <div className="flex items-center gap-3 mb-6">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-green-600 lato-bold">Express Delivery available</span>
                    <p className="text-sm text-gray-600 lato-regular">
                      <button className="underline hover:no-underline">Login</button> or select location to see availability
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <h4 className="lato-bold text-gray-900">Free Delivery</h4>
                      <p className="text-sm text-gray-600 lato-regular">
                        Easily exchange items if not the right size
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <h4 className="lato-bold text-gray-900">15 Days Free Return & Exchange*</h4>
                      <p className="text-sm text-gray-600 lato-regular">
                        Easy returns within 15 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-lg lato-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Coupon Code
                </h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 lato-regular"
                  />
                  <button className="px-8 py-3 bg-gray-900 text-white lato-bold uppercase tracking-wide hover:bg-gray-800 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="mt-28">
            <div className="bg-white p-12 border border-gray-100 relative overflow-hidden">
              <div className="mb-8">
                <h3 className="text-3xl pt-serif-bold text-gray-900 mb-3 relative">
                  About This Product
                  <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-gray-900 to-gray-600"></div>
                </h3>
              </div>

              <p className="text-xl text-gray-700 leading-relaxed lato-light font-light tracking-wide mb-8">
                {product.description}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {product.attributes.map((attr, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 group hover:bg-gray-50 transition-colors px-2 -mx-2"
                  >
                    <span className="lato-bold text-gray-900 text-sm uppercase tracking-wide">{attr.name}:</span>
                    <span className="lato-regular text-gray-700 font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
