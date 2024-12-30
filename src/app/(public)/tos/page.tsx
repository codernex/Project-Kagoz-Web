
import { appendApi } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import { PageType } from "@/types";
import { Metadata } from "next";
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
                index: data.index === 'index',
                follow: data.follow === 'follow'
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
                follow: true
            }
        }
    }
}
const TermsOfService = () => {
    return (
        <div className="max-w-7xl mx-auto p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-black mb-6">Terms of Service for KAGOZ</h1>
            <p className="text-sm text-muted mb-6">Effective Date: [Insert Effective Date]</p>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">1. Acceptance of Terms</h2>
                <p className="text-sm text-muted">By accessing or using KAGOZ, you agree to be bound by these Terms of Service. If you do not agree, you may not use the application.</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">2. User Responsibilities</h2>
                <ul className="list-disc list-inside text-muted">
                    <li>You are responsible for maintaining the confidentiality of your account information.</li>
                    <li>You agree not to misuse the platform, including but not limited to violating applicable laws or regulations.</li>
                    <li>You must provide accurate and complete information when creating an account or listing a business.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">3. Prohibited Activities</h2>
                <ul className="list-disc list-inside text-muted">
                    <li>Posting false or misleading business information.</li>
                    <li>Engaging in fraudulent or illegal activities.</li>
                    <li>Attempting to hack or disrupt the platform.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">4. Intellectual Property</h2>
                <p className="text-sm text-muted">All content, trademarks, and other intellectual property on KAGOZ are owned by us or our licensors. You may not use this content without prior permission.</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">5. Limitation of Liability</h2>
                <p className="text-sm text-muted">To the fullest extent permitted by law, KAGOZ is not liable for any damages arising out of your use of the platform.</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">6. Termination</h2>
                <p className="text-sm text-muted">We reserve the right to suspend or terminate your access to KAGOZ at our sole discretion, without prior notice.</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">7. Changes to Terms</h2>
                <p className="text-sm text-muted">We may update these Terms of Service from time to time. Continued use of KAGOZ signifies your acceptance of any changes.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-black mb-4">8. Contact Us</h2>
                <p className="text-sm text-muted">If you have questions about these Terms of Service, please contact us:</p>
                <address className="text-sm text-muted">
                    <strong>KAGOZ Support Team</strong><br />
                    Email: [Insert Contact Email]<br />
                    Address: [Insert Physical Address]
                </address>
            </section>
        </div>
    );
};

export default TermsOfService;