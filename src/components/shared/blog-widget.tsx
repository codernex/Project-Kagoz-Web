"use client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const BlogWidget = () => {
  return (
    <div>
      <h2 className="text-md md:text-[2.8rem] font-semibold pb-[2.4rem] text-black">
        Recent Blogs
      </h2>
      <div className="space-y-[4rem]">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex space-x-[2rem]">
            <div className="w-[15rem] h-[8rem] relative rounded-[.8rem] overflow-hidden">
              <Image
                src={"/images/blog.png"}
                objectFit="cover"
                fill
                alt={"Blog"}
              />
            </div>
            <div>
              <div className="text-xsm flex items-center space-x-2">
                <svg
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.409547 10.1918H11.1288C11.2249 10.1918 11.3178 10.1582 11.3915 10.0969C11.4945 10.0107 13.8431 7.9903 13.9863 3.62905H2.47404C2.33138 7.58789 0.168446 9.44867 0.145969 9.46723C0.0141932 9.57858 -0.0342895 9.76045 0.0249945 9.92228C0.0838682 10.0837 0.237301 10.1918 0.409547 10.1918ZM13.5898 1.16801H11.5389V0.757831C11.5389 0.528133 11.3584 0.347656 11.1288 0.347656C10.8991 0.347656 10.7186 0.528133 10.7186 0.757831V1.16801H8.64036V0.757831C8.64036 0.528133 8.45988 0.347656 8.23018 0.347656C8.00049 0.347656 7.82001 0.528133 7.82001 0.757831V1.16801H5.76914V0.757831C5.76914 0.528133 5.58866 0.347656 5.35896 0.347656C5.12926 0.347656 4.94879 0.528133 4.94879 0.757831V1.16801H2.89791C2.66821 1.16801 2.48774 1.34848 2.48774 1.57818V2.8087H14V1.57818C14 1.34848 13.8195 1.16801 13.5898 1.16801Z"
                    fill="#6F00FF"
                  />
                  <path
                    d="M11.9178 10.7255C11.6951 10.911 11.4155 11.012 11.1283 11.012H2.4873V12.2425C2.4873 12.4692 2.67076 12.6527 2.89748 12.6527H13.5894C13.8161 12.6527 13.9995 12.4692 13.9995 12.2425V7.64453C13.2087 9.58468 12.1052 10.5687 11.9178 10.7255Z"
                    fill="#6F00FF"
                  />
                </svg>
                <span className="text-muted">03 Jun 2024</span>
              </div>
              <h2 className="text-xsm md:text-[2rem] text-black font-bold">
                Where to grow your business as a photographer: site or social
                media?
              </h2>
              <Link
                rel="nofollow"
                href={"/"}
                className="flex items-center mt-4 text-xsm md:text-sm"
              >
                Read More <ChevronRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
