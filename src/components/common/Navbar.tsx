'use client'
import React, { useState, useEffect } from 'react'
import { Heart, ShoppingBag, Search, Store, Phone, LogIn, Crown, Menu, X, Package, MapPin, MessageSquareQuote, User } from 'lucide-react'
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const router = useRouter();
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            setIsScrolled(scrollTop > 500)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleMouseEnter = (item: string) => {
        setActiveDropdown(item)
    }

    const handleMouseLeave = () => {
        setActiveDropdown(null)
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
        setActiveDropdown(null)
    }

    const menuItems = [
        {
            name: 'ALL',
            sections: [
                {
                    title: 'Featured Collections',
                    subsections: ['New Arrivals', 'Best Sellers', 'Editor\'s Choice', 'Limited Edition', 'Trending Now']
                },
                {
                    title: 'Shop by Category',
                    subsections: ['Men\'s Fashion', 'Women\'s Fashion', 'Kids Fashion', 'Accessories', 'Footwear', 'Beauty & Personal Care']
                },
                {
                    title: 'Special Offers',
                    subsections: ['Sale Items', 'Bundle Deals', 'Clearance', 'Gift Cards', 'Student Discounts']
                },
                {
                    title: 'Brand Collections',
                    subsections: ['Premium Brands', 'Designer Labels', 'Exclusive Collaborations', 'Sustainable Fashion']
                }
            ]
        },
        {
            name: 'MENS',
            sections: [
                {
                    title: 'Clothing',
                    subsections: ['Shirts', 'T-Shirts & Polo', 'Trousers & Chinos', 'Jeans & Denim', 'Suits & Blazers', 'Jackets & Coats', 'Sweaters & Hoodies', 'Shorts & Casual Wear']
                },
                {
                    title: 'Footwear',
                    subsections: ['Dress Shoes', 'Casual Sneakers', 'Boots & Ankle Boots', 'Loafers & Slip-ons', 'Sports & Athletic', 'Sandals & Slides']
                },
                {
                    title: 'Accessories',
                    subsections: ['Watches', 'Belts & Wallets', 'Bags & Backpacks', 'Ties & Bow Ties', 'Sunglasses', 'Jewelry', 'Hats & Caps']
                },
                {
                    title: 'Special Collections',
                    subsections: ['Formal Wear', 'Casual Weekend', 'Office Essentials', 'Party & Events', 'Travel Essentials']
                }
            ]
        },
        {
            name: 'WOMENS',
            sections: [
                {
                    title: 'Clothing',
                    subsections: ['Tops & Blouses', 'Dresses & Jumpsuits', 'Bottoms & Skirts', 'Jeans & Denim', 'Jackets & Blazers', 'Coats & Outerwear', 'Sweaters & Cardigans', 'Activewear & Athleisure']
                },
                {
                    title: 'Ethnic Wear',
                    subsections: ['Sarees & Lehengas', 'Salwar Suits', 'Kurtis & Tunics', 'Indo-Western', 'Traditional Jewelry', 'Ethnic Footwear']
                },
                {
                    title: 'Footwear',
                    subsections: ['Heels & Pumps', 'Flats & Ballerinas', 'Boots & Booties', 'Sneakers & Casual', 'Sandals & Wedges', 'Ethnic Footwear']
                },
                {
                    title: 'Accessories & Beauty',
                    subsections: ['Handbags & Clutches', 'Jewelry & Watches', 'Scarves & Stoles', 'Sunglasses', 'Beauty & Makeup', 'Hair Accessories']
                }
            ]
        },
        {
            name: 'KIDS',
            sections: [
                {
                    title: 'Boys (2-16 Years)',
                    subsections: ['T-Shirts & Shirts', 'Jeans & Trousers', 'Shorts & Casual Wear', 'Ethnic Wear', 'Jackets & Hoodies', 'Sports & Activewear', 'School Uniforms']
                },
                {
                    title: 'Girls (2-16 Years)',
                    subsections: ['Dresses & Frocks', 'Tops & Tees', 'Bottoms & Leggings', 'Ethnic & Traditional', 'Jackets & Cardigans', 'Party Wear', 'School Uniforms']
                },
                {
                    title: 'Baby & Toddlers (0-2 Years)',
                    subsections: ['Bodysuits & Rompers', 'Sleep & Loungewear', 'Bibs & Feeding', 'Baby Shoes', 'Blankets & Accessories']
                },
                {
                    title: 'Kids Accessories',
                    subsections: ['Footwear & Sneakers', 'Bags & Backpacks', 'Hats & Caps', 'Socks & Underwear', 'Toys & Games', 'Birthday Gifts']
                }
            ]
        }
    ]

    return (
        <div className="w-full fixed top-0 z-50">
            {/* 1st Level - Black Promo Strip with Golden Text */}
            <div className={`bg-black text-yellow-400 py-2 overflow-hidden transition-all duration-300 ${isScrolled ? 'h-0 py-0 hidden' : 'h-auto py-2 opacity-100'}`}>
                <div className="animate-marquee whitespace-nowrap">
                    <span className="text-sm font-medium">
                        Get additional 15% discount on your first purchase. Use code: LPAPPORDER *T&C Apply
                    </span>
                </div>
            </div>

            {/* 2nd Level - Gray Top Bar with Icons - Desktop Only */}
            <div className="hidden md:block bg-[#252525] text-white py-2">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    {/* Left Side: Delivery Location */}
                    <div className="flex flex-col items-start">
                        <span className="text-xs leading-tight">Delivering to</span>
                        <a href="#" className="text-xs underline leading-tight hover:text-[#D4AF37] transition-colors">Add delivery location</a>
                    </div>
                    {/* Right Side: Desktop View Icons */}
                    <div className="flex items-center space-x-5">
                        <button className="flex items-center space-x-2 text-sm hover:text-[#D4AF37] cursor-pointer transition-colors">
                            <MapPin size={18} />
                            <span>STORES</span>
                        </button>
                        <div className="w-px h-4 bg-gray-600"></div>
                        <button className="flex items-center space-x-2 text-sm hover:text-[#D4AF37] cursor-pointer transition-colors" onClick={() => router.push('/contact')}>
                            <MessageSquareQuote size={18} />
                            <span>CONTACT US</span>
                        </button>
                        <div className="w-px h-4 bg-gray-600"></div>
                        <button className="flex items-center space-x-2 text-sm hover:text-[#D4AF37] cursor-pointer transition-colors">
                            <User size={18} />
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
                        {/* Mobile Burger Menu */}
                        <button
                            className="md:hidden text-black hover:text-gray-600 transition-colors"
                            onClick={toggleMobileMenu}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Logo */}
                        <div className="flex items-center space-x-3 cursor-pointer"
                            onClick={() => router.push('/')}
                        >
                            <img
                                src="/logo.png"
                                alt="Venoire Logo"
                                className="h-10 w-auto"
                            />
                        </div>

                        {/* Desktop Menu Items */}
                        <div className="hidden md:flex items-center h-full">
                            {menuItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative h-full flex items-center"
                                    onMouseEnter={() => handleMouseEnter(item.name)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <button className={`text-black transition-all duration-300 h-full px-6 font-normal border-b-3 flex items-center ${activeDropdown === item.name
                                        ? 'border-black bg-gray-50 text-black'
                                        : 'border-transparent hover:border-black hover:bg-gray-50 hover:text-black'
                                        }`}>
                                        {item.name}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Search Input - Desktop */}
                        <div className="hidden md:block relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="border border-gray-300 rounded-md px-4 py-2 w-78 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <Search size={16} />
                            </button>
                        </div>

                        {/* Mobile Icons */}
                        <div className="flex md:hidden items-center space-x-4">
                            <button className="text-black hover:text-gray-600 transition-colors">
                                <Search size={20} />
                            </button>
                            <button className="text-black hover:text-gray-600 transition-colors">
                                <Heart size={20} />
                            </button>
                            <button className="text-black hover:text-gray-600 transition-colors">
                                <ShoppingBag size={20} />
                            </button>
                        </div>

                        {/* Desktop Explore Luxury Button */}
                        <button className="hidden md:flex bg-black text-[#D4AF37] px-4 py-2 rounded-md border border-[#D4AF37] hover:bg-[#111] hover:scale-105 transition-all shadow-lg items-center space-x-2 font-lato-light cursor-pointer">
                            <Crown className="text-[#D4AF37]" />
                            <span className="tracking-wider">Explore Luxury</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4th Level - Dropdown Menu - Desktop Only */}
            {activeDropdown && (
                <div
                    className="hidden md:block w-full bg-white border-b border-gray-200 shadow-lg"
                    onMouseEnter={() => setActiveDropdown(activeDropdown)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="grid grid-cols-4 gap-8">
                            {menuItems
                                .find(item => item.name === activeDropdown)
                                ?.sections.map((section) => (
                                    <div key={section.title} className="space-y-4">
                                        <h3 className="text-black font-semibold text-sm uppercase tracking-wider border-b border-gray-200 pb-2">
                                            {section.title}
                                        </h3>
                                        <div className="space-y-2">
                                            {section.subsections.map((subsection) => (
                                                <button
                                                    key={subsection}
                                                    className="block text-gray-600 hover:text-black transition-colors text-left text-sm leading-relaxed hover:font-medium"
                                                >
                                                    {subsection}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Side Menu */}
            <div className={`fixed w-full inset-0 z-50 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50"
                    onClick={closeMobileMenu}
                ></div>

                {/* Side Menu */}
                <div className={`absolute left-0 top-0 h-full w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                    <div className="h-full overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <img
                                src="/logo.png"
                                alt="Venoire Logo"
                                className="h-8 w-auto"
                            />
                            <button
                                onClick={closeMobileMenu}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Menu Content */}
                        <div className="p-4 space-y-6">
                            {/* Login Button */}
                            <button className="w-full bg-black text-white py-3 px-4 rounded-sm flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors">
                                <LogIn size={18} />
                                <span>LOG IN</span>
                            </button>

                            {/* Explore Luxury Button */}
                            <button className="w-full bg-black text-[#D4AF37] py-3 px-4 rounded-md border border-[#D4AF37] hover:bg-[#111] transition-colors flex items-center justify-center space-x-2">
                                <Crown className="text-[#D4AF37]" />
                                <span className="tracking-wider">Explore Luxury</span>
                            </button>

                            {/* Horizontal Line */}
                            <div className="w-full h-px bg-gray-300"></div>

                            {/* Mobile Menu Items */}
                            <div className="space-y-4">
                                {menuItems.map((item) => (
                                    <div key={item.name} className="space-y-2">
                                        <button
                                            className="w-full text-left text-lg font-medium text-black hover:text-gray-600 transition-colors"
                                            onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                                        >
                                            {item.name}
                                        </button>
                                        {activeDropdown === item.name && (
                                            <div className="pl-4 space-y-3">
                                                {item.sections.map((section) => (
                                                    <div key={section.title} className="space-y-2">
                                                        <h4 className="text-sm font-semibold text-black uppercase tracking-wide">
                                                            {section.title}
                                                        </h4>
                                                        <div className="pl-2 space-y-1">
                                                            {section.subsections.map((subsection) => (
                                                                <button
                                                                    key={subsection}
                                                                    className="block w-full text-left text-xs text-gray-600 hover:text-black transition-colors py-1"
                                                                >
                                                                    {subsection}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Additional Mobile Options */}
                            <div className="pt-4 border-t border-gray-200 space-y-4">
                                <button className="w-full flex items-center space-x-3 text-black hover:text-gray-600 transition-colors py-2" onClick={() => router.push('/contact')}>
                                    <Phone size={18} />
                                    <span>Contact Us</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 text-black hover:text-gray-600 transition-colors py-2">
                                    <Store size={18} />
                                    <span>Stores</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 text-black hover:text-gray-600 transition-colors py-2">
                                    <Heart size={18} />
                                    <span>Wishlist</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 text-black hover:text-gray-600 transition-colors py-2">
                                    <ShoppingBag size={18} />
                                    <span>Cart</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 text-black hover:text-gray-600 transition-colors py-2">
                                    <Package size={18} />
                                    <span>Track Your Order</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
