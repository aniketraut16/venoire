'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { search } from '@/utils/cdn'
import { SearchResponse } from '@/types/cdn'

interface SearchPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResponse['data'] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Top searches data
  const topSearches = [
    'Classic Crewneck T-Shirt',
    'Premium Oxford Shirt',
    'Mystic Dawn',
    'Velvet Oud',
    'Rose Elegance',
    'Ocean Breeze',
    'Formal Dress Shirt',
    'Jasmine Nights'
  ]

  // Handle mount animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
    } else {
      const timer = setTimeout(() => setIsMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle search with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (searchQuery.trim() === '') {
      setSearchResults(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery])

  const performSearch = async (query: string) => {
    try {
      const response = await search(query)
      if (response.success) {
        setSearchResults(response.data)
      } else {
        setSearchResults({ products: [], categories: [], collections: [] })
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults({ products: [], categories: [], collections: [] })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTopSearchClick = (searchTerm: string) => {
    setSearchQuery(searchTerm)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const getCollectionLink = (collection: SearchResponse['data']['collections'][0]) => {
    if (collection.collection_type === 'perfume') {
      return `/perfume/collection?slug=${collection.slug}`
    }
    return `/d/${collection.slug}`
  }

  const hasResults = searchResults && (
    searchResults.products.length > 0 || 
    searchResults.categories.length > 0 || 
    searchResults.collections.length > 0
  )

  if (!isMounted) return null

  return (
    <>
      {/* Overlay */}
      <div 
        data-lenis-prevent="true"
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-9998 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Search Modal - Desktop centered, Mobile bottom sheet */}
      <div className="fixed inset-0 z-9999 flex md:items-start md:justify-center items-end justify-center md:pt-20 px-0 md:px-4">
        <div 
          className={`bg-white shadow-2xl w-full md:max-w-3xl overflow-hidden transition-all duration-300 ease-out
            md:rounded-xl md:max-h-[85vh]
            rounded-t-3xl max-h-[90vh]
            ${isOpen ? 'md:translate-y-0 md:opacity-100 translate-y-0 opacity-100' : 'md:translate-y-4 md:opacity-0 translate-y-full opacity-0'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle for Mobile */}
          <div className="md:hidden flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-5 border-b border-gray-100">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products, categories, and collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-3.5 text-base bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
                autoFocus
              />
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
              aria-label="Close search"
            >
              <X size={20} className="text-gray-600" />

            </button>
          </div>

          {/* Search Content */}
          <div
            data-lenis-prevent="true"
            className="overflow-y-auto overscroll-contain md:max-h-[calc(85vh-80px)] max-h-[calc(90vh-100px)]" 
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {searchQuery.trim() === '' ? (
              /* Top Searches */
              <div className="p-5 md:p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Top Searches</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {topSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleTopSearchClick(search)}
                      className="text-left px-4 py-3 hover:bg-gray-50 rounded-xl transition-all text-gray-700 hover:text-black border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <Search size={16} className="text-gray-400 shrink-0" />
                        <span className="text-sm font-medium">{search}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Search Results */
              <div className="p-5 md:p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-black"></div>
                  </div>
                ) : hasResults ? (
                  <div className="space-y-8">
                    {/* Products Section */}
                    {searchResults.products.length > 0 && (
                      <div>
                        <h3 className="text-base font-bold mb-4 text-gray-900 flex items-center gap-2">
                          Products 
                          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {searchResults.products.length}
                          </span>
                        </h3>
                        <div className="space-y-2.5">
                          {searchResults.products.map((product) => (
                            <Link
                              key={product.id}
                              href={`/product/${product.slug}`}
                              onClick={onClose}
                              className="flex items-start gap-4 p-3.5 hover:bg-gray-50 rounded-xl transition-all group border border-transparent hover:border-gray-200"
                            >
                              <img 
                                src={product.thumbnail_url || '/dummy.jpg'} 
                                alt={product.name} 
                                className="h-20 w-20 object-cover rounded-lg shrink-0 shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.src = '/dummy.jpg'
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 group-hover:text-black transition-colors line-clamp-1 mb-1">
                                  {product.name}
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                  {product.description}
                                </p>
                                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full mt-2.5">
                                  Product
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categories Section */}
                    {searchResults.categories.length > 0 && (
                      <div>
                        <h3 className="text-base font-bold mb-4 text-gray-900 flex items-center gap-2">
                          Categories 
                          <span className="text-xs font-semibold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">
                            {searchResults.categories.length}
                          </span>
                        </h3>
                        <div className="space-y-2.5">
                          {searchResults.categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/c/${category.slug}`}
                              onClick={onClose}
                              className="flex items-start gap-4 p-3.5 hover:bg-gray-50 rounded-xl transition-all group border border-transparent hover:border-gray-200"
                            >
                              <img 
                                src={category.thumbnail_url || '/dummy.jpg'} 
                                alt={category.name} 
                                className="h-20 w-20 object-cover rounded-lg shrink-0 shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.src = '/dummy.jpg'
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 group-hover:text-black transition-colors line-clamp-1 mb-1">
                                  {category.name}
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                  {category.description}
                                </p>
                                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full mt-2.5">
                                  Category
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Collections Section */}
                    {searchResults.collections.length > 0 && (
                      <div>
                        <h3 className="text-base font-bold mb-4 text-gray-900 flex items-center gap-2">
                          Collections 
                          <span className="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {searchResults.collections.length}
                          </span>
                        </h3>
                        <div className="space-y-2.5">
                          {searchResults.collections.map((collection) => (
                            <Link
                              key={collection.id}
                              href={getCollectionLink(collection)}
                              onClick={onClose}
                              className="flex items-start gap-4 p-3.5 hover:bg-gray-50 rounded-xl transition-all group border border-transparent hover:border-gray-200"
                            >
                              <img 
                                src={collection.thumbnail_url || '/dummy.jpg'} 
                                alt={collection.name} 
                                className="h-20 w-20 object-cover rounded-lg shrink-0 shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.src = '/dummy.jpg'
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 group-hover:text-black transition-colors line-clamp-1 mb-1">
                                  {collection.name}
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                  {collection.description}
                                </p>
                                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full mt-2.5 capitalize">
                                  {collection.collection_type} Collection
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600 text-sm max-w-sm mx-auto">
                      Try searching with different keywords or check your spelling.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
