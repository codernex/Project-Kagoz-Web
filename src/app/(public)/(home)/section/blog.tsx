import BlogCard from "@/components/shared/blog-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Blog() {
  return (
    <section id="blog" className="section_padding bg-bgPrimaryShade">
      <div className="container space-y-[6rem]">
        <div className="max-w-7xl mx-auto">
          <h2 className="section_title">Our Blogs</h2>
          <p className="text-sm text-muted leading-md text-center mt-[2.4rem]">
            Turn your ideas into a thriving startup with our expert guidance.
            Learn essential strategies to navigate the startup journey and
            transform your vision into reality. Start building your future today
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[4rem]">
          {Array.from({ length: 4 }).map((_, index) => {
            return <BlogCard key={index} />;
          })}
        </div>
        <div className="flex justify-center">
          <Button
            asChild
            className="rounded-xl h-[4rem] w-[14rem] md:h-[5rem] md:w-[17.5rem] md:text-sm bg-primary text-white"
          >
            <Link
              className="text-xsm flex items-center space-x-2"
              href={"/blogs"}
            >
              <span>View All Blogs</span>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.135 2.21656C10.1368 2.21834 10.1386 2.22016 10.1404 2.22198L15.7414 7.81561C15.7856 7.86005 15.8248 7.90916 15.8585 7.96205L15.9464 8.12311L15.983 8.23293V8.31348C16.0057 8.4369 16.0057 8.56343 15.983 8.68688V8.76008V8.84794L15.9171 8.97242C15.8794 9.04178 15.8326 9.10582 15.778 9.16279L10.1404 14.7784C9.76735 15.1544 9.16006 15.1569 8.78402 14.7838C8.78221 14.782 8.78042 14.7802 8.7786 14.7784C8.41694 14.3993 8.41694 13.803 8.7786 13.4239L12.1172 10.078C12.2588 9.93361 12.2565 9.70182 12.1121 9.56028C12.0449 9.49442 11.955 9.45695 11.861 9.45564H0.959208C0.429484 9.45568 4.3869e-05 9.0263 9.53674e-06 8.49658C-2.47955e-05 7.96685 0.429347 7.53745 0.959071 7.53738H0.959208L11.861 7.53738C12.0631 7.53453 12.2247 7.36835 12.2219 7.16621C12.2205 7.07217 12.1831 6.98222 12.1172 6.91506L8.7786 3.58375C8.41227 3.20373 8.41227 2.60197 8.7786 2.22195C9.15166 1.84591 9.75894 1.84347 10.135 2.21656Z"
                  fill="white"
                />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
