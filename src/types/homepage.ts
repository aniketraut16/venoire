// Base types for navigation items
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
  
  // API Response types
  export interface NavbarContentMeta {
    totalCategories: number;
    totalCollections: number;
    totalTags: number;
  }
  
  export interface NavbarContentData {
    menuItems: MenuItem[];
    meta: NavbarContentMeta;
  }
  
  export interface NavbarContentResponse {
    success: boolean;
    data?: NavbarContentData;
    message?: string;
    error?: string;
  }


  export interface CategoryorCollection {
    name: string;
    slug: string;
    image: string;
  } 