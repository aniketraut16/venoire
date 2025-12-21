"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  HeroCarouselItem,
  InstagramReel,
  NavbarContentData,
  CollectionsAndCategories
} from "@/types/homepage";
import { Product } from "@/types/product";
import { getHomepageContent } from "@/utils/homepage";
import { Perfume } from "@/types/perfume";

interface HomepageContextType {
  heroCarousel: HeroCarouselItem[];
  featuredPerfumes: Perfume[];
  featuredClothing: Product[];
  instagramReels: InstagramReel[];
  navbarContent: NavbarContentData | null;
  collectionsAndCategories: CollectionsAndCategories | null;
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
  const [featuredPerfumes, setFeaturedPerfumes] = useState<Perfume[]>([]);
  const [featuredClothing, setFeaturedClothing] = useState<Product[]>([]);
  const [instagramReels, setInstagramReels] = useState<InstagramReel[]>([]);
  const [navbarContent, setNavbarContent] = useState<NavbarContentData | null>(null);
  const [collectionsAndCategories, setCollectionsAndCategories] = useState<CollectionsAndCategories | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomepageContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getHomepageContent();

      if (response.success && response.data) {
        setHeroCarousel(response.data.hero_carousel || []);
        setFeaturedPerfumes(response.data.featured_perfumes || []);
        setFeaturedClothing(response.data.featured_clothing || []);
        setInstagramReels(response.data.instagram_reels || []);
        setNavbarContent(response.data.navbar_content || null);
        setCollectionsAndCategories(response.data.collections_and_categories || null);
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
    featuredPerfumes,
    featuredClothing,
    instagramReels,
    navbarContent,
    collectionsAndCategories,
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
