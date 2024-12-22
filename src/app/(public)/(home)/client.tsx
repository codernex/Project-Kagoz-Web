"use client"
import dynamic from "next/dynamic";
const AboutUs = dynamic(() => import('./section/about-us'), { ssr: false })
const Blog = dynamic(() => import('./section/blog'), { ssr: false })
const Faq = dynamic(() => import('./section/faq'), { ssr: false })
const FeaturedBusiness = dynamic(() => import('./section/featured-business'), { ssr: false })
const WhyChooseUs = dynamic(() => import('./section/why-choose-us'), { ssr: false })
const Hero = dynamic(() => import('./section/hero'))
const Category = dynamic(() => import('./section/category'))
export default function HomePage() {
    return (
        <div className="w-full">
            <Hero />
            <Category />
            <AboutUs />
            <FeaturedBusiness />
            <WhyChooseUs />
            <Faq />
            <Blog />
        </div>
    );
}
