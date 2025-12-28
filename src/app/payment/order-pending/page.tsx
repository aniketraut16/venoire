"use client";
import React from 'react';
import { Clock, Info, ArrowLeft, MessageSquare, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderPendingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24 pb-12">
            <div className="max-w-2xl w-full">
                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header with Amber Background */}
                    <div className="bg-amber-500 px-8 py-6">
                        <div className="flex items-center justify-center">
                            <Clock className="w-16 h-16 text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mt-4">
                            Payment Pending
                        </h1>
                        <p className="text-amber-100 text-center mt-2">
                            We're waiting for confirmation from your bank
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-8">
                        {/* Info Box */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                            <div className="flex items-start">
                                <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0" />
                                <div>
                                    <h3 className="text-sm font-semibold text-blue-900 mb-1">
                                        Transaction in Progress
                                    </h3>
                                    <p className="text-sm text-blue-800">
                                        Your payment is being processed. The status will be updated within <strong>2-5 minutes</strong>. Please check back shortly.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What Happened */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">What's happening?</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                We have received your payment request and are awaiting confirmation from your bank or payment provider. This is a normal part of the payment process.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Your order will be confirmed once we receive the payment confirmation from the bank.
                            </p>
                        </div>

                        {/* What to do next */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">What should you do?</h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 shrink-0"></span>
                                    <span>Wait for 2-5 minutes for the payment to be confirmed</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 shrink-0"></span>
                                    <span>Check your email for order confirmation</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 shrink-0"></span>
                                    <span>You can safely close this page and check your orders later</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 shrink-0"></span>
                                    <span>If the status doesn't update after 5 minutes, please contact support</span>
                                </li>
                            </ul>
                        </div>

                        {/* Warning Box */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-amber-900">
                                <strong>Please Note:</strong> Do not attempt to place the order again to avoid duplicate charges. If you don't see the order reflected within 5 minutes, contact our support team.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => router.push('/')}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Home
                            </button>
                            <button
                                onClick={() => router.push('/orders')}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Check Orders
                            </button>
                        </div>

                        {/* Contact Support Button */}
                        <div className="mt-4">
                            <button
                                onClick={() => router.push('/contact#message')}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Your transaction is being processed. Please be patient.</p>
                </div>
            </div>
        </div>
    );
}
