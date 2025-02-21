import { Metadata } from "next";

import { appendApi } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import { PageType } from "@/types";
import React from "react";

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
        <div className="max-w-7xl mx-auto p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-black mb-6">Privacy Policy for KAGOZ</h1>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">1. Information We Collect</h2>

                <h3 className="text-2xl font-medium text-black mb-2">a. Information You Provide to Us:</h3>
                <ul className="list-disc list-inside text-muted mb-4">
                    <li><strong>Account Information</strong>: When you create an account, we collect your name, email address, business details, and payment information (if applicable).</li>
                    <li><strong>Content</strong>: Any business information, descriptions, or media you upload to your directory profile.</li>
                </ul>

                <h3 className="text-2xl font-medium text-black mb-2">b. Information We Collect Automatically:</h3>
                <ul className="list-disc list-inside text-muted mb-4">
                    <li><strong>Usage Data</strong>: Information about how you interact with our application, including pages visited, features used, and time spent.</li>
                    <li><strong>Device Information</strong>: Details such as IP address, browser type, operating system, and device type.</li>
                    <li><strong>Cookies and Tracking</strong>: We use cookies and similar technologies to enhance user experience and analyze usage.</li>
                </ul>

                <h3 className="text-2xl font-medium text-black mb-2">c. Information from Third Parties:</h3>
                <ul className="list-disc list-inside text-muted">
                    <li>If you integrate third-party services, we may receive information from those platforms per their privacy policies.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">2. How We Use Your Information</h2>
                <ul className="list-disc list-inside text-muted">
                    <li><strong>To Provide Services</strong>: Delivering and maintaining the functionality of KAGOZ.</li>
                    <li><strong>To Personalize Your Experience</strong>: Tailoring content and recommendations to your preferences.</li>
                    <li><strong>To Communicate</strong>: Sending important updates, newsletters, or promotional materials (you can opt out at any time).</li>
                    <li><strong>To Improve Our Application</strong>: Analyzing user behavior to enhance features and performance.</li>
                    <li><strong>To Ensure Security</strong>: Detecting and preventing fraud or unauthorized access.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">3. How We Share Your Information</h2>
                <ul className="list-disc list-inside text-muted">
                    <li><strong>With Your Consent</strong>: When you authorize us to share your information.</li>
                    <li><strong>With Service Providers</strong>: Third-party vendors who assist with operations like hosting, payment processing, or analytics.</li>
                    <li><strong>For Legal Reasons</strong>: When required to comply with applicable laws or protect our rights and safety.</li>
                    <li><strong>Business Transfers</strong>: In the event of a merger, acquisition, or sale of assets.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">4. Your Choices and Rights</h2>
                <ul className="list-disc list-inside text-muted">
                    <li><strong>Access and Update</strong>: Reviewing and updating your account details.</li>
                    <li><strong>Delete Account</strong>: Requesting the deletion of your account and associated data.</li>
                    <li><strong>Cookie Preferences</strong>: Adjusting your cookie settings via your browser.</li>
                    <li><strong>Marketing Opt-Out</strong>: Unsubscribing from promotional communications.</li>
                </ul>
                <p className="text-sm text-muted">To exercise any of these rights, contact us at [Insert Contact Email].</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">5. Data Security</h2>
                <p className="text-sm text-muted">We implement industry-standard measures to protect your data, including encryption, secure servers, and regular security assessments. However, no system is entirely secure, and we cannot guarantee absolute security.</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">6. Data Retention</h2>
                <p className="text-sm text-muted">We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy or comply with legal obligations. You can request deletion of your data at any time.</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">7. Children’s Privacy</h2>
                <p className="text-sm text-muted">KAGOZ is not intended for users under the age of 13, and we do not knowingly collect personal information from children.</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">8. Changes to This Privacy Policy</h2>
                <p className="text-sm text-muted">We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant updates via email or in-app notifications.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-black mb-4">9. Contact Us</h2>
                <p className="text-sm text-muted">If you have questions or concerns about this Privacy Policy, please contact us:</p>
                <address className="text-sm text-muted">
                    <strong>KAGOZ Support Team</strong><br />
                    Email: [Insert Contact Email]<br />
                    Address: [Insert Physical Address]
                </address>
            </section>
        </div>
    )
}