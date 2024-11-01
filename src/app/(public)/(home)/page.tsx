import AboutUs from "./section/about-us";
import Blog from "./section/blog";
import Category from "./section/category";
import FAQ from "./section/faq";
import FeaturedBusiness from "./section/featured-business";
import Hero from "./section/hero";
import WhyChooseUs from "./section/why-choose-us";

export default function Page() {
  return (
    <div className="w-full">
      <Hero />
      <Category />
      <AboutUs />
      <FeaturedBusiness />
      <WhyChooseUs />
      <FAQ />
      <Blog />
    </div>
  );
}
