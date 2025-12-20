'use client'
import React from 'react';
import { siteConfig } from '@/variables/config';

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-45 pb-15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-gray-200 p-8">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-light tracking-wide mb-4 uppercase">Cookie Policy</h1>
                        <p className="text-gray-600 mb-8 text-sm">Last updated: 30 November 2025</p>

                        <div className="prose prose-sm max-w-none space-y-8">
                            <div className="mb-8">
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    This Cookie Policy explains how Venoire ("we", "us", "our") uses cookies and similar tracking technologies on itsvenoire.com ("Website"). By continuing to browse or use our Website, you agree to the use of cookies as described in this policy.
                                </p>
                            </div>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">1. What Are Cookies?</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Cookies are small text files stored on your device (computer, tablet, mobile) when you visit a website. They help websites function properly, improve performance, and personalize your browsing experience.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-2">Cookies may store information such as:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>User preferences</li>
                                    <li>Session details</li>
                                    <li>Login information</li>
                                    <li>Pages visited</li>
                                    <li>Device or browser data</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">2. How We Use Cookies</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">Venoire uses cookies to:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Enable essential website functions</li>
                                    <li>Improve website speed and performance</li>
                                    <li>Store user preferences (e.g., language, location)</li>
                                    <li>Analyze how visitors use our website</li>
                                    <li>Personalize content and product recommendations</li>
                                    <li>Support secure login and checkout processes</li>
                                    <li>Assist in advertising and retargeting efforts</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mt-4">
                                    These cookies help us provide a smoother and more relevant browsing experience.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">3. Types of Cookies We Use</h2>
                                
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3 text-gray-900">A. Essential / Strictly Necessary Cookies</h3>
                                    <p className="text-gray-700 leading-relaxed mb-2">Required for the website to function. These include cookies for:</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Secure checkout</li>
                                        <li>Shopping cart functionality</li>
                                        <li>Login and authentication</li>
                                        <li>Page navigation</li>
                                    </ul>
                                    <p className="text-gray-700 leading-relaxed mt-2">
                                        You cannot disable these cookies as the site may not work correctly without them.
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3 text-gray-900">B. Performance & Analytics Cookies</h3>
                                    <p className="text-gray-700 leading-relaxed mb-2">Used to understand visitor interactions and improve the website. These cookies help us gather anonymous data such as:</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Pages visited</li>
                                        <li>Time spent on the website</li>
                                        <li>Click patterns</li>
                                        <li>Website errors</li>
                                    </ul>
                                    <p className="text-gray-700 leading-relaxed mt-2">
                                        Google Analytics and similar tools may use these types of cookies.
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3 text-gray-900">C. Preference Cookies</h3>
                                    <p className="text-gray-700 leading-relaxed mb-2">Store your settings and preferences such as:</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Display options</li>
                                        <li>Saved items</li>
                                        <li>Location settings</li>
                                    </ul>
                                    <p className="text-gray-700 leading-relaxed mt-2">
                                        These cookies ensure the website remembers your choices.
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3 text-gray-900">D. Advertising & Targeting Cookies</h3>
                                    <p className="text-gray-700 leading-relaxed mb-2">Used by Venoire and third parties to:</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Deliver personalized ads</li>
                                        <li>Measure ad performance</li>
                                        <li>Limit repetitive ads</li>
                                        <li>Enable retargeting on other websites</li>
                                    </ul>
                                    <p className="text-gray-700 leading-relaxed mt-2">
                                        Third-party platforms like Google may use DART cookies for interest-based advertising.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed mt-2">
                                        You may opt out of Google's advertising cookies here:{' '}
                                        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-black underline hover:text-gray-700">
                                            https://policies.google.com/technologies/ads
                                        </a>
                                    </p>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">4. Third-Party Cookies</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Some cookies are placed by trusted third parties such as:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>Analytics providers</li>
                                    <li>Advertising networks</li>
                                    <li>Social media platforms</li>
                                    <li>Payment gateways</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mb-2">These third parties may collect data to:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>Analyze performance</li>
                                    <li>Deliver targeted ads</li>
                                    <li>Track conversions</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    Venoire does not control third-party cookies. Please refer to their respective policies for more details.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">5. Managing or Disabling Cookies</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You can choose to disable or manage cookies through your browser settings. Each browser has its own method for controlling cookie behavior:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>Chrome</li>
                                    <li>Firefox</li>
                                    <li>Safari</li>
                                    <li>Edge</li>
                                    <li>Opera</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    Disabling certain cookies may limit website functionality, including login, cart, and checkout features.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">6. Updates to This Cookie Policy</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    We may update this Cookie Policy periodically to reflect changes in technology, legal requirements, or our practices. The updated version will be posted on itsvenoire.com, and the "Last Updated" date will be revised accordingly.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">7. Contact Us</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    If you have any questions regarding this Cookie Policy, you can contact us at:{' '}
                                    <a href={`mailto:${siteConfig.EMAIL}`} className="text-black underline hover:text-gray-700">
                                        {siteConfig.EMAIL}
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
