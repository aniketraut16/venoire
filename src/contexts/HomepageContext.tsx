"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  HeroCarouselItem,
  InstagramReel,
  NavbarContentData,
  CollectionsAndCategories,
  BestSellers,
  BannerItem
} from "@/types/homepage";
import { Product } from "@/types/product";
import { getHomepageContent, getAllBannerItems } from "@/utils/homepage";
import { Perfume } from "@/types/perfume";

interface HomepageContextType {
  heroCarousel: HeroCarouselItem[];
  featuredPerfumes: Perfume[];
  featuredClothing: Product[];
  bestSellers: BestSellers[];
  instagramReels: InstagramReel[];
  navbarContent: NavbarContentData | null;
  collectionsAndCategories: CollectionsAndCategories | null;
  navbarBanners: BannerItem[];
  perfumeBanners: BannerItem[];
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
  const [bestSellers, setBestSellers] = useState<BestSellers[]>([]);
  const [instagramReels, setInstagramReels] = useState<InstagramReel[]>([]);
  const [navbarContent, setNavbarContent] = useState<NavbarContentData | null>(null);
  const [collectionsAndCategories, setCollectionsAndCategories] = useState<CollectionsAndCategories | null>(null);
  const [navbarBanners, setNavbarBanners] = useState<BannerItem[]>([]);
  const [perfumeBanners, setPerfumeBanners] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomepageContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [homepageResponse, navbarBannersResponse, perfumeBannersResponse] = await Promise.all([
        getHomepageContent(),
        getAllBannerItems("navbar"),
        getAllBannerItems("perfume")
      ]);

      if (homepageResponse.success && homepageResponse.data) {
        setHeroCarousel(homepageResponse.data.hero_carousel || []);
        setFeaturedPerfumes(homepageResponse.data.featured_perfumes || []);
        setFeaturedClothing(homepageResponse.data.featured_clothing || []);
        setBestSellers(homepageResponse.data.best_sellers || []);
        setInstagramReels(homepageResponse.data.instagram_reels || []);
        setNavbarContent(homepageResponse.data.navbar_content || null);
        setCollectionsAndCategories(homepageResponse.data.collections_and_categories || null);
      } else {
        setError(homepageResponse.message || "Failed to fetch homepage content");
      }

      if (navbarBannersResponse.success && navbarBannersResponse.data) {
        setNavbarBanners(navbarBannersResponse.data);
      }

      if (perfumeBannersResponse.success && perfumeBannersResponse.data) {
        setPerfumeBanners(perfumeBannersResponse.data);
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
    bestSellers,
    instagramReels,
    navbarContent,
    collectionsAndCategories,
    navbarBanners,
    perfumeBanners,
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
