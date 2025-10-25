'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import SearchPopup from './SearchPopup'
import { useSmoothScroll } from '@/contexts/SmoothScrollContext'
import { getNavbarContent } from '@/utils/homepage'
import { MenuItem } from '@/types/homepage'

export default function Navbar() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [scrollPosition, setScrollPosition] = useState(0)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const pathname = usePathname()
    const { disableSmoothScroll, enableSmoothScroll } = useSmoothScroll()

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Handle body scroll and smooth scrolling for mobile menu
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
            disableSmoothScroll()
        } else {
            document.body.style.overflow = 'unset'
            enableSmoothScroll()
        }

        return () => {
            document.body.style.overflow = 'unset'
            enableSmoothScroll()
        }
    }, [isMobileMenuOpen, disableSmoothScroll, enableSmoothScroll])

    // Check if we're on home page or perfume pages
    const isHomePage = pathname === '/'
    const isPerfumePage = pathname?.startsWith('/perfume')
    const shouldUseScrollEffect = isHomePage || isPerfumePage 

    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000
    const startFade = viewportHeight * 0.7
    const endFade = viewportHeight
    
    const bgOpacity = shouldUseScrollEffect 
        ? (scrollPosition < startFade 
            ? 0 
            : scrollPosition >= endFade 
            ? 1 
            : (scrollPosition - startFade) / (endFade - startFade))
        : 1 // Always white on other pages
    
    const isTransparent = shouldUseScrollEffect && bgOpacity < 0.5
    const textColor = isTransparent ? 'text-white' : 'text-black'
    const borderColor = isTransparent ? 'border-white/20' : 'border-gray-200'

    const hrefGenerator = (type: string, slug: string) => {
        switch (type) {
            case 'collection':
                return `/d/${slug}`
            case 'category':
                return `/c/${slug}`
            case 'tag':
                return `/t/${slug}`
            case 'offer':
                return `/o/${slug}`
            default:
                return '#'
        }
    }

    useEffect(() => {
        const fetchNavbarContent = async () => {
            const response = await getNavbarContent()
            if (response.success) {
                setMenuItems(response.data?.menuItems || [])
            }
        }
        fetchNavbarContent()
    }, [])

    return (
        <>
            <nav 
                className={`fixed top-0 left-0 right-0 ${borderColor} z-50 transition-colors duration-300 ${bgOpacity > 0.5 ? 'shadow-lg' : ''}`}
                style={{ backgroundColor: `rgba(255, 255, 255, ${bgOpacity})` }}
            >
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 h-16 sm:h-18 md:h-20">
                    <div className="flex items-center justify-between h-full relative">
                        {/* Mobile Menu Button (Left Side) */}
                        <div className="flex items-center gap-3 md:hidden">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`${textColor} hover:opacity-70 transition-opacity p-1`}
                            >
                                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>

                        {/* LEFT SECTION - Desktop Only */}
                        <div className="hidden md:flex items-center gap-8 flex-1">
                            
                            {/* Menu Items */}
                            {menuItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative"
                                    {...(item.slug?.includes('perfume') ? {} : {
                                        onMouseEnter: () => setActiveMenu(item.name),
                                        onMouseLeave: () => setActiveMenu(null)
                                    })}
                                >
                                    {item.slug?.includes('perfume') ? (
                                        <Link 
                                            href="/perfume"
                                            className={`text-xs font-medium tracking-widest transition-colors py-5 uppercase ${textColor} ${isTransparent ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                                        >
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <button className={`text-xs font-medium tracking-widest transition-colors py-5 uppercase ${textColor} ${isTransparent ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>
                                            {item.name}
                                        </button>
                                    )}
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
                                    className="h-8 sm:h-9 md:h-10 w-auto object-contain"
                                    style={isTransparent ? { filter: 'brightness(0) invert(1)' } : {}}
                                />
                            </Link>
                        </div>

                        {/* RIGHT SECTION - Desktop Only */}
                        <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-end">
                            {/* Explore Links */}
                            <Link 
                                href="/collections" 
                                className={`text-xs font-medium tracking-widest transition-colors uppercase ${textColor} ${isTransparent ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                            >
                                NEW ARRIVALS
                            </Link>
                            <Link 
                                href="/luxury" 
                                className={`text-xl league-script-regular font-medium tracking-widest transition-colors  ${textColor} ${isTransparent ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                            >
                                Explore Luxury
                            </Link>
                            
                            {/* Icons */}
                            <div className="flex items-center gap-5 ml-2">
                                <button 
                                    onClick={() => setIsSearchOpen(true)}
                                    className={`${textColor} transition-opacity hover:opacity-70`}
                                >
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
                        <div className="flex items-center gap-3 sm:gap-4 md:hidden">
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className={`${textColor} transition-opacity hover:opacity-70 p-1`}
                            >
                                <Search size={20} strokeWidth={1.5} />
                            </button>
                            <Link href="/auth" className={`${textColor} transition-opacity hover:opacity-70 p-1`}>
                                <User size={20} strokeWidth={1.5} />
                            </Link>
                            <Link href="/cart" className={`${textColor} transition-opacity hover:opacity-70 relative p-1`}>
                                <ShoppingBag size={20} strokeWidth={1.5} />
                                <span className={`absolute -top-1 -right-1 text-[9px] font-medium ${textColor}`}>(0)</span>
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
                                            <h3 className="text-sm font-semibold mb-4 tracking-wide text-black uppercase border-b border-gray-200 pb-2">
                                        
                                                {section.title}
                                            </h3>
                                            <ul className="space-y-2">
                                                {section.subsections.map((subsection, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link 
                                                            href={hrefGenerator(subsection.type, subsection.slug || '')} 
                                                            className="text-sm text-gray-600 hover:text-black transition-colors"
                                                        >
                                                            {subsection.name}
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
                className={`fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out z-[9999] md:hidden overflow-y-auto overscroll-contain ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {/* Header Section */}
                <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-gray-200">
                    <Image 
                        src="/logo.png" 
                        alt="Venoire" 
                        width={140} 
                        height={40}
                        className="h-8 w-auto object-contain"
                    />
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-black hover:opacity-70 transition-opacity p-2"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="min-h-full">
                    {/* User Section */}
                    <div className="p-4 border-b border-gray-200">
                        {/* For now, showing welcome section - can be made dynamic later */}
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-black mb-1">WELCOME</h2>
                            <p className="text-sm text-gray-600 mb-4">Enjoy a tailored shopping experience.</p>
                            <Link
                                href="/auth"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full bg-black text-white py-3 px-4 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors text-center"
                            >
                                LOG IN / SIGN UP
                            </Link>
                        </div>
                    </div>

                    {/* Explore Luxury Button */}
                    <div className="p-4">
                        <Link
                            href="/luxury"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="relative block w-full text-white py-5 px-8 text-center font-bold tracking-wider uppercase shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 rounded-lg overflow-hidden group"
                            style={{
                                background: 'linear-gradient(135deg, #8B4513 0%, #B8860B 25%, #DAA520 50%, #FFD700 75%, #FFF8DC 100%)',
                                boxShadow: '0 8px 32px rgba(218, 165, 32, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            {/* Shine effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            
                            {/* Crown icon and text */}
                            <div className="relative flex items-center justify-center gap-3">
                                <svg 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor" 
                                    className="drop-shadow-lg"
                                >
                                    <path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5zm2.7-2h8.6l.9-4.4L14 12l-2-4-2 4-3.2-2.4L7.7 14z"/>
                                </svg>
                                <span className="text-lg font-black tracking-[0.2em] drop-shadow-lg">
                                    Explore Luxury
                                </span>
                            </div>
                            
                            {/* Border glow effect */}
                            <div className="absolute inset-0 rounded-lg border-2 border-yellow-300/30 group-hover:border-yellow-200/50 transition-colors duration-300"></div>
                        </Link>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* Menu Accordion */}
                    <div className="p-4 space-y-2">
                        {menuItems.map((item) => (
                            <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                                <button
                                    onClick={() => setExpandedMobileMenu(expandedMobileMenu === item.name ? null : item.name)}
                                    className="flex items-center justify-between w-full text-left py-4 text-black hover:text-gray-600 transition-colors"
                                >
                                    <span className="font-medium text-sm tracking-wider uppercase">{item.name}</span>
                                    <svg 
                                        className={`w-5 h-5 transition-transform duration-200 ${expandedMobileMenu === item.name ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {expandedMobileMenu === item.name && (
                                    <div className="pb-4 pl-4 space-y-3">
                                        {item.sections.map((section, idx) => (
                                            <div key={idx}>
                                                <h4 className="text-xs font-semibold mb-2 text-gray-900 tracking-wide uppercase">
                                                    {section.title}
                                                </h4>
                                                <ul className="space-y-2 pl-2">
                                                    {section.subsections.map((subsection, subIdx) => (
                                                        <li key={subIdx}>
                                                            <Link
                                                                href={hrefGenerator(subsection.type, subsection.slug || '')}
                                                                className="text-sm text-gray-600 hover:text-black transition-colors block py-1"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {subsection.name}
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

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* Bottom Actions */}
                    <div className="p-4 space-y-1">
                        <Link
                            href="/cart"
                            className="flex items-center gap-4 py-3 text-black hover:text-gray-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            <span className="font-medium text-sm tracking-wide">MY CART</span>
                        </Link>
                        
                        <button 
                            onClick={() => {
                                setIsSearchOpen(true)
                                setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center gap-4 py-3 text-black hover:text-gray-600 transition-colors w-full text-left"
                        >
                            <Search size={20} strokeWidth={1.5} />
                            <span className="font-medium text-sm tracking-wide">SEARCH</span>
                        </button>
                        
                        <Link
                            href="/collections"
                            className="flex items-center gap-4 py-3 text-black hover:text-gray-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span className="font-medium text-sm tracking-wide">NEW ARRIVALS</span>
                        </Link>

                        <Link
                            href="/contact"
                            className="flex items-center gap-4 py-3 text-black hover:text-gray-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            <span className="font-medium text-sm tracking-wide">CONTACT US</span>
                        </Link>

                        <Link
                            href="/wishlist"
                            className="flex items-center gap-4 py-3 text-black hover:text-gray-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            <span className="font-medium text-sm tracking-wide">WISHLIST</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay - Not needed since sidebar is full screen */}

            {/* Search Popup */}
            <SearchPopup 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
            />
        </>
    )
}
