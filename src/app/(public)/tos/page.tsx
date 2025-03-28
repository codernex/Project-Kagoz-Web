
import { appendApi } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import { PageType } from "@/types";
import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
    try {
        const response = await axiosInstance.get(`/seo/${PageType.TermsOfService}`)

        const data = response.data.data as ISeo
        return {
            title: `${data.title} | KAGOZ`,
            alternates: {
                canonical: data.canonical || process.env.NEXT_PUBLIC_BASE_URL + '/tos'
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
            title: "Terms Of Service | KAGOZ",
            alternates: {
                canonical: process.env.NEXT_PUBLIC_BASE_URL + '/tos'
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
const TermsOfService = () => {
    return (
        <div className="min-h-screen py-10 px-6 max-w-7xl mx-auto">
            <Head>
                <title>Terms and Conditions - KAGOZ</title>
            </Head>
            <div className="mx-auto bg-white p-10 shadow-lg rounded-lg">
                <h1 className="text-lg font-bold text-gray-800 mb-6">Terms and Conditions</h1>
                <p className="text-sm text-gray-500 mb-4">Effective Date: [31-12-2025]</p>

                <p className="text-gray-700 mb-6 leading-relaxed">
                    Welcome to KAGOZ, Bangladesh’s trusted business directory platform. By accessing or using our website
                    (<a href="https://www.kagoz.com.bd" className="text-blue-500">www.kagoz.com.bd</a>), you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before using our services.
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            By accessing or using KAGOZ, whether as a visitor, business owner, or registered user, you acknowledge and agree to these Terms and Conditions, along with our Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">2. Services Provided</h2>
                        <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                            <li>Free business listings</li>
                            <li>Premium listing packages (optional)</li>
                            <li>Search and discovery tools for users</li>
                            <li>Displaying business details collected from public sources</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">3. Business Listing Information</h2>
                        <p className="text-gray-700 leading-relaxed">We collect business information from various sources including Google Business Profiles and business websites. While we strive for accuracy, KAGOZ does not guarantee the correctness or completeness of any business information listed.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">4. Requesting Edits or Removal</h2>
                        <p className="text-gray-700 leading-relaxed">Business owners can request corrections, updates, or removal of their listings at any time. Contact us via:</p>
                        <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                            <li>📞 Phone: +8801534275161</li>
                            <li>📞 Phone: +8801913729867</li>
                            <li>📧 Email: support@kagoz.com.bd</li>
                            <li>📍 Office Visit: 123, Road 7, Mohammadia Housing Ltd, Mohammadpur, Dhaka 1207</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">5. User Conduct</h2>
                        <p className="text-gray-700 leading-relaxed">Users must not engage in fraudulent behavior, post misleading information, or misuse our directory for spam or illegal activities.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">6. Intellectual Property</h2>
                        <p className="text-gray-700 leading-relaxed">All content on KAGOZ, including logos and text, are the property of KAGOZ and cannot be used without permission.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">7. Premium Listings and Payment</h2>
                        <p className="text-gray-700 leading-relaxed">Businesses can opt for premium packages. Payments are non-refundable unless specified otherwise.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">8. Third-Party Links</h2>
                        <p className="text-gray-700 leading-relaxed">KAGOZ may contain links to external websites, but we are not responsible for their content or privacy policies.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">9. Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed">KAGOZ is not liable for any damages resulting from the use of our services.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">10. Compliance with Bangladeshi Law</h2>
                        <p className="text-gray-700 leading-relaxed">By using our services, you acknowledge that any legal matters fall under Bangladesh’s jurisdiction.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">11. Termination</h2>
                        <p className="text-gray-700 leading-relaxed">KAGOZ reserves the right to suspend or remove listings if they violate our terms.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">12. Changes to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">We may update these Terms and Conditions at any time. Users must review them periodically.</p>
                    </section>

                    <section>
                        <h2 className="text-mdx font-semibold text-gray-800 mb-2">13. Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed">For any inquiries, reach out to:</p>
                        <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                            <li>📞 Phone: +8801534275161</li>
                            <li>📞 Phone: +8801913729867</li>
                            <li>📧 Email: support@kagoz.com.bd</li>
                            <li>📍 Office Visit: 123, Road 7, Mohammadia Housing Ltd, Mohammadpur, Dhaka 1207</li>
                        </ul>
                    </section>
                </div>

                <p className="text-gray-700 mt-8 leading-relaxed">By using KAGOZ, you agree to abide by these Terms and Conditions.</p>
            </div>
        </div>
    );
};

export default TermsOfService;