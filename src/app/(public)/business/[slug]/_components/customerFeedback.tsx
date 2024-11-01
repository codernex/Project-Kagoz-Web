"use client";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import Player from "react-player";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Autoplay, Navigation } from "swiper/modules";
import { type Swiper as SwiperType } from "swiper/types";

export const CustomerFeedback = () => {
  const swiperRef = useRef<SwiperType>();
  const [videoUrl, setVideoUrl] = useState("");
  const [openPlayer, setOpenPlayer] = useState(false);
  return (
    <div className="bg-bgPrimaryShade p-[2.4rem] rounded-sm space-y-[2.4rem]">
      <div className="flex space-x-4 items-center">
        <h2 className="text-[2.4rem] font-bold text-black">
          Customer Feedback
        </h2>
        {/* <TooltipProvider>
                    <Tooltip
                        delayDuration={200}
                    >
                        <TooltipTrigger asChild>
                            <button>
                                <Info className="text-muted" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="w-[30rem] px-6 text-muted border-none font-bold">
                            Information provided here not verified by KAGOZ
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider> */}
      </div>
      <div className="flex items-center gap-x-[1.6rem]">
        <div className="w-fit">
          <button className="w-[3.6rem] text-muted h-[3.6rem] bg-white rounded-full flex items-center justify-center z-10">
            <ChevronLeft onClick={() => swiperRef.current?.slidePrev()} />
          </button>
        </div>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={3}
          className="mb-2 w-full"
          spaceBetween={20}
          autoplay
          grabCursor
          modules={[Autoplay, Navigation]}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 3,
            },
          }}
        >
          {Array.from({ length: 8 }).map((_, index) => {
            return (
              <SwiperSlide className="w-full" key={index}>
                <div className="w-full h-[20rem] relative rounded-[.8rem]  bg-white overflow-hidden flex items-center justify-center">
                  <Image
                    src={"/images/blog.png"}
                    alt="Business Image"
                    className="w-[10rem] h-[8rem] z-0"
                    fill
                  />
                  <div className="bg-[#00000080] z-20 relative w-full h-full" />
                  <div
                    onClick={() => {
                      setOpenPlayer(true);
                      setVideoUrl(
                        "https://youtu.be/3qWKKjIaeaM?si=neOtghtceIh_HTZl",
                      );
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                  >
                    <svg
                      width="45"
                      height="44"
                      viewBox="0 0 45 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.833496"
                        y="0.5"
                        width="43"
                        height="43"
                        rx="21.5"
                        fill="white"
                        fillOpacity="0.3"
                      />
                      <rect
                        x="0.833496"
                        y="0.5"
                        width="43"
                        height="43"
                        rx="21.5"
                        stroke="white"
                      />
                      <path
                        d="M33.8335 19.4019C35.8335 20.5566 35.8335 23.4434 33.8335 24.5981L18.8335 33.2583C16.8335 34.413 14.3335 32.9697 14.3335 30.6603L14.3335 13.3397C14.3335 11.0303 16.8335 9.58697 18.8335 10.7417L33.8335 19.4019Z"
                        fill="#D9D9D9"
                      />
                    </svg>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="w-fit">
          <button className="w-[3.6rem] h-[3.6rem] text-muted primary disabled:text-muted bg-white rounded-full flex items-center justify-center z-10">
            <ChevronRight onClick={() => swiperRef.current?.slideNext()} />
          </button>
        </div>
      </div>
      <Dialog open={openPlayer} onOpenChange={setOpenPlayer}>
        <DialogContent className="max-w-7xl p-0 rounded-md overflow-hidden border-none h-1/2 bg-[#00000080]">
          <DialogTitle className="hidden">Title</DialogTitle>
          <Player
            width={"100%"}
            height={"100%"}
            controls
            playing={openPlayer}
            url={videoUrl}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
