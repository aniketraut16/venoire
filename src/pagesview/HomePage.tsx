"use client";
import Hero from "@/components/HomePage/Hero";
import Categories from "@/components/HomePage/Categories";
import  BrowseCollections  from "@/components/HomePage/BrowseCollections";
import Explore from "@/components/HomePage/Explore";
import FewProducts from "@/components/HomePage/FewProducts";
import Divider from "@/components/HomePage/divider";
import SignInRequest from "@/components/HomePage/SignInRequest";
import LittleAboutUs from "@/components/HomePage/LittleAboutUs";
import FewPerfumes from "@/components/HomePage/FewPerfumes";
import InstaReels from "@/components/HomePage/InstaReels";
import BestSellers from "@/components/HomePage/BestSellers";
import { useHomepage } from "@/contexts/HomepageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { collectionsAndCategories, isLoading } = useHomepage();
  const { user } = useAuth();

  const categories = collectionsAndCategories?.categories || [];
  const collections = collectionsAndCategories?.collections || [];

  return (
    <div>
      <Hero />
      <BestSellers />
      <Divider />
      <LittleAboutUs />
      <Divider />
      <Categories categories={categories} />
      <BrowseCollections collections={collections} />
      <FewPerfumes />
      <FewProducts />
      <Explore />
      {!user && <SignInRequest />}
      <InstaReels />
    </div>
  );
}
