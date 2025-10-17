'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [scrollPosition, setScrollPosition] = useState(0)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Calculate opacity based on scroll position
    // 0-70vh: transparent (opacity 0)
    // 70vh-100vh: gradually white (opacity 0 to 1)
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000
    const startFade = viewportHeight * 0.7
    const endFade = viewportHeight
    
    const bgOpacity = scrollPosition < startFade 
        ? 0 
        : scrollPosition >= endFade 
        ? 1 
        : (scrollPosition - startFade) / (endFade - startFade)
    
    const isTransparent = bgOpacity < 0.5
    const textColor = isTransparent ? 'text-white' : 'text-black'
    const borderColor = isTransparent ? 'border-white/20' : 'border-gray-200'

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
                    title: 'Formal Shirts',
                    subsections: ['Dress Shirts', 'Oxford Shirts', 'Button-Down Shirts', 'Tuxedo Shirts', 'French Cuff Shirts', 'Slim Fit Formal']
                },
                {
                    title: 'Casual Shirts',
                    subsections: ['Linen Shirts', 'Denim Shirts', 'Flannel Shirts', 'Chambray Shirts', 'Short Sleeve Shirts', 'Camp Collar Shirts']
                },
                {
                    title: 'Pattern & Print Shirts',
                    subsections: ['Striped Shirts', 'Checkered Shirts', 'Floral Shirts', 'Printed Shirts', 'Geometric Patterns', 'Solid Colors']
                },
                {
                    title: 'Special Occasion Shirts',
                    subsections: ['Party Shirts', 'Wedding Shirts', 'Nehru Collar Shirts', 'Band Collar Shirts', 'Cuban Collar Shirts', 'Designer Shirts']
                }
            ]
        },
        {
            name: 'WOMENS',
            sections: [
                {
                    title: 'Coming Soon',
                    subsections: []
                }
            ]
        },
        {
            name: 'PERFUMES',
            sections: [
                {
                    title: 'Fragrance Collections',
                    subsections: ['New Arrivals', 'Best Sellers', 'Luxury Perfumes', 'Designer Fragrances', 'Niche Perfumes']
                },
                {
                    title: 'Shop by Gender',
                    subsections: ['Men\'s Perfumes', 'Women\'s Perfumes', 'Unisex Fragrances']
                },
                {
                    title: 'Shop by Type',
                    subsections: ['Eau de Parfum', 'Eau de Toilette', 'Perfume Oils', 'Body Mists', 'Gift Sets']
                },
                {
                    title: 'Fragrance Families',
                    subsections: ['Floral', 'Woody', 'Oriental', 'Fresh', 'Citrus', 'Spicy']
                }
            ]
        }
    ]

    return (
        <>
            <nav 
                className={`fixed top-0 left-0 right-0  ${borderColor} z-50 transition-colors duration-300`}
                style={{ backgroundColor: `rgba(255, 255, 255, ${bgOpacity})` }}
            >
                <div className="max-w-[1920px] mx-auto px-16 h-20">
                    <div className="flex items-center justify-between h-full relative">
                        {/* Mobile Menu Button (Left Side) */}
                        <div className="flex items-center gap-4 md:hidden">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`${textColor} hover:opacity-70 transition-opacity`}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>

                        {/* LEFT SECTION - Desktop Only */}
                        <div className="hidden md:flex items-center gap-8 flex-1">
                            
                            {/* Menu Items */}
                            {menuItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => setActiveMenu(item.name)}
                                    onMouseLeave={() => setActiveMenu(null)}
                                >
                                    <button className={`text-xs font-medium tracking-widest transition-colors py-5 uppercase ${textColor} ${isTransparent ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>
                                        {item.name}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* LOGO SECTION - Centered on Desktop, Centered on Mobile */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                            <Link href="/" className="flex items-center">
                                <Image 
                                    src="/logo.png" 
                                    alt="Venoire" 
                                    width={180} 
                                    height={50}
                                    className="h-10 w-auto object-contain"
                                    style={isTransparent ? { filter: 'brightness(0) invert(1)' } : {}}
                                />
                            </Link>
                        </div>

                        {/* RIGHT SECTION - Desktop Only */}
                        <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
                            {/* Explore Links */}
                            <Link 
                                href="/collections" 
                                className={`text-xs font-medium tracking-widest transition-colors uppercase ${textColor} ${isTransparent ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                            >
                                NEW ARRIVALS
                            </Link>
                            <Link 
                                href="/luxury" 
                                className={`text-xs font-medium tracking-widest transition-colors uppercase ${textColor} ${isTransparent ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                            >
                                EXPLORE LUXURY
                            </Link>
                            
                            {/* Icons */}
                            <div className="flex items-center gap-5 ml-2">
                                <button className={`${textColor} transition-opacity hover:opacity-70`}>
                                    <Search size={19} strokeWidth={1.5} />
                                </button>
                                <Link href="/wishlist" className={`${textColor} transition-opacity hover:opacity-70`}>
                                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </Link>
                                <Link href="/auth" className={`${textColor} transition-opacity hover:opacity-70`}>
                                    <User size={19} strokeWidth={1.5} />
                                </Link>
                                <Link href="/cart" className={`${textColor} transition-opacity hover:opacity-70 relative`}>
                                    <ShoppingBag size={19} strokeWidth={1.5} />
                                    <span className={`absolute -top-1 -right-2 text-[10px] font-medium ${textColor}`}>(0)</span>
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Icons (Right Side) */}
                        <div className="flex items-center gap-4 md:hidden">
                            <Link href="/auth" className={`${textColor} transition-opacity hover:opacity-70`}>
                                <User size={20} strokeWidth={1.5} />
                            </Link>
                            <Link href="/cart" className={`${textColor} transition-opacity hover:opacity-70`}>
                                <ShoppingBag size={20} strokeWidth={1.5} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Dropdown Submenu - Desktop Only */}
                {activeMenu && (
                    <div 
                        className="hidden md:block absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
                        onMouseEnter={() => setActiveMenu(activeMenu)}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <div className="max-w-[1920px] mx-auto px-8 py-12">
                            <div className="grid grid-cols-4 gap-12">
                                {menuItems
                                    .find(item => item.name === activeMenu)
                                    ?.sections.map((section, index) => (
                                        <div key={index}>
                                            <h3 className="text-sm font-semibold mb-4 tracking-wide text-black">
                                                {section.title}
                                            </h3>
                                            <ul className="space-y-2">
                                                {section.subsections.map((subsection, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link 
                                                            href="#" 
                                                            className="text-sm text-gray-600 hover:text-black transition-colors"
                                                        >
                                                            {subsection}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Sidebar Menu */}
            <div
                className={`fixed top-20 left-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 md:hidden overflow-y-auto ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6">
                    {/* Mobile Contact Link */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <Link
                            href="/contact"
                            className="block text-sm font-semibold tracking-wide hover:text-gray-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            CONTACT
                        </Link>
                    </div>

                    {/* Mobile Menu Items */}
                    <div className="space-y-4">
                        {menuItems.map((item) => (
                            <div key={item.name} className="border-b border-gray-200 pb-4">
                                <button
                                    onClick={() => setExpandedMobileMenu(expandedMobileMenu === item.name ? null : item.name)}
                                    className="flex items-center justify-between w-full text-left font-semibold text-base tracking-wide mb-2"
                                >
                                    {item.name}
                                    <span className="text-xl">{expandedMobileMenu === item.name ? '−' : '+'}</span>
                                </button>
                                
                                {expandedMobileMenu === item.name && (
                                    <div className="mt-4 space-y-4 pl-2">
                                        {item.sections.map((section, idx) => (
                                            <div key={idx}>
                                                <h4 className="text-sm font-semibold mb-2 text-gray-900">
                                                    {section.title}
                                                </h4>
                                                <ul className="space-y-1.5 pl-2">
                                                    {section.subsections.map((subsection, subIdx) => (
                                                        <li key={subIdx}>
                                                            <Link
                                                                href="#"
                                                                className="text-sm text-gray-600 hover:text-black"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {subsection}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Explore Links */}
                    <div className="mt-8 space-y-4 border-t border-gray-200 pt-6">
                        <Link
                            href="/collections"
                            className="block text-sm font-semibold tracking-wide hover:text-gray-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            THE MAISON
                        </Link>
                        <Link
                            href="/luxury"
                            className="block text-sm font-semibold tracking-wide hover:text-gray-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            JOIN THE CIRCLE
                        </Link>
                    </div>

                    {/* Mobile Search & Wishlist */}
                    <div className="mt-8 border-t border-gray-200 pt-6 space-y-4">
                        <button className="flex items-center gap-3 text-sm font-medium hover:text-gray-600 w-full">
                            <Search size={20} strokeWidth={1.5} />
                            <span>Search</span>
                        </button>
                        <Link
                            href="/wishlist"
                            className="flex items-center gap-3 text-sm font-medium hover:text-gray-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>Wishlist</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    )
}
