'use client'
import React, { useState } from 'react'
import { Heart, ShoppingBag, Search, Store, Phone, LogIn, Crown } from 'lucide-react'

export default function Navbar() {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

    const handleMouseEnter = (item: string) => {
        setActiveDropdown(item)
    }

    const handleMouseLeave = () => {
        setActiveDropdown(null)
    }

    const menuItems = [
        {
            name: 'ALL',
            categories: ['Featured', 'New Arrivals', 'Best Sellers', 'Sale Items', 'Accessories', 'Gift Cards']
        },
        {
            name: 'MENS',
            categories: ['Shirts', 'T-Shirts', 'Trousers', 'Jeans', 'Suits', 'Blazers', 'Accessories', 'Footwear']
        },
        {
            name: 'WOMENS',
            categories: ['Tops', 'Dresses', 'Bottoms', 'Ethnic Wear', 'Western Wear', 'Accessories', 'Footwear']
        },
        {
            name: 'KIDS',
            categories: ['Boys', 'Girls', 'Infants', 'Casual Wear', 'Formal Wear', 'Accessories', 'Footwear']
        }
    ]

    return (
        <div className="w-full fixed top-0 z-50">
            {/* 1st Level - Black Promo Strip with Golden Text */}
            <div className="bg-black text-yellow-400 py-2 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                    <span className="text-sm font-medium">
                        Get additional 15% discount on your first purchase. Use code: LPAPPORDER *T&C Apply
                    </span>
                </div>
            </div>

            {/* 2nd Level - Gray Top Bar with Icons */}
            <div className="bg-[#252525] text-white py-2">
                <div className="max-w-7xl mx-auto px-4 flex justify-end items-center">
                    <div className="flex items-center space-x-7">
                        <button className="flex items-center space-x-2 text-sm hover:text-[#D4AF37] cursor-pointer transition-colors">
                            <Store size={18} />
                            <span>STORES</span>
                        </button>
                        <div className="w-px h-4 bg-gray-600"></div>
                        <button className="flex items-center space-x-2 text-sm hover:text-[#D4AF37] cursor-pointer transition-colors">
                            <Phone size={18} />
                            <span>CONTACT US</span>
                        </button>
                        <div className="w-px h-4 bg-gray-600"></div>
                        <button className="flex items-center space-x-2 text-sm hover:text-[#D4AF37] cursor-pointer transition-colors">
                            <LogIn size={18} />
                            <span>LOG IN</span>
                        </button>
                        <div className="w-px h-4 bg-gray-600"></div>
                        <button className="text-sm hover:text-[#D4AF37] cursor-pointer transition-colors">
                            <Heart size={18} />
                        </button>
                        <div className="w-px h-4 bg-gray-600"></div>
                        <button className="text-sm hover:text-[#D4AF37] cursor-pointer transition-colors">
                            <ShoppingBag size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 3rd Level - Main Navbar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo + Name Group */}
                        <div className="flex items-center space-x-3">
                            <img
                                src="/logo.png"
                                alt="Venoire Logo"
                                className="h-10 w-auto"
                            />
                        </div>

                        {menuItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative h-full flex items-center"
                                onMouseEnter={() => handleMouseEnter(item.name)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className={`text-black transition-all duration-300 h-full px-4 font-thin border-b-3 flex items-center ${activeDropdown === item.name
                                    ? 'border-black bg-gray-50 text-black'
                                    : 'border-transparent hover:border-black hover:bg-gray-50 hover:text-black'
                                    }`}>
                                    {item.name}
                                </button>
                            </div>
                        ))}

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="border border-gray-300 rounded-md px-4 py-2 w-78 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <Search size={16} />
                            </button>
                        </div>

                        <button className="bg-black text-[#D4AF37] px-4 py-2 rounded-md border border-[#D4AF37] hover:bg-[#111] hover:scale-105 transition-all shadow-lg flex items-center space-x-2 font-lato-light cursor-pointer">
                            <Crown className="text-[#D4AF37]" />
                            <span className="tracking-wider">Explore Luxury</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4th Level - Dropdown Menu */}
            {activeDropdown && (
                <div
                    className="w-full bg-white border-b border-gray-200 shadow-lg"
                    onMouseEnter={() => setActiveDropdown(activeDropdown)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="grid grid-cols-6 gap-8">
                            {menuItems
                                .find(item => item.name === activeDropdown)
                                ?.categories.map((category) => (
                                    <div key={category} className="space-y-2">
                                        <button className="text-black font-medium hover:text-gray-600 transition-colors text-left">
                                            {category}
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Custom CSS for Marquee Animation */}
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    )
}
