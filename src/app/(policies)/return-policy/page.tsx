'use client'
import React from 'react';
import { config } from '@/variables/config';

export default function ReturnPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-45 pb-15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-gray-200 p-8">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-light tracking-wide mb-4 uppercase">Return Policy</h1>

                        <div className="prose prose-sm max-w-none space-y-8">
                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Eligibility for Returns</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    At Venoire, only clothing items are eligible for return. All other product categories — including accessories, beauty products, lifestyle items, or any non-clothing merchandise — are not eligible for return or exchange under any circumstances.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">Before requesting a return for clothing, please ensure the item is:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Unused and unwashed</li>
                                    <li>In its original condition</li>
                                    <li>With all tags, labels, and packaging intact</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mt-4">
                                    Any clothing product that fails these checks may not qualify for approval.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">What Should I Do If I Receive a Damaged, Defective, or Incorrect Product?</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    If you receive a damaged, defective, or incorrect item, you must contact us within 24 hours of delivery. To process your claim, provide:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>A mandatory unboxing video</li>
                                    <li>Clear photos of the product</li>
                                    <li>Images of the outer packaging</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    Email all required proof to{' '}
                                    <a href={`mailto:${config.EMAIL}`} className="text-black underline hover:text-gray-700">
                                        {config.EMAIL}
                                    </a>
                                    , and our team will assist you promptly.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Is an Unboxing Video Required to Make a Claim?</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">Yes. A complete unboxing video is mandatory for any claim related to:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Damaged items</li>
                                    <li>Missing pieces</li>
                                    <li>Tampered packaging</li>
                                    <li>Wrong items delivered</li>
                                    <li>Leakage or breakage (if applicable)</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mt-4">
                                    Claims without an unboxing video will not be accepted, as it is the only verifiable proof for courier-related issues.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">What Should I Do If the Package Looks Tampered or Damaged at Delivery?</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    If the package you receive appears tampered, opened, or visibly damaged, please refuse to accept it from the delivery partner. Immediately report the issue to{' '}
                                    <a href={`mailto:${config.EMAIL}`} className="text-black underline hover:text-gray-700">
                                        {config.EMAIL}
                                    </a>
                                    {' '}with photos so we can take it up with the courier service.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    Accepting a visibly damaged package limits our ability to process claims.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Do You Perform Quality Checks Before Shipping?</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Yes. All products — especially clothing items — undergo strict quality inspection checks before dispatch. Despite this, if a rare issue occurs, we will support you and resolve it promptly as long as the mandatory proof is provided.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Return Process for Clothing</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">If your clothing item qualifies for return:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>You must inform us within 24 hours of delivery.</li>
                                    <li>After approval, you need to ship the item back to us in its original condition.</li>
                                    <li>Once we receive the returned item, it goes through a quality inspection.</li>
                                    <li>If it passes inspection, your refund will be processed in 3–5 business days to your original payment method.</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mt-4">
                                    Items that fail inspection (worn, washed, stained, or without tags) will not be eligible for refund.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
