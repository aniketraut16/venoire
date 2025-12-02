'use client'
import React from 'react';
import { config } from '@/variables/config';

export default function ShippingPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-45 pb-15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-gray-200 p-8">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-light tracking-wide mb-4 uppercase">Shipping Policy</h1>

                        <div className="prose prose-sm max-w-none space-y-8">
                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">General Overview</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    This Shipping Policy explains how Venoire handles the shipping and delivery of products ordered through itsvenoire.com. We aim to provide transparent information about shipping charges, delivery timelines, handling times, and any limitations that may affect your order.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Shipping Charges</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We offer free shipping on all orders above ₹999. For orders below ₹999, a standard shipping fee will be applied at checkout.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    Shipping fees may vary during promotions or special events, but any such changes will be clearly communicated on our website before you place your order.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Handling and Dispatch Time</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    All orders are typically processed and dispatched within 1 working day after the order is confirmed. Orders placed after standard business hours or on holidays may be processed on the next working day.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    In some rare cases—such as high-volume periods, order verification delays, or stock checks—handling time may be slightly extended. If that occurs, we will notify you promptly.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Estimated Delivery Time</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Products will be delivered within 3-5 business days from the date of dispatch. Delivery timelines may vary slightly depending on your delivery location within India. Remote or hard-to-reach areas may experience slightly longer transit times depending on courier service availability.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    We currently ship only within India and do not deliver internationally.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Shipping Options</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    At this time, Venoire provides standard shipping across India. We do not currently offer:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>Express or overnight shipping</li>
                                    <li>Same-day delivery</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    If additional shipping methods are introduced in the future, they will be updated in this policy.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Order Tracking</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Once your order has been dispatched, you will receive a tracking link via email sent to the address provided at checkout. This tracking link will allow you to monitor the movement and expected delivery date of your shipment.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    If you do not receive tracking details within 24 hours of dispatch, you can contact us at{' '}
                                    <a href={`mailto:${config.EMAIL}`} className="text-black underline hover:text-gray-700">
                                        {config.EMAIL}
                                    </a>
                                    .
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Delivery Attempts and Failure</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Our courier partners will attempt delivery to your provided address. If the delivery fails due to an incorrect address, repeated unavailability, or refusal to accept the order, the shipment may be returned to us. In such cases, reshipping may incur additional charges.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Order Delays</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">While we strive for timely delivery, delays may occur due to:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>Unforeseen courier issues</li>
                                    <li>Weather conditions</li>
                                    <li>Strikes or transportation restrictions</li>
                                    <li>Remote location challenges</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    If your order is significantly delayed, our team will assist in tracking and resolving the issue.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
