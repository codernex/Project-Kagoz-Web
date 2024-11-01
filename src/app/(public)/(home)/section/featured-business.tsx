import FeaturedItem from "./components/featured-item";

export default function FeaturedBusiness() {
  return (
    <section className="container section_padding space-y-[6rem]">
      <div className="space-y-[2rem] max-w-7xl mx-auto">
        <h2 className="section_title">Featured Business</h2>
        <p className="text-xsm lg:text-sm text-muted text-center">
          Turn your ideas into a thriving startup with our expert guidance.
          Learn essential strategies to navigate the startup journey and
          transform your vision into reality. Start building your future today
        </p>
      </div>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-x-[3rem] gap-y-[3rem]">
        {Array.from({
          length: 6,
        }).map((_, index) => {
          return <FeaturedItem key={index} />;
        })}
      </div>
    </section>
  );
}
