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
        <div>
            <Hero />
            <Categories />
            <Divider />
            <Offers />
            <FewProducts />
            <Explore />
            <SignInRequest />
            <Divider />
        </div>
    )
}
