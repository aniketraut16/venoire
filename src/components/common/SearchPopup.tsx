'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { getPerfumes } from '@/utils/perfume'

interface SearchResult {
  id: string
  name: string
  slug: string
  thumbnail: string
  type: 'product' | 'perfume'
  price?: number
  category?: string
}

interface SearchPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
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

  // Handle search with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (searchQuery.trim() === '') {
      setSearchResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery)
    }, 200)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery])

  const performSearch = async (query: string) => {
    const searchTerm = query.toLowerCase().trim()
    const results: SearchResult[] = []

    // Search perfumes using API
    const perfumes = await getPerfumes({ search: searchTerm })
    
    perfumes.forEach(perfume => {
      results.push({
        id: perfume.id,
        name: perfume.name,
        slug: perfume.slug,
        thumbnail: perfume.coverImage,
        type: 'perfume',
        category: perfume.fragrance
      })
    })

    // Limit results to 8 items
    setSearchResults(results.slice(0, 8))
    setIsLoading(false)
  }

  const handleTopSearchClick = (searchTerm: string) => {
    setSearchQuery(searchTerm)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        data-lenis-prevent="true"
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-20 md:pt-24 px-4">
        <div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in slide-in-from-top-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 p-4 sm:p-6 border-b border-gray-200">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products and perfumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Search Content */}
          <div className="max-h-[60vh] overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
            {searchQuery.trim() === '' ? (
              /* Top Searches */
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Top Searches</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleTopSearchClick(search)}
                      className="text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 hover:text-black"
                    >
                      <div className="flex items-center gap-3">
                        <Search size={16} className="text-gray-400" />
                        <span className="text-sm">{search}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Search Results */
              <div className="p-4 sm:p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      Search Results ({searchResults.length})
                    </h3>
                    <div className="space-y-3">
                      {searchResults.map((result) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          href={result.type === 'product' ? `/product/${result.slug}` : `/perfume/${result.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={result.thumbnail}
                              alt={result.name}
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-1">
                              {result.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {result.category}
                            </p>
                            {result.price && (
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                ₹{result.price}
                              </p>
                            )}
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full mt-2 capitalize">
                              {result.type}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Search size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500">
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
