import { Perfume } from "./perfume";
import { Product } from "./product";

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

export interface HeroCarouselItem {
  image_url: string;
  link_url: string;
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

export  type BestSellers = Perfume | Product;

export interface HomepageData {
  hero_carousel: HeroCarouselItem[];
  featured_perfumes: Perfume[];
  featured_clothing: Product[];
  best_sellers: BestSellers[];
  instagram_reels: InstagramReel[];
  navbar_content: NavbarContentData;
  collections_and_categories: CollectionsAndCategories;
}

export interface HomepageContentResponse {
  success: boolean;
  data?: HomepageData;
  message?: string;
  error?: string;
}