import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AboutUs = () => {
  return (
    <section id="about" className="container bg-white section_padding">
      <div className="flex flex-col md:flex-row md:space-x-[2rem] lg:space-x-[8.7rem] items-center">
        <div className="w-full lg:w-1/2">
          <p className="text-primary text-smd lg:text-[2.1rem] font-medium">
            About us
          </p>
          <h2 className="section_title pt-4 text-left">
            Modern business must include <br /> it as a crucial element.
          </h2>
          <p className="text-muted text-xsm pt-[2.4rem]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget ex
            eros. Nunc et lorem quis tellus fermentum tincidunt. Mauris
            consequat ornare libero ut auctor Mauris laoreet{" "}
          </p>

          <div className="space-y-[2rem] py-[5.2rem]">
            <div className="flex space-x-[2rem]">
              <div className="rounded-[.8rem] w-[6rem] h-[6rem] bg-[#EEE7F7] border-[#6F00FF1F]">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="60" height="60" rx="8" fill="#EEE7F7" />
                  <rect
                    x="0.5"
                    y="0.5"
                    width="59"
                    height="59"
                    rx="7.5"
                    stroke="#6F00FF"
                    strokeOpacity="0.12"
                  />
                  <g clipPath="url(#clip0_73_1057)">
                    <path
                      d="M28.3716 23.0677C28.3716 22.7732 28.4086 22.4853 28.4841 22.2084H25.6458V23.9271H28.4841C28.4086 23.6502 28.3716 23.3623 28.3716 23.0677Z"
                      fill="#6F00FF"
                    />
                    <path
                      d="M37.3849 23.9614C36.1989 18.874 31.7131 15.3334 26.5052 15.3334C20.352 15.3334 15.3333 20.3521 15.3333 26.5052C15.3333 29.2896 16.3302 31.8161 18.0146 33.7755L23.9271 27.863V20.4896H32.0224L30.5443 21.9505C30.2521 22.2599 30.0975 22.6552 30.0975 23.0677C30.0975 23.4802 30.2521 23.8755 30.5443 24.1849L32.0224 25.6459H25.6458V27.863L33.2084 35.4256C35.9239 33.3974 37.6771 30.149 37.6771 26.5052C37.6771 25.5943 37.5739 24.7349 37.3849 23.9614ZM19.2177 35.0131C21.2093 36.7255 23.7277 37.6771 26.5052 37.6771C28.3787 37.6771 30.1489 37.213 31.7131 36.3709L24.7864 29.4443L19.2177 35.0131Z"
                      fill="#6F00FF"
                    />
                    <path
                      d="M41.1145 30.8793C41.0534 28.8973 40.421 27.0604 39.3439 25.5913C39.8707 33.2777 33.786 39.3959 26.5052 39.3959C26.0095 39.3959 25.7716 39.3514 25.5988 39.3407C25.6935 40.9253 25.6115 38.9909 25.6458 44.6667H34.2395V41.9748C38.264 43.0321 40.7129 42.8012 41.1145 42.8334V38.1689L44.6666 36.1002C44.4944 35.9283 41.197 33.3655 41.1145 30.8793Z"
                      fill="#6F00FF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_73_1057">
                      <rect
                        width="29.3333"
                        height="29.3333"
                        fill="white"
                        transform="translate(15.3333 15.3334)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div>
                <h3 className="text-primary font-semibold text-smd lg:text-[2.1rem]">
                  Our Ambitions
                </h3>
                <p className="text-muted text-xsm lg:text-sm lg:leading-[3rem]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                  eget ex eros. tellus fermentum tincidunt. Mauris consequat
                  ornare libero ut auctor{" "}
                </p>
              </div>
            </div>
            <div className="flex space-x-[2rem]">
              <div className="rounded-[.8rem] w-[6rem] h-[6rem] bg-[#EEE7F7] border-[#6F00FF1F]">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="60" height="60" rx="8" fill="#EEE7F7" />
                  <rect
                    x="0.5"
                    y="0.5"
                    width="59"
                    height="59"
                    rx="7.5"
                    stroke="#6F00FF"
                    strokeOpacity="0.12"
                  />
                  <g clipPath="url(#clip0_73_1057)">
                    <path
                      d="M28.3716 23.0677C28.3716 22.7732 28.4086 22.4853 28.4841 22.2084H25.6458V23.9271H28.4841C28.4086 23.6502 28.3716 23.3623 28.3716 23.0677Z"
                      fill="#6F00FF"
                    />
                    <path
                      d="M37.3849 23.9614C36.1989 18.874 31.7131 15.3334 26.5052 15.3334C20.352 15.3334 15.3333 20.3521 15.3333 26.5052C15.3333 29.2896 16.3302 31.8161 18.0146 33.7755L23.9271 27.863V20.4896H32.0224L30.5443 21.9505C30.2521 22.2599 30.0975 22.6552 30.0975 23.0677C30.0975 23.4802 30.2521 23.8755 30.5443 24.1849L32.0224 25.6459H25.6458V27.863L33.2084 35.4256C35.9239 33.3974 37.6771 30.149 37.6771 26.5052C37.6771 25.5943 37.5739 24.7349 37.3849 23.9614ZM19.2177 35.0131C21.2093 36.7255 23.7277 37.6771 26.5052 37.6771C28.3787 37.6771 30.1489 37.213 31.7131 36.3709L24.7864 29.4443L19.2177 35.0131Z"
                      fill="#6F00FF"
                    />
                    <path
                      d="M41.1145 30.8793C41.0534 28.8973 40.421 27.0604 39.3439 25.5913C39.8707 33.2777 33.786 39.3959 26.5052 39.3959C26.0095 39.3959 25.7716 39.3514 25.5988 39.3407C25.6935 40.9253 25.6115 38.9909 25.6458 44.6667H34.2395V41.9748C38.264 43.0321 40.7129 42.8012 41.1145 42.8334V38.1689L44.6666 36.1002C44.4944 35.9283 41.197 33.3655 41.1145 30.8793Z"
                      fill="#6F00FF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_73_1057">
                      <rect
                        width="29.3333"
                        height="29.3333"
                        fill="white"
                        transform="translate(15.3333 15.3334)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div>
                <h3 className="text-primary font-semibold text-smd lg:text-[2.1rem]">
                  Our Ambitions
                </h3>
                <p className="text-muted text-xsm lg:leading-[3rem]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                  eget ex eros. tellus fermentum tincidunt. Mauris consequat
                  ornare libero ut auctor{" "}
                </p>
              </div>
            </div>
          </div>
          <Button
            asChild
            className="rounded-xl h-[4rem] w-[14rem] md:h-[5rem] md:w-[17.5rem] md:text-sm bg-primary text-white"
          >
            <Link className="text-xsm" href={"/about-us"}>
              Discover More
            </Link>
          </Button>
        </div>
        <div className="w-full relative lg:w-1/2 h-[33rem] lg:h-[53rem] my-[5rem]">
          <Image src={"/images/about_right.png"} alt="about-us" fill />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
