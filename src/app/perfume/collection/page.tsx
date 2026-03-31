"use client";

import { getPerfumes, getPerfumeCollections } from "@/utils/perfume";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import OnePerfumecard from "@/components/Perfume/OnePerfumecard";
import { PerfumeCollection } from "@/types/perfume";
import { Perfume } from "@/types/perfume";
import { PerfumeGender } from "@/types/product";
import { FiSearch, FiChevronRight } from "react-icons/fi";

const VALID_GENDERS: PerfumeGender[] = ["Mens", "Womens", "Unisex"];

type GenderFilter = PerfumeGender | "All";

const parseGenderParam = (value: string | null): GenderFilter => {
  if (value && VALID_GENDERS.includes(value as PerfumeGender)) {
    return value as PerfumeGender;
  }
  return "All";
};

const CollectionPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const collectionSlug = searchParams?.get("slug") || "";
  const genderParam = searchParams?.get("gender") || null;

  const [collection, setCollection] = useState<PerfumeCollection | null>(null);
  const [collectionList, setCollectionList] = useState<PerfumeCollection[]>([]);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<GenderFilter>(() => parseGenderParam(genderParam));
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    setSelectedGender(parseGenderParam(genderParam));
  }, [genderParam]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const collections = await getPerfumeCollections();
      
      const allCollection: PerfumeCollection = {
        id: "",
        name: "All",
        slug: "all",
        description: "Browse all perfumes",
        banner_image_url: "",
      };
      
      setCollectionList([allCollection, ...collections]);
      
      const genderArg = selectedGender !== "All" ? selectedGender : undefined;

      if (!collectionSlug || collectionSlug === "all") {
        setCollection(allCollection);
        const perfumesData = await getPerfumes({ gender: genderArg });
        setPerfumes(perfumesData);
      } else {
        const currentCollection = collections.find(c => c.slug === collectionSlug);
        setCollection(currentCollection || allCollection);
        
        const perfumesData = await getPerfumes({ 
          collection_slug: currentCollection?.slug || collectionSlug,
          gender: genderArg,
        });
        setPerfumes(perfumesData);
      }
      
      setIsLoading(false);
    };
    fetchData();
  }, [collectionSlug, selectedGender]);

  useEffect(() => {
    if (!perfumes || perfumes.length === 0) {
      setFilteredPerfumes([]);
      return;
    }

    let filtered = [...perfumes];

    if (searchQuery) {
      filtered = filtered.filter(
        (perfume) =>
          perfume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          perfume.fragrance.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPerfumes(filtered);
  }, [perfumes, searchQuery]);

  const buildUrl = (slug: string, gender: GenderFilter) => {
    const params = new URLSearchParams();
    params.set("slug", slug);
    if (gender !== "All") params.set("gender", gender);
    return `/perfume/collection?${params.toString()}`;
  };

  const handleGenderChange = (gender: GenderFilter) => {
    const params = new URLSearchParams();
    if (collectionSlug) params.set("slug", collectionSlug);
    if (gender !== "All") params.set("gender", gender);
    const query = params.toString();
    router.push(`/perfume/collection${query ? `?${query}` : ""}`);
  };

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
    <div className="min-h-screen bg-gray-50 mt-30">
      {/* Hero Banner with Cover Image */}
      {/* {collection.slug !== "all" ? (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] bg-linear-to-r from-red-500 to-orange-500 overflow-hidden">
          <img
            src={collection.banner_image_url}
            alt={collection.name}
            className="object-cover w-full h-full opacity-90"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-wider mb-4 drop-shadow-lg">
              {collection.name}
            </h1>
            <p className="text-lg md:text-xl italic">{collection.description || ''}</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] bg-linear-to-r from-red-500 to-orange-500 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-wider mb-4 drop-shadow-lg">
              All Perfumes
            </h1>
            <p className="text-lg md:text-xl italic">Explore our complete collection</p>
          </div>
        </div>
      )} */}

      {/* Gender Title + Collection Tabs */}
      <div className="top-0 z-40 max-w-352 mx-auto pt-6 pb-2 px-4">
        <div className="max-w-352 mx-auto">
          {/* Gender Label */}
          {selectedGender !== "All" && (
            <p className="text-sm font-semibold uppercase tracking-widest text-red-500 mb-1">
              {selectedGender}
            </p>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {selectedGender === "All" ? "All Perfumes" : `${selectedGender}'s Perfumes`}
          </h2>

          {/* Collection Tabs */}
          {/* <div className="flex items-center overflow-x-auto scrollbar-hide py-1 gap-2">
            {collectionList.map((col) => (
              <a
                key={col.id}
                href={buildUrl(col.slug, selectedGender)}
                className={`shrink-0 h-10 px-6 flex items-center justify-center bg-red-50 font-medium transition-all border-2 rounded-md ${
                  col.slug === (collectionSlug || "all")
                    ? "border-red-400 text-red-500"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {col.name}
              </a>
            ))}
            <div className="shrink-0 px-2">
              <FiChevronRight className="text-gray-400" />
            </div>
          </div> */}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-900 py-6  top-[57px] z-30 shadow-lg max-w-352 mx-4 md:mx-auto rounded-xl">
        <div className="max-w-352 mx-auto px-4">
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


            {/* Gender Filter */}
            <div className="flex items-center gap-2">
              {(["All", "Mens", "Womens", "Unisex"] as GenderFilter[]).map((g) => (
                <button
                  key={g}
                  onClick={() => handleGenderChange(g)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                    selectedGender === g
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:border-red-400 hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-352 mx-auto px-4 py-12">
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No perfumes found matching your filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                handleGenderChange("All");
              }}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPerfumes.map((perfume) => (
              <OnePerfumecard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
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
