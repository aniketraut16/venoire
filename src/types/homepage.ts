import { Product } from "./product";
import { Perfume } from "./perfume";

export interface NavSubsection {
    id?: string;
    name: string;
    slug: string | null;
    type: 'collection' | 'category' | 'tag' | 'offer';
    color?: string | null;
    icon?: string | null;
  }
  
  export interface NavSection {
    title: string;
    slug?: string;
    subsections: NavSubsection[];
  }
  
  export interface MenuItem {
    name: string;
    slug?: string;
    sections: NavSection[];
  }
  
  export interface NavbarContentMeta {
    totalCategories: number;
    totalCollections: number;
    totalTags: number;
  }
  
  export interface NavbarContentData {
    menuItems: MenuItem[];
    meta: NavbarContentMeta;
  }
  

  export interface CategoryorCollection {
    name: string;
    slug: string;
    image: string;
  } 

  export interface TopProductswithCategory {
    category_name: string;
    category_slug: string;
    category_id: string;
    products: Product[];
  }

  export interface HeroCarouselItem {
    image_url: string;
    link_url: string;
    sort_order: number;
  }

  export interface FeaturedCollection {
    collection_id: string;
    sort_order: number;
  }

  export interface FeaturedProduct {
    product_id: string;
    sort_order: number;
  }

  export interface InstagramReel {
    instagram_url: string;
    sort_order: number;
  }

  export interface CollectionsAndCategories {
    collections: CategoryorCollection[];
    categories: CategoryorCollection[];
  }

  export interface HomepageData {
    hero_carousel: HeroCarouselItem[];
    featured_collections: FeaturedCollection[];
    featured_perfumes: FeaturedProduct[];
    featured_clothing: FeaturedProduct[];
    instagram_reels: InstagramReel[];
    navbar_content: NavbarContentData;
    collections_and_categories: CollectionsAndCategories;
    top_products: TopProductswithCategory[];
    perfumes: Perfume[];
  }

  export interface HomepageMeta {
    hero_carousel_count: number;
    featured_collections_count: number;
    featured_perfumes_count: number;
    featured_clothing_count: number;
    instagram_reels_count: number;
    total_categories: number;
    total_products: number;
    total_perfumes: number;
  }

  export interface HomepageContentResponse {
    success: boolean;
    data?: HomepageData;
    meta?: HomepageMeta;
    message?: string;
    error?: string;
  }