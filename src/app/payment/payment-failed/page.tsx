"use client";
import React from 'react';
import { XCircle, AlertTriangle, ArrowLeft, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentFailedPage() {
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
                            Payment Failed
                        </h1>
                        <p className="text-red-100 text-center mt-2">
                            We encountered an issue processing your payment
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
                                There was a technical issue on our end while processing your payment. Your order could not be completed at this time. We apologize for the inconvenience.
                            </p>
                        </div>

                        {/* What to do next */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">What should you do?</h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Try placing your order again after a few minutes</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Check your bank statement to confirm if any amount was deducted</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Review our refund policy for more information</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Contact our support team if you need assistance</span>
                                </li>
                            </ul>
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
                                onClick={() => router.push('/contact#message')}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Contact Support
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
                    <p>Need immediate assistance? Our support team is here to help.</p>
                </div>
            </div>
        </div>
    );
}
