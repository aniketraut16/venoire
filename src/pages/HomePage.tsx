'use client'
import Hero from "@/components/HomePage/Hero";
import Categories from "@/components/HomePage/Categories";
import { Offers } from "@/components/HomePage/Offers";
import Explore from "@/components/HomePage/Explore";
import CategorizedProducts from "@/components/HomePage/CategorizedProducts";

export default function HomePage() {
    return (
        <div className="mt-45">
            <Hero />
            <Categories />
            <Offers />
            <Explore />
            <CategorizedProducts
                title="Venoire's Most Loved"
                description="Discover the favorites our customers can't get enough of. These best sellers are handpicked for their timeless style, premium quality, and exceptional value. Elevate your wardrobe with pieces that define effortless luxury and everyday sophistication."
                catalog="Best Seller"
            />
            <CategorizedProducts
                title="Fresh Finds: New Arrivals"
                description="Be the first to explore our latest additions. From modern silhouettes to classic essentials, our new arrivals are designed to keep you ahead of the trends. Refresh your look with exclusive pieces crafted for the season."
                catalog="New Arrival"
            />
            <CategorizedProducts
                title="On Trend Now"
                description="Step into the spotlight with our trending collection. These sought-after styles are making waves for a reason—bold, refined, and ready to make a statement. Shop what’s hot and set your own trend."
                catalog="Trending"
            />
        </div>
    )
}
