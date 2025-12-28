"use client";
import React from 'react';
import { CheckCircle2, Info, ArrowLeft, MessageSquare, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentAlreadyProcessedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24 pb-12">
            <div className="max-w-2xl w-full">
                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header with Blue Background */}
                    <div className="bg-blue-600 px-8 py-6">
                        <div className="flex items-center justify-center">
                            <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mt-4">
                            Payment Already Processed
                        </h1>
                        <p className="text-blue-100 text-center mt-2">
                            This transaction has already been completed
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
                                        Transaction Already Completed
                                    </h3>
                                    <p className="text-sm text-blue-800">
                                        This payment has already been processed successfully. Your order should be reflected in your account within <strong>2-5 minutes</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What Happened */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">What does this mean?</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                We have already received and processed your payment for this transaction. You may have refreshed the payment page or clicked the back button after the payment was completed.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Your order has been placed successfully and you should receive a confirmation email shortly.
                            </p>
                        </div>

                        {/* What to do next */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">What should you do?</h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 shrink-0"></span>
                                    <span>Check your email for the order confirmation</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 shrink-0"></span>
                                    <span>View your orders to see the order details</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 shrink-0"></span>
                                    <span>Wait 2-5 minutes if the order is not visible yet</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 shrink-0"></span>
                                    <span>Do not attempt to place the order again</span>
                                </li>
                            </ul>
                        </div>

                        {/* Success Box */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-green-900">
                                <strong>Good News!</strong> Your payment was successful. If you don't see your order within 5 minutes, please contact our support team for assistance.
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
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Package className="w-5 h-5" />
                                View Orders
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
                    <p>Thank you for your order! We're processing it now.</p>
                </div>
            </div>
        </div>
    );
}
