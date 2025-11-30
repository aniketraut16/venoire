import React from 'react'
import { Shield, Truck, RefreshCw, Instagram, X } from 'lucide-react'
import { FaFacebook, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black text-white">
            {/* Newsletter and Trust Badges Section */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-8 lg:gap-12">
                        {/* Connect With Us */}
                        <div className="w-full lg:w-1/3">
                            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">CONNECT WITH US</h3>
                            <p className="text-gray-300 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                                Be the first to know about new products, exclusive collections, latest trends,
                                stories and more.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full sm:flex-1 bg-transparent border border-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gray-600 rounded-sm"
                                />
                                <button className="w-full sm:w-auto bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium hover:bg-gray-600 transition-colors whitespace-nowrap rounded-sm">
                                    SUBSCRIBE
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="w-full lg:w-2/3 grid grid-cols-3 sm:flex sm:flex-row sm:justify-end gap-4 sm:gap-6 lg:gap-8">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                                    <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                                </div>
                                <h4 className="font-medium text-xs sm:text-sm text-center">Quality Material</h4>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                                    <Truck className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                                </div>
                                <h4 className="font-medium text-xs sm:text-sm text-center">Fast Delivery</h4>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                                    <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                                </div>
                                <h4 className="font-medium text-xs sm:text-sm text-center">Easy Return</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
                    {/* Mens */}
                    <div>
                        <h3 className="font-medium mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base">MENS</h3>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors block">T-Shirts</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Shirts</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Jeans</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Shoes</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Watches</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Accessories</a></li>
                        </ul>
                    </div>

                    {/* Womens */}
                    <div>
                        <h3 className="font-medium mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base">WOMENS</h3>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors block">Dresses</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Tops</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Handbags</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Shoes</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Jewellery</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Beauty</a></li>
                        </ul>
                    </div>

                    {/* Kids */}
                    <div>
                        <h3 className="font-medium mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base">KIDS</h3>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors block">Boys Clothing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Girls Clothing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Footwear</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Toys</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Accessories</a></li>
                        </ul>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="font-medium mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base">USEFUL LINKS</h3>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
                            <li><Link href="/contact#message" className="hover:text-white transition-colors block">Contact Us</Link></li>
                            <li><Link href="/contact#faqs" className="hover:text-white transition-colors block">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors block">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                        <h3 className="font-medium mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base">FOLLOW US</h3>
                        <div className="flex space-x-3 sm:space-x-4">
                            <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="Facebook">
                                <span className="sr-only">Facebook</span>
                                <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </a>
                            <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="YouTube">
                                <span className="sr-only">YouTube</span>
                                <FaYoutube className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </a>
                            <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="Twitter">
                                <span className="sr-only">Twitter</span>
                                <FaXTwitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </a>
                            <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="Instagram">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                    <div className="flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-gray-400 gap-3 sm:gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-1 text-center sm:text-left">
                            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <span className="hidden sm:inline">|</span>
                            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
                            <span className="hidden sm:inline">|</span>
                            <Link href="/return-policy" className="hover:text-white transition-colors">Return Policy</Link>
                            <span className="hidden sm:inline">|</span>
                            <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
                            <span className="hidden sm:inline">|</span>
                            <Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link>
                            <span className="hidden sm:inline">|</span>
                            <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
                        </div>
                        <div className="text-center">
                            © 2025 All Rights Reserved. Venoire
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
