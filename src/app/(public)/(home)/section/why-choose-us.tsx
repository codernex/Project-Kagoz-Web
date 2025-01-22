import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const WhyChooseUs = () => {
  return (
    <section id="about" className=" bg-bgPrimaryShade section_padding">
      <div className="container">
        <div className="flex flex-col md:flex-row md:space-x-[2rem] lg:space-x-[8.7rem] items-center">
          <div className="w-full relative lg:w-1/2 h-[33rem] lg:h-[53rem] my-[5rem]">
            <Image
              src={"/images/why_choose_us.png"}
              className="object-contain"
              alt="about-us"
              fill
              sizes="100%"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-[4.6rem]">
            <div>
              <h2 className="section_title pt-4 text-left">Why Choose us</h2>
              <p className="text-muted text-xsm pt-[2.4rem] leading-md">
                Kagoz offers reliable listings, advanced search, guest posting, and dedicated support to boost your business's online presence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 border border-muted border-r-0 border-l-0">
              <div className="text-center w-full py-[2.4rem]">
                <h2 className="text-lg font-bold text-primary">125k+</h2>
                <p className="text-[2.1rem] font-medium text-black">
                  Our Business Listings
                </p>
              </div>
              <div className="text-center w-full py-[2.4rem]">
                <h2 className="text-lg font-bold text-primary">50k+</h2>
                <p className="text-[2.1rem] font-medium text-black">
                  Completed Cases
                </p>
              </div>
              <div className="text-center w-full py-[2.4rem]">
                <h2 className="text-lg font-bold text-primary">50k+</h2>
                <p className="text-[2.1rem] font-medium text-black">
                  Happy Client
                </p>
              </div>
            </div>

            <div className="space-y-[4rem]">
              <div className="flex space-x-[2rem] items-center">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="60"
                    height="60"
                    rx="30"
                    fill="#6F00FF"
                    fillOpacity="0.08"
                  />
                  <rect
                    x="0.5"
                    y="0.5"
                    width="59"
                    height="59"
                    rx="29.5"
                    stroke="#6F00FF"
                    strokeOpacity="0.3"
                  />
                  <g clipPath="url(#clip0_73_592)">
                    <path
                      d="M27.1056 20.015L29.1211 17.9994V21.1513C29.1211 21.6373 29.5143 22.0305 30 22.0305C30.4859 22.0305 30.8791 21.6373 30.8791 21.1513V17.9995L32.8946 20.015C33.238 20.3584 33.7942 20.3584 34.1375 20.015C34.4808 19.6717 34.4808 19.1155 34.1375 18.7722L30.6226 15.2572C30.2795 14.9132 29.7185 14.9153 29.3774 15.2572L25.8625 18.7721C25.5192 19.1155 25.5192 19.6716 25.8625 20.0149C26.2059 20.3582 26.7622 20.3583 27.1056 20.0149V20.015ZM18.772 34.0789C19.1154 34.4222 19.6717 34.4222 20.0151 34.0789C20.3584 33.7355 20.3584 33.1794 20.0151 32.8358L17.9994 30.8203H21.1514C21.6373 30.8203 22.0305 30.4273 22.0305 29.9414C22.0305 29.4555 21.6373 29.0625 21.1514 29.0625H17.9995L20.0151 27.047C20.3584 26.7036 20.3584 26.1472 20.0151 25.8039C19.6717 25.4606 19.1155 25.4606 18.7722 25.8039L15.2573 29.3188C14.9169 29.6583 14.9116 30.2192 15.2573 30.5639L18.772 34.0789ZM38.8486 30.8205H42.0005L39.9849 32.836C39.6416 33.1794 39.6416 33.7356 39.9849 34.0789C40.3283 34.4222 40.8847 34.4222 41.228 34.0789L44.7429 30.5639C45.0831 30.2247 45.0883 29.6635 44.7429 29.3188L41.228 25.8041C40.8846 25.4606 40.3283 25.4606 39.9849 25.8041C39.6416 26.1474 39.6416 26.7036 39.9849 27.0469L42.0006 29.0625H38.8486C38.3627 29.0625 37.9697 29.4556 37.9697 29.9414C37.9697 30.4273 38.3627 30.8205 38.8486 30.8205H38.8486ZM23.0221 43.1263H36.9779C37.2302 43.1263 37.4698 43.0181 37.6371 42.8292C37.7194 42.7356 37.7809 42.6257 37.8176 42.5066C37.8543 42.3874 37.8653 42.2619 37.85 42.1382C37.3581 38.1914 33.983 35.2155 30 35.2155C26.017 35.2155 22.6419 38.1914 22.15 42.1382C22.1192 42.3889 22.1963 42.6404 22.3629 42.8292C22.4455 42.9226 22.547 42.9973 22.6606 43.0485C22.7742 43.0997 22.8974 43.1262 23.0221 43.1263ZM30 33.4575C32.4234 33.4575 34.395 31.4856 34.395 29.0625C34.395 26.6393 32.4234 24.6675 30 24.6675C27.5769 24.6675 25.605 26.6393 25.605 29.0625C25.605 31.4856 27.5769 33.4575 30 33.4575Z"
                      fill="#6F00FF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_73_592">
                      <rect
                        width="30"
                        height="30"
                        fill="white"
                        transform="translate(15 15)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div className="space-y-[1.2rem]">
                  <h3 className="text-[2rem] font-bold text-black">
                    Guidance and Structure
                  </h3>
                  <p className="text-muted text-sm">
                    It could provide a clear roadmap or plan to follow, making
                    the process
                  </p>
                </div>
              </div>
              <div className="flex space-x-[2rem] items-center">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="60"
                    height="60"
                    rx="30"
                    fill="#6F00FF"
                    fillOpacity="0.08"
                  />
                  <rect
                    x="0.5"
                    y="0.5"
                    width="59"
                    height="59"
                    rx="29.5"
                    stroke="#6F00FF"
                    strokeOpacity="0.3"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M36.7827 32.7115L37.8206 32.8263C38.1591 32.8631 38.4674 32.6175 38.505 32.2765C38.5426 31.9354 38.2944 31.6282 37.956 31.5902L36.918 31.4766C36.7601 31.4574 36.5908 31.5063 36.463 31.6105C36.0268 31.9639 36.2449 32.654 36.7827 32.7115ZM36.0306 34.7148C36.0268 34.8039 35.9365 35.0055 35.9065 35.0837C35.5755 35.9125 35.6131 36.0987 35.899 36.2367C36.1133 36.3397 36.369 36.2491 36.4706 36.0359L36.8504 35.2488C37.0046 34.9322 37.0798 34.6486 37.1099 34.2985L37.1701 33.6111C36.8241 33.5728 36.4932 33.5656 36.1773 33.4043L36.0306 34.7148ZM37.4671 26.466L38.505 26.5799C38.8472 26.6179 39.1518 26.3712 39.1894 26.0297C39.2281 25.6852 38.9796 25.3812 38.6404 25.3441L37.61 25.2294C37.4407 25.2121 37.2828 25.258 37.1512 25.3637C36.7112 25.7179 36.9331 26.4069 37.4671 26.466ZM37.012 30.63L38.05 30.744C38.3884 30.7816 38.6968 30.5338 38.7344 30.1938C38.772 29.8535 38.5238 29.5455 38.1853 29.5086L37.1474 29.3939C36.9857 29.3755 36.824 29.4232 36.6924 29.5282C36.2599 29.8726 36.4668 30.5706 37.012 30.63ZM37.2414 28.5486L38.2756 28.6625C38.6178 28.699 38.9262 28.4534 38.9638 28.1123C38.9976 27.7663 38.7494 27.4625 38.4147 27.4256L37.3768 27.3124C37.2189 27.2925 37.0534 27.3425 36.9217 27.4463C36.4893 27.7893 36.6961 28.4876 37.2414 28.5486ZM29.5623 26.5889C29.5134 26.331 29.7165 26.0857 29.9797 26.0857H32.033C32.3978 26.0857 32.6911 25.7909 32.6911 25.4284V25.3141C32.6911 24.9516 32.3977 24.6556 32.033 24.6556H29.457C29.3179 24.6556 29.2051 24.6891 29.0885 24.7669L26.0725 26.7784C25.5009 27.1609 25.1324 27.6693 24.9556 28.3353L24.3088 30.7612C24.1622 31.3088 23.9215 31.7616 23.5492 32.1884L19.845 36.4003L19.83 36.3789C18.5965 34.4812 17.8782 32.214 17.8782 29.7779C17.8782 25.0113 20.6406 20.7723 24.8578 18.7948C25.1587 19.187 25.6288 19.4401 26.159 19.4401C27.0578 19.4401 27.7873 18.7083 27.7873 17.8095C27.7873 16.9115 27.0578 16.1797 26.159 16.1797C25.1852 16.1797 24.4252 17.0254 24.5382 18.0081C20.0019 20.1195 17.0283 24.6717 17.0283 29.7779C17.0283 34.9523 20.0887 39.5734 24.745 41.6399L25.0873 40.8656L26.742 37.4848C27.0052 37.0734 27.3925 36.8692 27.7348 36.6898C28.0131 36.5417 28.2575 36.4131 28.3966 36.1916C28.8103 35.5444 28.9983 34.5738 29.2465 33.7931C29.5172 32.9714 29.7504 27.5851 29.5623 26.5889ZM42.9726 29.7779C42.9726 35.7789 38.8655 40.9394 33.1499 42.3649C33.0634 43.1825 32.3677 43.8207 31.5291 43.8207C30.6303 43.8207 29.897 43.0892 29.897 42.1908C29.897 41.2924 30.6303 40.5606 31.5291 40.5606C32.1872 40.5606 32.7588 40.9563 33.0183 41.5237C38.326 40.1642 42.1226 35.3638 42.1226 29.7779C42.1226 26.6281 40.9193 23.7205 38.8998 21.546C38.4598 22.1575 38.0687 22.9698 38.0123 23.6271L37.9483 24.4108L37.7001 24.3845C36.8916 24.2954 36.162 24.8832 36.0756 25.6868C36.0342 26.0768 36.1432 26.4615 36.3915 26.7687C36.3915 26.7706 36.3952 26.774 36.399 26.7762C36.3952 26.7785 36.3915 26.7796 36.3877 26.7819C36.0831 27.0286 35.8913 27.3787 35.8462 27.769C35.8048 28.1594 35.9176 28.543 36.1621 28.851C36.1659 28.8528 36.1659 28.8555 36.1696 28.8577C36.1658 28.86 36.1621 28.8622 36.1621 28.8634C36.0093 28.9839 35.8822 29.1337 35.7881 29.304C35.694 29.4743 35.6349 29.6617 35.6142 29.8552C35.5936 30.0487 35.6117 30.2443 35.6677 30.4307C35.7237 30.617 35.8163 30.7903 35.9402 30.9403C35.9364 30.943 35.9327 30.9437 35.9327 30.9463C35.6244 31.1931 35.4325 31.5432 35.3912 31.9335C35.3686 32.1144 35.3799 32.2948 35.4288 32.4671L35.1919 34.5474L34.4774 36.0359C34.3759 36.245 34.1164 36.3394 33.902 36.2367C33.7478 36.1604 33.7065 36.0855 33.6914 36.0366C33.6388 35.8757 33.7177 35.62 33.8305 35.3661L34.2254 34.5715L34.248 34.4568L34.4397 31.6717C34.4548 31.4374 34.278 31.2344 34.0449 31.2186C33.8079 31.2021 33.6087 31.3792 33.5898 31.6138L33.4056 34.3211L33.304 34.5151C33.2176 34.6735 33.1273 34.845 33.0483 35.0232L32.3488 36.4188C32.1006 36.9208 31.42 36.7599 31.3109 36.409C31.2582 36.2526 31.2921 36.0412 31.3635 35.8141L32.0856 34.3456L32.1194 34.2426L32.2096 31.6572C32.2171 31.4218 32.0329 31.2255 31.7997 31.2179C31.5666 31.2089 31.3635 31.3939 31.3597 31.6282L31.2808 34.053C31.2282 34.1482 31.1718 34.2561 31.1078 34.3678C30.9198 34.7149 30.7092 35.1041 30.5738 35.499L30.0887 36.497C29.9119 36.8565 29.4193 36.9396 29.1335 36.6154C29.5998 35.8723 29.7954 34.8852 30.0624 34.053C30.3294 33.2163 30.555 28.6968 30.4497 26.9368H32.0329C32.864 26.9368 33.5447 26.2595 33.5447 25.4284V25.3141C33.5447 24.4819 32.8641 23.805 32.0329 23.805H29.457C28.9192 23.805 28.6597 24.0291 28.246 24.3055L28.8741 22.7295C29.0847 22.194 29.4118 21.7965 29.8894 21.4772L31.0101 20.7303C31.5027 20.4028 31.8637 20.0113 32.1496 19.4965L33.0032 17.9588L33.3116 17.2308L33.3793 17.2496C36.102 17.9743 38.4673 19.5763 40.1709 21.7224C41.9271 23.9362 42.9726 26.7348 42.9726 29.7779Z"
                    fill="#6F00FF"
                  />
                </svg>

                <div className="space-y-[1.2rem]">
                  <h3 className="text-[2rem] font-bold text-black">
                    Community Support
                  </h3>
                  <p className="text-muted text-sm">
                    It could provide a clear roadmap or plan to follow, making
                    the process
                  </p>
                </div>
              </div>
              <div className="flex space-x-[2rem] items-center">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="60"
                    height="60"
                    rx="30"
                    fill="#6F00FF"
                    fillOpacity="0.08"
                  />
                  <rect
                    x="0.5"
                    y="0.5"
                    width="59"
                    height="59"
                    rx="29.5"
                    stroke="#6F00FF"
                    strokeOpacity="0.3"
                  />
                  <path
                    d="M25 34H23C22.7239 34 22.5 34.2239 22.5 34.5V43.5C22.5 43.7761 22.7239 44 23 44H25C25.2761 44 25.5 43.7761 25.5 43.5V34.5C25.5 34.2239 25.2761 34 25 34Z"
                    fill="#6F00FF"
                  />
                  <path
                    d="M18.5 37.5H16.5C16.2239 37.5 16 37.7239 16 38V43.5C16 43.7761 16.2239 44 16.5 44H18.5C18.7761 44 19 43.7761 19 43.5V38C19 37.7239 18.7761 37.5 18.5 37.5Z"
                    fill="#6F00FF"
                  />
                  <path
                    d="M31.5 30.5H29.5C29.2239 30.5 29 30.7239 29 31V43.5C29 43.7761 29.2239 44 29.5 44H31.5C31.7761 44 32 43.7761 32 43.5V31C32 30.7239 31.7761 30.5 31.5 30.5Z"
                    fill="#6F00FF"
                  />
                  <path
                    d="M16.5 29.5C16.5002 29.5654 16.5136 29.6301 16.5394 29.6903C16.5652 29.7504 16.6028 29.8047 16.65 29.85C16.7437 29.9433 16.8705 29.9956 17.0027 29.9956C17.135 29.9956 17.2618 29.9433 17.3555 29.85L23.1465 24.0615C23.2402 23.9679 23.3673 23.9154 23.4998 23.9154C23.6322 23.9154 23.7593 23.9679 23.853 24.0615L26.15 26.35C26.243 26.4425 26.3688 26.4943 26.5 26.4943C26.6312 26.4943 26.757 26.4425 26.85 26.35L30.6475 22.5575C30.7412 22.4639 30.8683 22.4114 31.0007 22.4114C31.1332 22.4114 31.2603 22.4639 31.354 22.5575L33.15 24.35C33.243 24.4425 33.3688 24.4943 33.5 24.4943C33.6312 24.4943 33.757 24.4425 33.85 24.35L39.65 18.553C39.7203 18.4841 39.8094 18.4375 39.9061 18.419C40.0028 18.4005 40.1028 18.411 40.1936 18.4491C40.2844 18.4872 40.3619 18.5513 40.4164 18.6333C40.4709 18.7153 40.5 18.8115 40.5 18.91V19.5C40.5 19.6326 40.5527 19.7598 40.6464 19.8536C40.7402 19.9473 40.8674 20 41 20C41.1326 20 41.2598 19.9473 41.3536 19.8536C41.4473 19.7598 41.5 19.6326 41.5 19.5V16.5C41.5 16.3674 41.4473 16.2402 41.3536 16.1464C41.2598 16.0527 41.1326 16 41 16H38C37.8674 16 37.7402 16.0527 37.6464 16.1464C37.5527 16.2402 37.5 16.3674 37.5 16.5C37.5 16.6326 37.5527 16.7598 37.6464 16.8536C37.7402 16.9473 37.8674 17 38 17H38.59C38.6889 17 38.7855 17.0294 38.8677 17.0843C38.9499 17.1392 39.014 17.2173 39.0518 17.3087C39.0897 17.4 39.0996 17.5005 39.0803 17.5975C39.061 17.6945 39.0134 17.7836 38.9435 17.8535L33.8535 22.9385C33.7598 23.0321 33.6327 23.0846 33.5002 23.0846C33.3678 23.0846 33.2407 23.0321 33.147 22.9385L31.35 21.15C31.2573 21.0572 31.1317 21.0049 31.0005 21.0044C30.8694 21.0039 30.7434 21.0554 30.65 21.1475L26.8525 24.94C26.7588 25.0336 26.6317 25.0861 26.4993 25.0861C26.3668 25.0861 26.2397 25.0336 26.146 24.94L23.85 22.65C23.8048 22.6028 23.7506 22.5651 23.6906 22.5394C23.6305 22.5136 23.5659 22.5002 23.5005 22.4999C23.4352 22.4997 23.3705 22.5127 23.3102 22.538C23.25 22.5634 23.1955 22.6006 23.15 22.6475L16.65 29.1475C16.6027 29.1932 16.565 29.248 16.5392 29.3085C16.5135 29.3691 16.5001 29.4342 16.5 29.5ZM43.29 31.65C43.2492 30.9363 42.9379 30.265 42.4196 29.7727C41.9013 29.2803 41.2149 29.0041 40.5 29H37.5C36.7851 29.0041 36.0987 29.2803 35.5804 29.7727C35.0621 30.265 34.7508 30.9363 34.71 31.65L34.01 36.33C34.0042 36.3765 34.0008 36.4232 34 36.47C34.0025 36.6964 34.0901 36.9136 34.2452 37.0786C34.4004 37.2435 34.6119 37.3441 34.8377 37.3605C35.0636 37.3768 35.2873 37.3077 35.4646 37.1669C35.6419 37.026 35.7599 36.8237 35.795 36.6L36.5 32.53V43.08C36.5025 43.3225 36.5973 43.5549 36.765 43.73C36.9397 43.9021 37.1748 43.999 37.42 44C37.6552 44.0007 37.8816 43.9106 38.052 43.7485C38.2224 43.5865 38.3238 43.3649 38.335 43.13L38.59 37.395C38.5973 37.2912 38.6436 37.194 38.7197 37.1231C38.7958 37.0521 38.896 37.0127 39 37.0127C39.104 37.0127 39.2042 37.0521 39.2803 37.1231C39.3564 37.194 39.4027 37.2912 39.41 37.395L39.665 43.13C39.6799 43.3648 39.7815 43.5858 39.95 43.75C40.0448 43.8395 40.1576 43.9077 40.2809 43.95C40.4043 43.9923 40.5352 44.0076 40.665 43.995C40.8997 43.9657 41.1151 43.8502 41.2694 43.6709C41.4237 43.4917 41.5059 43.2615 41.5 43.025V32.53L42.205 36.6C42.2401 36.8237 42.3581 37.026 42.5354 37.1669C42.7127 37.3077 42.9364 37.3768 43.1623 37.3605C43.3881 37.3441 43.5996 37.2435 43.7548 37.0786C43.9099 36.9136 43.9975 36.6964 44 36.47C43.9992 36.4232 43.9958 36.3765 43.99 36.33L43.29 31.65Z"
                    fill="#6F00FF"
                  />
                  <path
                    d="M39 28C40.1046 28 41 27.1046 41 26C41 24.8954 40.1046 24 39 24C37.8954 24 37 24.8954 37 26C37 27.1046 37.8954 28 39 28Z"
                    fill="#6F00FF"
                  />
                </svg>

                <div className="space-y-[1.2rem]">
                  <h3 className="text-[2rem] font-bold text-black">
                    Personal Growth
                  </h3>
                  <p className="text-muted text-sm">
                    It could provide a clear roadmap or plan to follow, making
                    the process
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
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
