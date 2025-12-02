'use client'
import React from 'react';
import { config } from '@/variables/config';

export default function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-45 pb-15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-gray-200 p-8">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-light tracking-wide mb-4 uppercase">Terms & Conditions</h1>
                        <p className="text-gray-600 mb-8 text-sm">Last updated: 30 November 2025</p>

                        <div className="prose prose-sm max-w-none space-y-8">
                            <div className="mb-8">
                                <p className="text-gray-700 leading-relaxed">
                                    Welcome to Venoire. By accessing or using itsvenoire.com (the "Website"), or placing an order with us, you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree with any part of these Terms, please do not use the Website or place an order.
                                </p>
                            </div>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">1. Definitions & Interpretation</h2>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>"We", "us", "our" refers to Venoire.</li>
                                    <li>"You", "your", "customer", "user" refers to any visitor or purchaser using the Website.</li>
                                    <li>"Products" refers to any items offered for sale on the Website.</li>
                                    <li>"Order" refers to the purchase of Products through the Website.</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">2. Use of the Website & Eligibility</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    By using the Website or placing an order, you represent that you are of legal age (18+), and capable of entering into a binding contract.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You agree to provide accurate, complete information during checkout (name, address, payment details, contact info). Incorrect or incomplete information may lead to order cancellation or delays.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    You must not use the Website for any illegal or prohibited activity. Misuse may lead to termination of your access or order cancellation.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">3. Products, Pricing & Payment</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We aim to display accurate information about each Product (description, price, availability). However, errors may occur. We reserve the right to correct errors or refuse/cancel orders even after placement, if a Product or its price was listed incorrectly.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Prices are inclusive of taxes (if applicable) unless explicitly stated. Shipping charges (if any) are shown separately before checkout.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    Payment must be completed through accepted methods on the Website. Orders are confirmed only after successful payment.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">4. Order Confirmation & Cancellation</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    After you place an order and payment is successful, you will receive an order confirmation via email.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    We reserve the right to cancel or refuse any order, for example in cases of suspected fraud, incorrect pricing, stock unavailability, or invalid payment information. In such cases, if payment was made, you will receive a full refund.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">5. Shipping, Delivery & Risk of Loss</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Shipping methods, charges, delivery timelines and any applicable restrictions are governed by our Shipping Policy.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Once we dispatch your order, delivery time depends on the shipping address and courier service. Delivery estimates are not guaranteed, especially to remote locations. Unexpected delays may occur due to external factors (courier delays, weather, etc.).
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    Risk of loss or damage shifts to you once the package is dispatched. We encourage you to inspect the package on delivery. If you receive a damaged/defective/wrong item, you must notify us according to our Returns & Refund Policy.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">6. Returns, Refunds & Exchanges</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Returns and exchanges are governed by our separate Return and Refund Policy. For most products (other than eligible clothing items), returns or exchanges are not permitted.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    For eligible clothing returns, refunds will be processed only after successful inspection of the returned item, and then refunded to your original payment method within the stipulated timeframe.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">7. Intellectual Property & Website Content</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    All content on the Website — including text, images, logos, design, trademarks — is owned or licensed by Venoire. You may not reproduce, distribute, modify, or use any content without prior written permission.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    If you submit any content to the Website (reviews, feedback, images, comments), you grant Venoire a non-exclusive, royalty-free, worldwide license to use, display, modify, reproduce, and distribute such content.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">8. Prohibited Uses & User Responsibility</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">You agree not to misuse the Website or its services. Prohibited actions include (but are not limited to):</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>Using false or misleading information during account creation or purchase.</li>
                                    <li>Attempting unauthorized access to any part of the Website or systems.</li>
                                    <li>Posting or transmitting harmful code, malware, or content that violates applicable law or third-party rights.</li>
                                    <li>Reverse engineering, scraping, or using automated tools to access data from the Website without permission.</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    Violation of these rules may result in immediate termination of access and cancellation of orders.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">9. Disclaimers, Warranty & Limitation of Liability</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    The Website and Products are provided "as is" and "as available." We disclaim all warranties — express or implied — regarding fitness for a particular purpose, merchantability, or non-infringement.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Venoire's liability is limited: we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Website or purchase of Products — e.g. loss of profits, data loss, or other economic loss.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    Our total liability for any claim related to a Product or the Website is limited to the amount you paid for the Product/order.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">10. Amendments to Terms</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    We reserve the right to modify these Terms at any time, without prior notice. The updated Terms will be posted on the Website with a new "Last Updated" date. Continued use of the Website after changes implies your acceptance of the revised Terms.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">11. Governing Law & Dispute Resolution</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    These Terms shall be governed by applicable Indian laws (jurisdiction as per business location). Any disputes arising out of or related to these Terms or your use of the Website shall be subject to the exclusive jurisdiction of the relevant courts in India.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">12. Contact Information</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    If you have any questions or concerns about these Terms, you can reach us at:{' '}
                                    <a href={`mailto:${config.EMAIL}`} className="text-black underline hover:text-gray-700">
                                        {config.EMAIL}
                                    </a>
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
