"use client";
import React from 'react';
import { XCircle, AlertTriangle, ArrowLeft, MessageSquare, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderFailedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24 pb-12">
            <div className="max-w-2xl w-full">
                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header with Red Background */}
                    <div className="bg-red-600 px-8 py-6">
                        <div className="flex items-center justify-center">
                            <XCircle className="w-16 h-16 text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mt-4">
                            Order Failed
                        </h1>
                        <p className="text-red-100 text-center mt-2">
                            Payment gateway encountered an issue
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-8">
                        {/* Alert Box */}
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                            <div className="flex items-start">
                                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-semibold text-amber-900 mb-1">
                                        If money was deducted from your account
                                    </h3>
                                    <p className="text-sm text-amber-800">
                                        Don't panic! Your money is safe. If any amount was deducted, it will be automatically refunded to your account within <strong>7 working days</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What Happened */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">What happened?</h2>
                            <p className="text-gray-700 leading-relaxed">
                                The payment gateway was unable to process your transaction. This could be due to various reasons such as network issues, bank server downtime, or transaction limits. Your order was not placed.
                            </p>
                        </div>

                        {/* What to do next */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">What should you do?</h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Verify your payment details and try again</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Try using a different payment method</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Check with your bank if there are any transaction restrictions</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Check your bank statement to confirm if any amount was deducted</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Review our refund policy for more information</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => router.push('/cart?from=order-failed&checkoutmodal=true')}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push('/contact#message')}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Contact Support
                            </button>
                        </div>

                        {/* Secondary Action */}
                        <div className="mt-4">
                            <button
                                onClick={() => router.push('/')}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Home
                            </button>
                        </div>

                        {/* Refund Policy Link */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => router.push('/refund-policy')}
                                className="text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                                View our Refund Policy
                            </button>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Having trouble? Our support team is available to assist you.</p>
                </div>
            </div>
        </div>
    );
}
