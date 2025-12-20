'use client'
import React from 'react';
import { siteConfig } from '@/variables/config';

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-45 pb-15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-gray-200 p-8">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-light tracking-wide mb-4 uppercase">Refund Policy</h1>

                        <div className="prose prose-sm max-w-none space-y-8">
                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Eligibility for Returns</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    At Venoire, most of our products are not eligible for return or exchange. Only clothing items qualify for return, as clearly mentioned in our Return Policy. All other categories are excluded from return requests.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">What If I Receive a Damaged, Defective, or Wrong Item?</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    If your order arrives damaged, defective, or incorrect, you must notify us within 24 hours of delivery. To process your concern quickly, please provide:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>A complete unboxing video</li>
                                    <li>Clear photos of the product</li>
                                    <li>Images of the original packaging</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    Send these details to{' '}
                                    <a href={`mailto:${siteConfig.EMAIL}`} className="text-black underline hover:text-gray-700">
                                        {siteConfig.EMAIL}
                                    </a>
                                    , and our support team will assist you promptly.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Quality Inspection Before Refund</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    For clothing items that are eligible for return, the product must first reach us. After we receive the returned item, it undergoes a thorough quality inspection to verify:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>The item is unused</li>
                                    <li>Original tags and packaging are intact</li>
                                    <li>No damage, stains, or signs of wear are present</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    Only after passing this inspection will your refund be initiated.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Refund Timeline</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Once the return request is approved and the returned clothing item successfully clears inspection, the refund will be credited within 7 days to your original payment method.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Failed Online Transactions</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    In case of failed online payments, refunds are handled automatically by the payment gateway and typically reflect in your source account within 7 working days.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
