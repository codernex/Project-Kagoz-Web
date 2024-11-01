"use client";
import Search from "@/components/shared/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
// import Swiper core and required modules
import { Autoplay, Parallax } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
const Hero = () => {
  return (
    <section id="hero" className="container ">
      <div className="hero_gradient rounded-[2.8rem] relative text-white w-full shadow-md ">
        <div className="w-full max-w-2xl md:max-w-5xl lg:max-w-7xl mx-auto pt-[9.6rem] text-center ">
          <h1 className=" text-md md:text-xl text-white font-bold md:leading-[5.56rem] ">
            Your Business, Our Platform <br />
            {"Let's"} Grow Together
          </h1>
          <p className="text-xs md:text-sm text-white md:leading-[3rem] mt-[1.6rem]">
            Turn your ideas into a thriving startup with our expert guidance.
            Learn essential Turn your ideas the startup journey and transform
            your vision into reality Start building your
          </p>

          {/**Tabs */}
          <div className="mt-[4rem]">
            <Tabs defaultValue="category" className="space-y-0">
              <TabsList className="bg-black pt-6 px-4 pb-0 rounded-b-none w-[80%] mx-auto md:bg-transparent space-y-2 md:space-y-0 flex flex-col justify-center items-center md:flex-row md:!space-x-4 mb-0 md:pt-0 h-fit">
                <TabsTrigger value="category" className="hero_tab_list">
                  Find by Category
                </TabsTrigger>
                <TabsTrigger value="business" className="hero_tab_list">
                  Find by Business Name
                </TabsTrigger>
              </TabsList>
              <TabsContent className="mt-0 pt-0" value="category">
                <Search />
              </TabsContent>
              <TabsContent value="business" className="mt-0">
                <Search />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="w-full py-[8rem] max-w-[70%] mx-auto">
          <Swiper
            slidesPerView={9}
            className="mb-2"
            autoplay
            modules={[Parallax, Autoplay]}
            breakpoints={{
              320: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 5,
              },
              1024: {
                slidesPerView: 7,
              },
              1280: {
                slidesPerView: 9,
              },
            }}
          >
            {Array.from({ length: 20 }).map((_, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="w-full  flex justify-center">
                    <div className="relative rounded-full w-full h-[8rem] max-w-[8rem] overflow-hidden">
                      <Image
                        alt="Logo"
                        src={"/images/featured/logo.png"}
                        fill
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <p className="text-center font-normal">Featured Business</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
