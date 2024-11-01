import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function BlogCard() {
  return (
    <Card className="border-none rounded-smd !p-[1.2rem]">
      <CardContent className="p-0 space-y-[1.6rem]">
        <div className="w-full h-full min-h-[20rem] relative">
          <Image
            src="/images/blog.png"
            className="object-cover rounded-sm"
            alt="blog"
            fill
          />
        </div>
        <div className="space-y-[1.2rem]">
          <div>
            <div className="flex space-x-[.8rem] items-center">
              <svg
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_73_680)">
                  <path
                    d="M0.409547 11.1914H11.1288C11.2249 11.1914 11.3178 11.1577 11.3915 11.0964C11.4945 11.0102 13.8431 8.98982 13.9863 4.62857H2.47404C2.33138 8.58741 0.168446 10.4482 0.145969 10.4667C0.0141932 10.5781 -0.0342895 10.76 0.0249945 10.9218C0.0838682 11.0832 0.237301 11.1914 0.409547 11.1914ZM13.5898 2.16752H11.5389V1.75734C11.5389 1.52764 11.3584 1.34717 11.1288 1.34717C10.8991 1.34717 10.7186 1.52764 10.7186 1.75734V2.16752H8.64036V1.75734C8.64036 1.52764 8.45988 1.34717 8.23018 1.34717C8.00049 1.34717 7.82001 1.52764 7.82001 1.75734V2.16752H5.76914V1.75734C5.76914 1.52764 5.58866 1.34717 5.35896 1.34717C5.12926 1.34717 4.94879 1.52764 4.94879 1.75734V2.16752H2.89791C2.66821 2.16752 2.48774 2.34799 2.48774 2.57769V3.80822H14V2.57769C14 2.34799 13.8195 2.16752 13.5898 2.16752Z"
                    fill="#6F00FF"
                  />
                  <path
                    d="M11.9178 11.7255C11.6951 11.911 11.4155 12.012 11.1283 12.012H2.4873V13.2425C2.4873 13.4692 2.67076 13.6527 2.89748 13.6527H13.5894C13.8161 13.6527 13.9995 13.4692 13.9995 13.2425V8.64453C13.2087 10.5847 12.1052 11.5687 11.9178 11.7255Z"
                    fill="#6F00FF"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_73_680">
                    <rect
                      width="14"
                      height="14"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <p className="text-black font-normal">03 Jun 2024</p>
            </div>
            <Link href={"/"} className="text-black">
              <h2 className="text-[2.1rem] font-bold">
                How to design your site foot...
              </h2>
            </Link>
          </div>
          <div className="space-y-[.8rem]">
            <p className="text-muted text-sm leading-md">
              Turn your ideas into a thriving startup with our expert guidance.
            </p>
            <Link
              className="flex items-center font-medium space-x-[.8rem]"
              href={"/"}
            >
              Read More <ChevronRight />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
