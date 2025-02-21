
import { appendApi } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import { PageType } from "@/types";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
    try {
        const response = await axiosInstance.get(`/seo/${PageType.AdsPolicy}`)

        const data = response.data.data as ISeo
        return {
            title: `${data.title} | KAGOZ`,
            alternates: {
                canonical: data.canonical || process.env.NEXT_PUBLIC_BASE_URL + '/ads-policy'
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
            title: "Ads Policy | KAGOZ",
            alternates: {
                canonical: process.env.NEXT_PUBLIC_BASE_URL + '/ads-policy'
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
        <div className="max-w-7xl mx-auto p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-black mb-6">Advertising Policy for KAGOZ</h1>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">1. Introduction</h2>
                <p className="text-sm text-gray-500">
                    This Advertising Policy outlines the guidelines and requirements for displaying and
                    managing advertisements on KAGOZ. By interacting with the platform, users and advertisers
                    agree to comply with this policy.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">2. Ad Placement</h2>
                <p className="text-sm text-gray-500">
                    Advertisements may appear on various sections of KAGOZ, including the homepage, user
                    dashboards, search results, and individual business listings. We aim to place ads in a
                    way that ensures a positive user experience.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">3. Ad Content Guidelines</h2>
                <p className="text-sm text-gray-500">
                    All advertisements must adhere to the following content guidelines:
                </p>
                <ul className="list-disc list-inside text-gray-500">
                    <li>Ads must be clear, accurate, and not misleading.</li>
                    <li>Ads promoting illegal activities or harmful content are strictly prohibited.</li>
                    <li>Ads should respect user privacy and not use deceptive practices to collect personal information.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">4. Targeting and Personalization</h2>
                <p className="text-sm text-gray-500">
                    Advertisements may be personalized based on user interests and behavior. This targeting
                    is done in accordance with privacy laws and regulations, and we do not sell or share
                    personally identifiable information without user consent.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">5. Prohibited Ad Content</h2>
                <p className="text-sm text-gray-500">
                    The following types of ads are prohibited:
                </p>
                <ul className="list-disc list-inside text-gray-500">
                    <li>Ads that promote hate speech, violence, or discrimination.</li>
                    <li>Ads that infringe on intellectual property rights.</li>
                    <li>Ads containing misleading or fraudulent claims about products or services.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">6. User Consent and Privacy</h2>
                <p className="text-sm text-gray-500">
                    By using KAGOZ, users consent to the display of ads as outlined in this policy. We are
                    committed to protecting user privacy and comply with relevant privacy laws when displaying
                    advertisements.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">7. Ad Review and Approval</h2>
                <p className="text-sm text-gray-500">
                    All ads submitted for placement on KAGOZ will undergo a review process. We reserve the
                    right to approve or reject ads based on compliance with this policy.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">8. Changes to the Policy</h2>
                <p className="text-sm text-gray-500">
                    We may update this Advertising Policy from time to time. Any changes will be posted on
                    this page, and the updated date will be reflected at the top. Continued use of KAGOZ
                    signifies your acceptance of any changes to the policy.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-black mb-4">9. Contact Us</h2>
                <p className="text-sm text-gray-500">If you have any questions about this Advertising Policy, please contact us:</p>
                <address className="text-sm text-gray-500">
                    <strong>KAGOZ Advertising Support Team</strong><br />
                    Email: <a href="mailto:support@kagoz.com" className="text-blue-600 hover:underline">support@kagoz.com</a><br />
                    Address: [Insert Physical Address]
                </address>
            </section>
        </div>
    )
}