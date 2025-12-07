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
                placeholder="Search products, categories, and collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                autoFocus
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
                ) : hasResults ? (
                  <div className="space-y-6">
                    {/* Products Section */}
                    {searchResults.products.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">
                          Products ({searchResults.products.length})
                        </h3>
                        <div className="space-y-2">
                          {searchResults.products.map((product) => (
                            <Link
                              key={product.id}
                              href={`/product/${product.slug}`}
                              onClick={onClose}
                              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-1">
                                  {product.name}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {product.description}
                                </p>
                                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full mt-2">
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
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">
                          Categories ({searchResults.categories.length})
                        </h3>
                        <div className="space-y-2">
                          {searchResults.categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/c/${category.slug}`}
                              onClick={onClose}
                              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-1">
                                  {category.name}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {category.description}
                                </p>
                                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full mt-2">
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
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">
                          Collections ({searchResults.collections.length})
                        </h3>
                        <div className="space-y-2">
                          {searchResults.collections.map((collection) => (
                            <Link
                              key={collection.id}
                              href={getCollectionLink(collection)}
                              onClick={onClose}
                              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-1">
                                  {collection.name}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {collection.description}
                                </p>
                                <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full mt-2 capitalize">
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
