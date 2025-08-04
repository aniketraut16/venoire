'use client'
import { HelpCircle, MailIcon, MessageCircle, Package } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border border-gray-200 mb-3">
            <button
                className="w-full text-left p-5 font-medium flex justify-between items-center bg-white text-black hover:bg-gray-100 transition-colors duration-200"
                onClick={toggleAccordion}
            >
                <span className="text-sm tracking-wide uppercase">{title}</span>
                <span className="text-lg font-light w-6 h-6 flex items-center justify-center border border-white/20">
                    {isOpen ? '−' : '+'}
                </span>
            </button>
            {isOpen && (
                <div className="p-5 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{children}</p>
                </div>
            )}
        </div>
    );
};

export default function ContactPage() {
    const [activeTab, setActiveTab] = useState('message');

    useEffect(() => {
        // Get the hash from URL on initial load
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const validTabs = ['message', 'faqs', 'order-related-queries', 'other-queries'];
            if (validTabs.includes(hash)) {
                setActiveTab(hash);
            }
        }

        // Set initial hash if none exists
        if (!window.location.hash) {
            window.history.replaceState(null, '', `#${activeTab}`);
        }
    }, []);

    const handleTabChange = (tabKey: string) => {
        setActiveTab(tabKey);
        window.history.replaceState(null, '', `#${tabKey}`);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'message':
                return (
                    <div className="bg-white border border-gray-200 p-8">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-light tracking-wide mb-8 uppercase">Get In Touch</h2>


                            <div className="grid md:grid-cols-2 gap-8 mb-12 space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium tracking-wider uppercase text-gray-900 mb-3">Store Location</h3>
                                    <div className="bg-gray-50 p-4 border-l-2 border-black">
                                        <p className="text-gray-700 leading-relaxed">123 Main Street<br />Anytown, USA 12345</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium tracking-wider uppercase text-gray-900 mb-3">Contact Information</h3>
                                    <div className="bg-gray-50 p-4 border-l-2 border-black space-y-2">
                                        <p className="text-gray-700">
                                            <span className="font-medium">Email:</span> info@venoire.com
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-medium">Phone:</span> +1 (123) 456-7890
                                        </p>
                                    </div>
                                </div>
                            </div>



                            <div>
                                <h3 className="text-sm font-medium tracking-wider uppercase text-gray-900 mb-6">Send Message</h3>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200"
                                            placeholder="What is this regarding?"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200 resize-none"
                                            placeholder="Write your message here..."
                                        ></textarea>
                                    </div>

                                    <button
                                        onClick={() => alert('Message would be sent!')}
                                        className="bg-black text-white px-8 py-4 hover:bg-gray-900 transition-colors duration-200 text-sm font-medium tracking-wider uppercase w-full md:w-auto"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'faqs':
                return (
                    <div className="bg-white border border-gray-200 p-8">
                        <h2 className="text-2xl font-light tracking-wide mb-8 uppercase">Frequently Asked Questions</h2>
                        <div className="max-w-3xl">
                            <Accordion title="How long does shipping take?">
                                Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available for 1-2 day delivery. International shipping times vary by location but generally take 7-14 business days.
                            </Accordion>
                            <Accordion title="What is your return policy?">
                                We offer a 30-day return policy for all items in original condition with tags attached. Items must be unworn and in resalable condition. Return shipping is free for exchanges, and we provide prepaid return labels for your convenience.
                            </Accordion>
                            <Accordion title="Do you offer international shipping?">
                                Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. All international orders may be subject to customs duties and taxes, which are the responsibility of the customer.
                            </Accordion>
                            <Accordion title="How do I track my order?">
                                Once your order ships, you'll receive a tracking number via email. You can track your package using this number on our website or the carrier's tracking page. Orders typically ship within 1-2 business days of purchase.
                            </Accordion>
                            <Accordion title="What payment methods do you accept?">
                                We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are processed securely through our encrypted payment system.
                            </Accordion>
                        </div>
                    </div>
                );

            case 'order-related-queries':
                return (
                    <div className="bg-white border border-gray-200 p-8">
                        <h2 className="text-2xl font-light tracking-wide mb-8 uppercase">Order Support</h2>
                        <div className="max-w-3xl">
                            <Accordion title="I need to cancel or modify my order">
                                Orders can be cancelled or modified within 2 hours of placement. After this time, orders enter our fulfillment process and cannot be changed. Please contact us immediately if you need to make changes to your order.
                            </Accordion>
                            <Accordion title="My order arrived damaged or incorrect">
                                We sincerely apologize for any issues with your order. Please contact us within 48 hours of delivery with photos of the damaged or incorrect items. We'll arrange for a replacement or full refund immediately.
                            </Accordion>
                            <Accordion title="I haven't received my order confirmation">
                                Order confirmations are sent immediately after purchase. Please check your spam/junk folder first. If you still can't find it, contact us with your email address and we'll resend your confirmation and tracking information.
                            </Accordion>
                            <Accordion title="Can I change my shipping address?">
                                Shipping addresses can only be changed within 2 hours of order placement, before the order enters fulfillment. Once shipped, packages cannot be redirected. Please contact us immediately if you need to update your address.
                            </Accordion>
                            <Accordion title="What if an item is out of stock after I ordered?">
                                If an item becomes unavailable after your order, we'll contact you within 24 hours to discuss options: wait for restock, substitute with a similar item, or receive a full refund for that item.
                            </Accordion>
                        </div>
                    </div>
                );

            case 'other-queries':
                return (
                    <div className="bg-white border border-gray-200 p-8">
                        <h2 className="text-2xl font-light tracking-wide mb-8 uppercase">General Inquiries</h2>
                        <div className="max-w-3xl">
                            <Accordion title="Do you have a physical store I can visit?">
                                Yes, we have a flagship store located at 123 Main Street, Anytown, USA. Our store hours are Monday-Friday 9AM-8PM, Saturday 10AM-6PM, and Sunday 12PM-5PM. You can browse our full collection and speak with our style consultants.
                            </Accordion>
                            <Accordion title="How do I sign up for your newsletter?">
                                You can subscribe to our newsletter at the bottom of any page on our website. Subscribers receive exclusive offers, early access to sales, and updates on new arrivals. We respect your privacy and won't share your information with third parties.
                            </Accordion>
                            <Accordion title="Do you offer gift cards?">
                                Yes, we offer digital gift cards in denominations of $25, $50, $100, $200, and $500. Gift cards are delivered via email and can be used online or in-store. They never expire and can be combined with promotional offers.
                            </Accordion>
                            <Accordion title="How can I become a brand ambassador?">
                                We're always looking for passionate individuals to represent our brand. Please email us at partnerships@venoire.com with your social media handles, a brief introduction, and why you'd like to work with us. We'll review all applications carefully.
                            </Accordion>
                            <Accordion title="Do you offer wholesale or bulk pricing?">
                                We offer wholesale opportunities for qualifying retailers and bulk pricing for corporate orders. Please contact our wholesale team at wholesale@venoire.com with details about your business and quantity requirements.
                            </Accordion>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-45 pb-15">
            <div className="max-w-7xl mx-auto">
                <div className="flex">
                    {/* Left Sidebar */}
                    <div className="w-80 bg-white border-r border-gray-200">
                        <div className="p-8 border-b border-gray-200">
                            <h1 className="text-3xl font-light tracking-wide uppercase">Contact Us</h1>
                            <p className="text-gray-600 mt-2 text-sm">We're here to help with any questions</p>
                        </div>

                        <nav className="p-4">
                            {[
                                { key: 'message', label: 'Message Us', icon: <MailIcon /> },
                                { key: 'faqs', label: 'FAQs', icon: <HelpCircle /> },
                                { key: 'order-related-queries', label: 'Order Support', icon: <Package /> },
                                { key: 'other-queries', label: 'General Inquiries', icon: <MessageCircle /> }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`w-full text-left p-4 mb-2 transition-all duration-200 border border-transparent ${activeTab === tab.key
                                        ? 'bg-black text-white border-black'
                                        : 'text-gray-700 hover:bg-gray-100 hover:border-gray-200'
                                        }`}
                                    onClick={() => handleTabChange(tab.key)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg">{tab.icon}</span>
                                        <span className="text-sm font-medium tracking-wide uppercase">{tab.label}</span>
                                    </div>
                                </button>
                            ))}
                        </nav>

                        <div className="p-8 mt-8 border-t border-gray-200">
                            <div className="bg-gray-900 text-white p-6 text-center">
                                <h3 className="text-sm font-medium tracking-wider uppercase mb-2">Need Immediate Help?</h3>
                                <p className="text-xs text-gray-300 mb-4">Call our customer service</p>
                                <p className="text-lg font-light">+1 (123) 456-7890</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 px-8">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}