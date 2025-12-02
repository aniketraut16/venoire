'use client'
import React from 'react';
import { config } from '@/variables/config';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-45 pb-15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-gray-200 p-8">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-light tracking-wide mb-4 uppercase">Privacy Policy</h1>
                        <p className="text-gray-600 mb-8 text-sm">Last updated: 30 November 2025</p>

                        <div className="prose prose-sm max-w-none space-y-8">
                            <div className="mb-8">
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    At Venoire, accessible from itsvenoire.com, protecting the privacy of our visitors and customers is one of our top priorities. This Privacy Policy explains what information we collect, how we use it, and the measures we take to safeguard your data.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    If you have any questions or need further clarification regarding this Privacy Policy, you can contact us at{' '}
                                    <a href={`mailto:${config.EMAIL}`} className="text-black underline hover:text-gray-700">
                                        {config.EMAIL}
                                    </a>
                                </p>
                            </div>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Log Files</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    itsvenoire.com follows standard log file procedures used by most hosting companies. These files record information when visitors browse the website. Information collected through log files may include:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>IP (Internet Protocol) address</li>
                                    <li>Browser type</li>
                                    <li>Internet Service Provider (ISP)</li>
                                    <li>Date and time of visit</li>
                                    <li>Referring/exit pages</li>
                                    <li>Number of clicks</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mb-2">This information is not linked to any personally identifiable data. It is used solely for:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Analyzing trends</li>
                                    <li>Administering the website</li>
                                    <li>Tracking user movement</li>
                                    <li>Gathering demographic statistics</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Cookies & Web Beacons</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Like many websites, Venoire uses cookies to enhance the user experience. Cookies may store:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>Visitor preferences</li>
                                    <li>Pages visited on the website</li>
                                    <li>Browser type or device information</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    This helps us customize content based on your preferences and optimize the performance of our site.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Google DoubleClick DART Cookie</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Google, a third-party vendor on our site, uses DART cookies to display ads based on users' visits to itsvenoire.com and other websites. You can choose to opt out of the DART cookie by visiting the Google Ad & Content Network Privacy Policy:{' '}
                                    <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-black underline hover:text-gray-700">
                                        https://policies.google.com/technologies/ads
                                    </a>
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Third-Party Advertising Partners</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Our third-party advertising partners may use technologies such as:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>Cookies</li>
                                    <li>JavaScript</li>
                                    <li>Web Beacons</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    These technologies enable them to track the effectiveness of their advertisements and personalize the ads shown to you. When this happens, they automatically receive your IP address.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    Venoire has no control over or access to cookies used by third-party advertisers.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Third-Party Privacy Policies</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Venoire's Privacy Policy does not apply to advertisers or external websites linked from ours. You should review the privacy policies of these third-party ad servers to understand:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                    <li>Their data handling practices</li>
                                    <li>How to opt out of certain features</li>
                                    <li>Their cookie usage guidance</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    To manage cookie settings, refer to your browser's official support pages.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Children's Information</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Protecting children online is important to us. We encourage parents and guardians to monitor and guide their children's online activity.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    itsvenoire.com does not knowingly collect any personally identifiable information from children under the age of 13. If you believe your child has provided such information on our website, please contact us immediately at{' '}
                                    <a href={`mailto:${config.EMAIL}`} className="text-black underline hover:text-gray-700">
                                        {config.EMAIL}
                                    </a>
                                    . We will take prompt action to delete the data from our records.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Online Privacy Policy Only</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    This Privacy Policy applies only to information collected through our website and is not applicable to information collected offline or through platforms other than itsvenoire.com.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-light tracking-wide uppercase mb-4 text-gray-900">Personally Identifiable Information (PII)</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    This policy is designed to help users who are concerned about how their Personal Data (PII) is collected and used. PII includes any information that can be used to identify, contact, or locate an individual.
                                </p>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3 text-gray-900">What Personal Information Do We Collect?</h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        When visiting, registering, or purchasing on our website, we may request certain information such as:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Full name</li>
                                        <li>Email address</li>
                                        <li>Phone number</li>
                                        <li>Shipping address</li>
                                        <li>Billing address</li>
                                        <li>Payment information (handled securely by payment gateways)</li>
                                        <li>Any additional details required to complete an order or improve your experience</li>
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3 text-gray-900">When Do We Collect Information?</h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">We may collect information when you:</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Register on the website</li>
                                        <li>Place an order</li>
                                        <li>Subscribe to a newsletter</li>
                                        <li>Respond to a survey</li>
                                        <li>Fill out a form</li>
                                        <li>Contact us via email or support</li>
                                        <li>Use site features such as checkout or account creation</li>
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3 text-gray-900">How We Use Your Information</h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">We use collected information for the following purposes:</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Personalizing your shopping experience</li>
                                        <li>Improving website functionality and performance</li>
                                        <li>Handling customer service requests</li>
                                        <li>Processing orders and transactions</li>
                                        <li>Running promotions, contests, or surveys</li>
                                        <li>Sending important updates or responses to your inquiries</li>
                                        <li>Improving product offerings and user interaction</li>
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3 text-gray-900">How We Protect Your Information</h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">We regularly scan our website for:</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                                        <li>Security vulnerabilities</li>
                                        <li>Malware threats</li>
                                        <li>Known cyber risks</li>
                                    </ul>
                                    <p className="text-gray-700 leading-relaxed">
                                        Our goal is to make your browsing and shopping experience as safe as possible. Sensitive information, such as payment details, is processed through secure, encrypted channels provided by trusted third-party payment gateways.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
