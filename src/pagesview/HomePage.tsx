'use client'
import Hero from "@/components/HomePage/Hero";
import Categories from "@/components/HomePage/Categories";
import { Offers } from "@/components/HomePage/Offers";
import Explore from "@/components/HomePage/Explore";
import CategorizedProducts from "@/components/HomePage/CategorizedProducts";
import FewProducts from "@/components/HomePage/FewProducts";
import Divider from "@/components/HomePage/divider";
import SignInRequest from "@/components/HomePage/SignInRequest";

export default function HomePage() {
    return (
        <div className="mt-12 md:mt-0">
            {/* Mobile: Categories first, Desktop: Hero first */}
            <div className="md:hidden">
                <Categories />
            </div>
            <div className="hidden md:block">
                <Hero />
            </div>
            
            {/* Mobile: Hero second, Desktop: Categories second */}
            <div className="md:hidden">
                <Hero />
            </div>
            <div className="hidden md:block">
                <Categories />
            </div>
            
            <Divider />
            <Offers />
            <FewProducts />
            <Explore />
            <SignInRequest />
            <Divider />
        </div>
    )
}
