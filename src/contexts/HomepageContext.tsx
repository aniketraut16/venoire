"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  HomepageData, 
  HomepageMeta,
  HeroCarouselItem,
  FeaturedCollection,
  FeaturedProduct,
  InstagramReel,
  NavbarContentData,
  CollectionsAndCategories,
  TopProductswithCategory
} from "@/types/homepage";
import { Perfume } from "@/types/perfume";
import { getHomepageContent } from "@/utils/homepage";

interface HomepageContextType {
  heroCarousel: HeroCarouselItem[];
  featuredCollections: FeaturedCollection[];
  featuredPerfumes: FeaturedProduct[];
  featuredClothing: FeaturedProduct[];
  instagramReels: InstagramReel[];
  navbarContent: NavbarContentData | null;
  collectionsAndCategories: CollectionsAndCategories | null;
  topProducts: TopProductswithCategory[];
  perfumes: Perfume[];
  meta: HomepageMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const HomepageContext = createContext<HomepageContextType | undefined>(undefined);

interface HomepageProviderProps {
  children: ReactNode;
}

export const HomepageProvider: React.FC<HomepageProviderProps> = ({ children }) => {
  const [heroCarousel, setHeroCarousel] = useState<HeroCarouselItem[]>([]);
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollection[]>([]);
  const [featuredPerfumes, setFeaturedPerfumes] = useState<FeaturedProduct[]>([]);
  const [featuredClothing, setFeaturedClothing] = useState<FeaturedProduct[]>([]);
  const [instagramReels, setInstagramReels] = useState<InstagramReel[]>([]);
  const [navbarContent, setNavbarContent] = useState<NavbarContentData | null>(null);
  const [collectionsAndCategories, setCollectionsAndCategories] = useState<CollectionsAndCategories | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductswithCategory[]>([]);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [meta, setMeta] = useState<HomepageMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomepageContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getHomepageContent();

      if (response.success && response.data) {
        setHeroCarousel(response.data.hero_carousel || []);
        setFeaturedCollections(response.data.featured_collections || []);
        setFeaturedPerfumes(response.data.featured_perfumes || []);
        setFeaturedClothing(response.data.featured_clothing || []);
        setInstagramReels(response.data.instagram_reels || []);
        setNavbarContent(response.data.navbar_content || null);
        setCollectionsAndCategories(response.data.collections_and_categories || null);
        setTopProducts(response.data.top_products || []);
        setPerfumes(response.data.perfumes || []);
        setMeta(response.meta || null);
      } else {
        setError(response.message || "Failed to fetch homepage content");
      }
    } catch (err) {
      console.error("Error fetching homepage content:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const refetch = async () => {
    await fetchHomepageContent();
  };

  const value: HomepageContextType = {
    heroCarousel,
    featuredCollections,
    featuredPerfumes,
    featuredClothing,
    instagramReels,
    navbarContent,
    collectionsAndCategories,
    topProducts,
    perfumes,
    meta,
    isLoading,
    error,
    refetch,
  };

  return (
    <HomepageContext.Provider value={value}>
      {children}
    </HomepageContext.Provider>
  );
};

export const useHomepage = (): HomepageContextType => {
  const context = useContext(HomepageContext);
  if (context === undefined) {
    throw new Error("useHomepage must be used within a HomepageProvider");
  }
  return context;
};
