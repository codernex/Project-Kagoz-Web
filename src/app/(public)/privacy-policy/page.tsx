import { Metadata } from "next";

import { appendApi } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import { PageType } from "@/types";
import React from "react";
import Head from "next/head";

export async function generateMetadata(): Promise<Metadata> {
    try {
        const response = await axiosInstance.get(`/seo/${PageType.PrivacyPolicy}`)

        const data = response.data.data as ISeo
        return {
            title: `${data.title} | KAGOZ`,
            alternates: {
                canonical: data.canonical || process.env.NEXT_PUBLIC_BASE_URL + '/privacy-policy'
            },
            openGraph: {
                images: [appendApi(data.seo_image)],
                type: "website",
                locale: "en-US",
                countryName: "Bangladesh",
                title: `${data.title} | KAGOZ`,
                description: data.description
            },
            description: data.description,
            keywords: data.keyword,
            robots: {
                index: data.index,
                follow: data.follow,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
                googleBot: {
                    index: data.index,
                    follow: data.follow,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                    "max-video-preview": -1,
                },
            }
        }
    } catch (error) {
        return {
            title: "Privacy Policy | KAGOZ",
            alternates: {
                canonical: process.env.NEXT_PUBLIC_BASE_URL + '/privacy-policy'
            },
            openGraph: {
                images: ["/images/logo.png"],
                countryName: "Bangladesh"
            },
            twitter: {
                card: "summary",
                images: ["/images/logo.png"],
            },
            robots: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
                googleBot: {
                    index: true,
                    follow: true,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                    "max-video-preview": -1,
                },
            }
        }
    }
}
export default function Page() {
    return (
        <div className="min-h-screen  py-10 px-6 max-w-7xl mx-auto">
            <Head>
                <title>Privacy Policy - KAGOZ</title>
            </Head>
            <div className=" bg-white p-10 shadow-lg rounded-lg">
                <h1 className="text-lg font-bold text-gray-800 mb-6">Privacy Policy</h1>
                <p className="text-sm text-gray-500 mb-4">Effective Date: [31-12-2025]</p>

                <p className="text-gray-700 mb-6 leading-relaxed">
                    At KAGOZ, the trusted Bangladesh business directory, we are committed to protecting the privacy of our users, businesses, and visitors. This Privacy Policy outlines how we collect, use, disclose, and safeguard the information provided to us. By accessing or using our website, you agree to the terms outlined below.
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
                        <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                            <li><strong>Business Information:</strong> Business Name, Business Address, Contact Details, Website URL, Business Category, Social Media Links, Images, Logos, and Videos.</li>
                            <li><strong>Personal Information:</strong> Name, Email Address, Phone Number, and any additional voluntarily provided information.</li>
                            <li><strong>Automatically Collected Information:</strong> IP Address, Browser Type, Operating System, Pages Viewed, Time Spent on Site, Cookies, and similar tracking technologies.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">2. How We Use Information</h2>
                        <p className="text-gray-700 leading-relaxed">We use the collected information to display business listings, enhance user experience, respond to inquiries, send notifications, and improve website security.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">3. Source of Business Information</h2>
                        <p className="text-gray-700 leading-relaxed">KAGOZ gathers business details from publicly available sources such as Google Business Profiles, official websites, third-party directories, and social media.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">4. Disclaimer on Business Information Accuracy</h2>
                        <p className="text-gray-700 leading-relaxed">While we update listings monthly, we do not guarantee accuracy. Business owners should verify and request corrections if needed.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">5. Compliance with Bangladeshi Law</h2>
                        <p className="text-gray-700 leading-relaxed">KAGOZ operates under the laws of Bangladesh. No legal claims can be made against KAGOZ for incorrect business information.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">6. Data Security</h2>
                        <p className="text-gray-700 leading-relaxed">We implement security measures but cannot guarantee absolute protection. Users acknowledge this risk.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">7. Cookies Policy</h2>
                        <p className="text-gray-700 leading-relaxed">We use cookies for site functionality, analytics, and user experience improvements. Cookie settings can be managed through browser settings.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">8. Third-Party Links</h2>
                        <p className="text-gray-700 leading-relaxed">We are not responsible for privacy practices of external websites linked on our platform.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">9. Your Rights</h2>
                        <p className="text-gray-700 leading-relaxed">Users can request access, updates, or removal of business listing information.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">10. Changes to This Privacy Policy</h2>
                        <p className="text-gray-700 leading-relaxed">KAGOZ reserves the right to update this Privacy Policy. Changes will be reflected on this page.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed">For any inquiries, reach out to:</p>
                        <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                            <li>📞 Phone: +8801534275161</li>
                            <li>📞 Phone: +8801913729867</li>
                            <li>📧 Email: support@kagoz.com.bd</li>
                            <li>📍 Office Visit: 123, Road 7, Mohammadia Housing Ltd, Mohammadpur, Dhaka 1207</li>
                        </ul>
                    </section>
                </div>

                <p className="text-gray-700 mt-8 leading-relaxed">By using KAGOZ, you agree to abide by this Privacy Policy.</p>
            </div>
        </div>
    )
}