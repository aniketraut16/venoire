"use client";

import { getAllCollections, getPerfumesByCollection } from "@/utils/perfume";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import OnePerfumecard from "@/components/Perfume/OnePerfumecard";
import Image from "next/image";
import { FiSearch, FiFilter, FiChevronRight } from "react-icons/fi";

const CollectionPageContent = () => {
  const searchParams = useSearchParams();
  const collectionId = searchParams?.get("id") || "c0";
  
  const [collection, setCollection] = useState<PerfumeCollection | null>(null);
  const [collectionList, setCollectionList] = useState<
    {
      id: string;
      name: string;
      description: string;
      coverImage: string;
    }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("new-arrivals");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const collectionData = getPerfumesByCollection(collectionId);
    setCollection(collectionData);
    const collections = getAllCollections();
    setCollectionList(collections);
    setIsLoading(false);
  }, [collectionId]);

  useEffect(() => {
    if (!collection || !collection.perfumes) {
      setFilteredPerfumes([]);
      return;
    }

    let filtered = [...collection.perfumes];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (perfume) =>
          perfume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          perfume.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          perfume.fragrance.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply gender filter
    if (selectedGender !== "all") {
      filtered = filtered.filter((perfume) => perfume.gender === selectedGender);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => {
          const priceA = Math.min(...a.price.map((p) => p.price));
          const priceB = Math.min(...b.price.map((p) => p.price));
          return priceA - priceB;
        });
        break;
      case "price-high-low":
        filtered.sort((a, b) => {
          const priceA = Math.min(...a.price.map((p) => p.price));
          const priceB = Math.min(...b.price.map((p) => p.price));
          return priceB - priceA;
        });
        break;
      case "name-a-z":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-z-a":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // new-arrivals - keep original order
        break;
    }

    setFilteredPerfumes(filtered);
  }, [collection, searchQuery, sortBy, selectedGender]);

  if (isLoading || !collection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading collection...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner with Cover Image */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] bg-gradient-to-r from-red-500 to-orange-500 overflow-hidden">
        <img
          src={collection.coverImage}
          alt={collection.name}
          className="object-cover w-full h-full opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-wider mb-4 drop-shadow-lg">
            {collection.name}
          </h1>
          <p className="text-lg md:text-xl italic">{collection.description}</p>
        </div>
      </div>

      {/* Collection Tabs */}
      <div className="sticky top-0 z-40 max-w-7xl mx-auto py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center overflow-x-auto scrollbar-hide py-1 gap-2">
            {collectionList.map((col) => (
              <a
                key={col.id}
                href={`/perfume/collection?id=${col.id}`}
                className={`flex-shrink-0 h-10 px-6 flex items-center justify-center bg-red-50 font-medium transition-all border-2 rounded-md ${
                  col.id === collectionId
                    ? "border-red-400 text-red-500 "
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {col.name}
              </a>
            ))}
            {/* Scroll Arrow Indicator */}
            <div className="flex-shrink-0 px-2">
              <FiChevronRight className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-900 py-6 sticky top-[57px] z-30 shadow-lg max-w-7xl mx-auto rounded-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-2/3 lg:w-1/2">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white rounded-md pl-12 pr-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white rounded-md p-2 transition-colors">
                <FiSearch className="text-lg" />
              </button>
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md transition-colors font-medium ml-auto">
              <FiFilter />
              Filter
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 text-white">
              <label className="text-sm font-medium whitespace-nowrap">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                <option value="new-arrivals">New Arrivals</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No perfumes found matching your filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGender("all");
                setSortBy("new-arrivals");
              }}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPerfumes.map((perfume) => (
              <OnePerfumecard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading collection...</div>
        </div>
      }
    >
      <CollectionPageContent />
    </Suspense>
  );
}
