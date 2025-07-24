import React from 'react'
import { Shield, Truck, RefreshCw, Instagram, X } from 'lucide-react'
import { FaFacebook, FaXTwitter, FaYoutube } from 'react-icons/fa6'

export default function Footer() {
    return (
        <footer className="bg-black text-white">
            {/* Newsletter and Trust Badges Section */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                        {/* Connect With Us */}
                        <div className="lg:w-1/3">
                            <h3 className="text-lg font-medium mb-4">CONNECT WITH US</h3>
                            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                                Be the first to know about new products, exclusive collections, latest trends,
                                stories and more.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 bg-transparent border border-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-gray-600"
                                />
                                <button className="bg-gray-700 text-white px-6 py-2 hover:bg-gray-600 transition-colors">
                                    SUBSCRIBE
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="lg:w-2/3 flex flex-col md:flex-row justify-end gap-8 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="font-medium">Quality Material</h4>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                    <Truck className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="font-medium">Fast Delivery</h4>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                    <RefreshCw className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="font-medium">Easy Return</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Mens */}
                    <div>
                        <h3 className="font-medium mb-6">MENS</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors">T-Shirts</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shirts</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Jeans</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shoes</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Watches</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
                        </ul>
                    </div>

                    {/* Womens */}
                    <div>
                        <h3 className="font-medium mb-6">WOMENS</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors">Dresses</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tops</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Handbags</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shoes</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Jewellery</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Beauty</a></li>
                        </ul>
                    </div>

                    {/* Kids */}
                    <div>
                        <h3 className="font-medium mb-6">KIDS</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors">Boys Clothing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Girls Clothing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Footwear</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Toys</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
                        </ul>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="font-medium mb-6">USEFUL LINKS</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>

                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="font-medium mb-6">FOLLOW US</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <span className="sr-only">Facebook</span>
                                <FaFacebook className="w-4 h-4 text-white" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <span className="sr-only">YouTube</span>
                                <FaYoutube className="w-4 h-4 text-white" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <span className="sr-only">Twitter</span>
                                <FaXTwitter className="w-4 h-4 text-white" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="w-4 h-4 text-white" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
                        <div className="flex items-center gap-1">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <span>|</span>
                            <a href="#" className="hover:text-white transition-colors">Terms & Conditions of Use</a>
                            <span>|</span>
                            <a href="#" className="hover:text-white transition-colors">Return Policy</a>
                        </div>
                        <div>
                            © 2025 All Rights Reserved. Venoire
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
