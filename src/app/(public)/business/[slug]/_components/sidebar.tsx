"use client";
import { Button } from "@/components/shared/button";
import { Loader } from "@/components/shared/loader";
import { LockFunctionalities } from "@/components/shared/lock";
import { TextInput } from "@/components/shared/text-input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { isBlocked, trimToWordCount, trimUrlByScreen } from "@/lib/utils";
import { useClaimBusinessMutation, useGetBusinessBySlugQuery } from "@/redux/api";
import { ArrowRight, Edit2, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
const Sidebar = () => {
  const { slug } = useParams() as { slug: string };
  const { data, isLoading } = useGetBusinessBySlugQuery(slug);
  const [claimModal, setClaimModal] = useState(false);
  const [mobile, setMobile] = useState("");
  const [claimBusiness] = useClaimBusinessMutation();
  const claimForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
  useEffect(() => {
    if (data?.mobile) {
      setMobile(data.mobile.substring(0, 5) + " xxx xxx");
    }
  }, [data]);
  const block = isBlocked(data?.updatedAt)

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="rounded-smd bg-white lg:px-[2.4rem] lg:py-[3rem] lg:drop-shadow-md relative">
      <Button onClick={() => setClaimModal(true)} className="flex items-center justify-center space-x-3 rounded-xl p-[2rem] font-medium">
        <Edit2 />
        <span>Suggest an edit</span>
      </Button>

      <div className="mt-[4.8rem] space-y-[1.6rem] rounded-smd border border-[#6E677726] bg-[#6E677708] p-[2.4rem]">
        <h2 className="text-center text-[2rem] font-semibold text-black">
          Call Now For Booking
        </h2>

        <Button
          asChild
          className="flex items-center justify-center space-x-3 rounded-xl border border-primary bg-white p-[2rem] font-medium text-primary"
        >
          <Link href={`tel:${data?.mobile}`}>
            <PhoneCall />
            <span>Call Now</span>
          </Link>
        </Button>
      </div>
      <div className="mt-[1.6rem] space-y-[1.6rem] rounded-smd border border-[#6E677726] bg-[#6E677708] p-[2.4rem]">
        {data?.website && (
          <Link
            rel="nofollow"
            target="_blank"
            href={data.website}
            className="flex items-center justify-between rounded-xl border-none bg-[#6E67770D] p-[2rem] font-medium text-primary"
          >
            <span className="flex items-center space-x-[1.2rem] text-[#323031]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_299_2517)">
                  <path
                    d="M14.9829 13.3836C15.1407 12.2627 15.219 11.132 15.2173 10C15.219 8.86802 15.1407 7.73734 14.9829 6.61641H19.4145C20.1977 8.80415 20.1977 11.1958 19.4145 13.3836H14.9829ZM10.0005 20C9.02391 20 8.02704 18.9977 7.26259 17.2504C6.91337 16.4523 6.62899 15.5426 6.4161 14.5551H13.5849C13.372 15.5422 13.0876 16.452 12.7384 17.2504C11.9739 18.9977 10.977 20 10.0005 20ZM6.20204 13.3836C5.87287 11.1399 5.87287 8.86013 6.20204 6.61641H13.7989C13.9654 7.73655 14.0479 8.86756 14.0458 10C14.0479 11.1324 13.9654 12.2635 13.7989 13.3836H6.20204ZM0.586416 13.3836C-0.196774 11.1958 -0.196774 8.80415 0.586416 6.61641H5.01806C4.70504 8.86128 4.70504 11.1387 5.01806 13.3836H0.586416ZM10.0005 0C10.977 0 11.9739 1.00195 12.7384 2.74961C13.0876 3.54766 13.372 4.45742 13.5849 5.44492H6.4161C6.62899 4.45781 6.91337 3.54805 7.26259 2.74961C8.02704 1.00195 9.02391 0 10.0005 0ZM18.9067 5.44453H14.7809C14.5466 4.28438 14.2208 3.21367 13.8122 2.28047C13.4813 1.52344 13.1063 0.882422 12.6958 0.366016C14.027 0.734677 15.2668 1.37666 16.3362 2.25105C17.4056 3.12544 18.281 4.21304 18.9067 5.44453ZM7.30517 0.365625C6.89579 0.882422 6.52118 1.52305 6.18993 2.27969C5.78134 3.21367 5.45595 4.28438 5.22118 5.44375H1.09423C1.72009 4.21241 2.59559 3.12494 3.66493 2.25063C4.73428 1.37632 5.97402 0.734352 7.30517 0.365625ZM1.09423 14.5555H5.22001C5.45438 15.7156 5.78017 16.7863 6.18876 17.7195C6.52001 18.4762 6.89462 19.1168 7.30399 19.6336C5.97301 19.2648 4.73345 18.6228 3.6643 17.7485C2.59515 16.8742 1.71986 15.7868 1.09423 14.5555ZM12.6958 19.6336C13.1052 19.1168 13.4802 18.4762 13.811 17.7195C14.2196 16.7855 14.545 15.7148 14.7798 14.5555H18.9067C18.281 15.787 17.4056 16.8747 16.3362 17.7491C15.2669 18.6236 14.027 19.2656 12.6958 19.6344V19.6336Z"
                    fill="#323031"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_299_2517">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span>{trimUrlByScreen(data?.website)}</span>
            </span>
            <ArrowRight size={20} />
          </Link>
        )}

        {data?.mobile && (
          <Link
            href={"tel:" + data?.mobile || "01888 xxx xxx"}
            onMouseOver={() => {
              setMobile(data?.mobile || "01888 xxx xxx");
            }}
            onMouseLeave={() => {
              setMobile((data?.mobile.substring(0, 5) || "01888") + " xxx xxx");
            }}
            className="flex items-center justify-between rounded-xl border-none bg-[#6E67770D] p-[2rem] font-medium text-primary"
          >
            <span className="flex items-center space-x-[1.2rem] text-[#323031]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_299_2528)">
                  <path
                    d="M15.2051 13.2302C14.5517 12.5851 13.736 12.5851 13.0867 13.2302C12.5915 13.7213 12.0962 14.2124 11.6093 14.7118C11.4761 14.8491 11.3638 14.8782 11.2014 14.7867C10.881 14.6119 10.5397 14.4704 10.2317 14.2789C8.79592 13.3758 7.59315 12.2147 6.52773 10.9079C5.99918 10.2586 5.52889 9.56361 5.20011 8.78119C5.13352 8.62304 5.14601 8.519 5.27502 8.38998C5.77028 7.91137 6.25305 7.42028 6.73998 6.92918C7.41836 6.24665 7.41836 5.44758 6.73582 4.76088C6.34877 4.36967 5.96172 3.98678 5.57467 3.59557C5.17514 3.19604 4.77977 2.79234 4.37607 2.39697C3.72267 1.76021 2.90695 1.76021 2.25771 2.40113C1.75829 2.89223 1.27968 3.39581 0.771944 3.87858C0.301659 4.32389 0.0644358 4.86909 0.014494 5.50584C-0.0645804 6.54214 0.18929 7.52016 0.547206 8.47322C1.27968 10.4459 2.39505 12.198 3.74764 13.8045C5.57467 15.977 7.75546 17.6958 10.3067 18.936C11.4553 19.4937 12.6456 19.9224 13.9399 19.9931C14.8305 20.0431 15.6046 19.8183 16.2247 19.1233C16.6493 18.6488 17.1279 18.216 17.5773 17.7624C18.2432 17.0882 18.2474 16.2725 17.5857 15.6066C16.7949 14.8117 16 14.0209 15.2051 13.2302Z"
                    fill="#323031"
                  />
                  <path
                    d="M14.4103 9.91321L15.946 9.65102C15.7047 8.24016 15.0388 6.96249 14.0274 5.94701C12.9579 4.87742 11.6053 4.20321 10.1153 3.99512L9.89893 5.53915C11.0517 5.70146 12.1005 6.22169 12.9287 7.04989C13.7111 7.83231 14.223 8.82282 14.4103 9.91321Z"
                    fill="#323031"
                  />
                  <path
                    d="M16.8114 3.23789C15.0384 1.46496 12.7952 0.34543 10.319 0L10.1025 1.54403C12.2417 1.84368 14.1811 2.81338 15.7127 4.34077C17.1651 5.79324 18.1182 7.6286 18.4636 9.64708L19.9993 9.38488C19.5956 7.04595 18.4928 4.92342 16.8114 3.23789Z"
                    fill="#323031"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_299_2528">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span>{mobile}</span>
            </span>
            <ArrowRight size={20} />
          </Link>
        )}

        {(data?.streetAddress || data?.city || data?.state) && (
          <Button className="flex items-start justify-between rounded-xs border-none bg-[#6E67770D] p-[2rem] font-medium text-primary">
            <span className="flex items-start space-x-[1.2rem] text-[#323031]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.99999 1C8.21051 1.00237 6.495 1.71429 5.22965 2.97965C3.96429 4.245 3.25237 5.96051 3.25 7.74999C3.25 12.5959 9.53874 18.6653 9.80593 18.9212C9.8579 18.9717 9.92752 19 9.99999 19C10.0725 19 10.1421 18.9717 10.1941 18.9212C10.4612 18.6653 16.75 12.5959 16.75 7.74999C16.7476 5.96051 16.0357 4.245 14.7703 2.97965C13.505 1.71429 11.7895 1.00237 9.99999 1ZM9.99999 10.8437C9.38811 10.8437 8.78996 10.6623 8.2812 10.3223C7.77244 9.9824 7.3759 9.49923 7.14174 8.93392C6.90759 8.36861 6.84632 7.74656 6.96569 7.14643C7.08506 6.5463 7.37971 5.99505 7.81238 5.56238C8.24505 5.12971 8.7963 4.83506 9.39643 4.71569C9.99656 4.59632 10.6186 4.65759 11.1839 4.89174C11.7492 5.1259 12.2324 5.52244 12.5723 6.0312C12.9123 6.53996 13.0937 7.13811 13.0937 7.74999C13.0932 8.57035 12.7671 9.35698 12.1871 9.93706C11.607 10.5171 10.8204 10.8432 9.99999 10.8437Z"
                  fill="#323031"
                />
              </svg>

              <span className="max-w-[28rem] text-start">
                {data?.streetAddress ||
                  "N/A" + ", " + data?.city ||
                  "N/A" + ", " + data?.state ||
                  "N/A"}
              </span>
            </span>
            <ArrowRight size={20} />
          </Button>
        )}

        <div className="flex justify-center gap-x-[2rem]">
          {data?.facebook ? (
            <Link target="_blank" rel="nofollow" href={data.facebook}>
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="46" height="46" rx="23" fill="#0862F6" />
                <path
                  d="M20.6959 24.2478H18.3199C17.9359 24.2478 17.8159 24.1038 17.8159 23.7438V20.8398C17.8159 20.4558 17.9599 20.3358 18.3199 20.3358H20.6959V18.2238C20.6959 17.2638 20.8639 16.3518 21.3439 15.5118C21.8479 14.6478 22.5679 14.0718 23.4799 13.7358C24.0799 13.5198 24.6799 13.4238 25.3279 13.4238H27.6799C28.0159 13.4238 28.1599 13.5678 28.1599 13.9038V16.6398C28.1599 16.9758 28.0159 17.1198 27.6799 17.1198C27.0319 17.1198 26.3839 17.1198 25.7359 17.1438C25.0879 17.1438 24.7519 17.4558 24.7519 18.1278C24.7279 18.8478 24.7519 19.5438 24.7519 20.2878H27.5359C27.9199 20.2878 28.0639 20.4318 28.0639 20.8158V23.7198C28.0639 24.1038 27.9439 24.2238 27.5359 24.2238H24.7519V32.0478C24.7519 32.4558 24.6319 32.5998 24.1999 32.5998H21.1999C20.8399 32.5998 20.6959 32.4558 20.6959 32.0958V24.2478Z"
                  fill="white"
                />
              </svg>
            </Link>
          ) : null}
          {data?.youtube ? (
            <Link target="_blank" rel="nofollow" href={data.youtube}>
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="46" height="46" rx="23" fill="#DF2016" />
                <g clipPath="url(#clip0_299_2557)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M30.7525 15.9023H15.2477C14.5192 15.9031 13.8208 16.1929 13.3057 16.708C12.7906 17.2231 12.5008 17.9215 12.5 18.65V28.2247C12.5008 28.9531 12.7905 29.6515 13.3057 30.1667C13.8208 30.6818 14.5192 30.9715 15.2476 30.9723H30.7525C31.481 30.9715 32.1794 30.6818 32.6945 30.1666C33.2095 29.6515 33.4992 28.9531 33.5 28.2247V18.65C33.4992 17.9215 33.2095 17.2231 32.6944 16.708C32.1793 16.1929 31.4809 15.9032 30.7525 15.9023H30.7525ZM26.7078 22.8688C26.8076 22.9265 26.8904 23.0094 26.948 23.1091C27.0056 23.2089 27.0359 23.3221 27.0359 23.4373C27.0359 23.5525 27.0056 23.6657 26.948 23.7655C26.8904 23.8653 26.8076 23.9482 26.7078 24.0058L21.6702 26.9142C21.5705 26.9718 21.4573 27.0021 21.3421 27.0021C21.2269 27.0021 21.1137 26.9718 21.0139 26.9142C20.9142 26.8566 20.8313 26.7737 20.7737 26.6739C20.7161 26.5741 20.6858 26.4609 20.6859 26.3457V20.5289C20.6858 20.4137 20.7161 20.3005 20.7737 20.2007C20.8313 20.1009 20.9142 20.0181 21.0139 19.9605C21.1137 19.9029 21.2269 19.8725 21.3421 19.8725C21.4573 19.8725 21.5705 19.9028 21.6702 19.9604L26.7078 22.8688Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_299_2557">
                    <rect
                      width="21"
                      height="16.625"
                      fill="white"
                      transform="translate(12.5 14.6875)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Link>
          ) : null}
          {data?.instagram ? (
            <Link target="_blank" rel="nofollow" href={data.instagram}>
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="46"
                  height="46"
                  rx="23"
                  fill="url(#paint0_linear_299_2562)"
                />
                <path
                  d="M23 19.9434C21.3134 19.9434 19.9434 21.3134 19.9434 23C19.9434 24.6867 21.3134 26.06 23 26.06C24.6867 26.06 26.06 24.6867 26.06 23C26.06 21.3134 24.6867 19.9434 23 19.9434Z"
                  fill="white"
                />
                <path
                  d="M27.6132 14.667H18.3865C16.3365 14.667 14.6665 16.337 14.6665 18.387V27.6137C14.6665 29.667 16.3365 31.3337 18.3865 31.3337H27.6132C29.6665 31.3337 31.3332 29.667 31.3332 27.6137V18.387C31.3332 16.337 29.6665 14.667 27.6132 14.667ZM22.9998 28.4003C20.0232 28.4003 17.5998 25.977 17.5998 23.0003C17.5998 20.0237 20.0232 17.6037 22.9998 17.6037C25.9765 17.6037 28.3998 20.0237 28.3998 23.0003C28.3998 25.977 25.9765 28.4003 22.9998 28.4003ZM28.5132 18.5837C27.8832 18.5837 27.3698 18.0737 27.3698 17.4437C27.3698 16.8137 27.8832 16.3003 28.5132 16.3003C29.1432 16.3003 29.6565 16.8137 29.6565 17.4437C29.6565 18.0737 29.1432 18.5837 28.5132 18.5837Z"
                  fill="white"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_299_2562"
                    x1="23"
                    y1="0"
                    x2="23"
                    y2="46"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#7028CE" />
                    <stop offset="0.5" stopColor="#ED2A7C" />
                    <stop offset="1" stopColor="#F9CB35" />
                  </linearGradient>
                </defs>
              </svg>
            </Link>
          ) : null}
          {data?.linkedin ? (
            <Link target="_blank" rel="nofollow" href={data.linkedin}>
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="46" height="46" rx="23" fill="#0073AF" />
                <g clipPath="url(#clip0_299_2567)">
                  <path
                    d="M16.3991 14.0127C15.0772 14.0127 14.001 15.0888 14 16.4117C14 17.7346 15.0763 18.8109 16.3991 18.8109C17.7215 18.8109 18.7972 17.7346 18.7972 16.4117C18.7972 15.0889 17.7215 14.0127 16.3991 14.0127ZM18.1997 19.7748H14.5983C14.5575 19.7748 14.5172 19.7829 14.4795 19.7985C14.4419 19.8141 14.4077 19.8369 14.3789 19.8657C14.35 19.8945 14.3272 19.9288 14.3116 19.9664C14.296 20.0041 14.288 20.0444 14.288 20.0852V31.6771C14.288 31.7594 14.3207 31.8383 14.3789 31.8965C14.4371 31.9547 14.516 31.9874 14.5983 31.9874H18.1996C18.2819 31.9874 18.3609 31.9547 18.419 31.8965C18.4772 31.8383 18.51 31.7594 18.51 31.6771V20.0852C18.51 20.0444 18.502 20.0041 18.4864 19.9664C18.4708 19.9287 18.448 19.8945 18.4192 19.8657C18.3904 19.8369 18.3561 19.814 18.3185 19.7984C18.2808 19.7828 18.2405 19.7748 18.1997 19.7748ZM27.4066 19.6384C26.0887 19.6384 24.9305 20.0397 24.2237 20.6941V20.0852C24.2237 19.9137 24.0848 19.7748 23.9134 19.7748H20.4587C20.418 19.7748 20.3776 19.7829 20.34 19.7985C20.3023 19.814 20.2681 19.8369 20.2393 19.8657C20.2105 19.8945 20.1876 19.9288 20.172 19.9664C20.1564 20.0041 20.1484 20.0444 20.1484 20.0852V31.6771C20.1484 31.7179 20.1564 31.7582 20.172 31.7959C20.1876 31.8335 20.2105 31.8677 20.2393 31.8965C20.2681 31.9254 20.3023 31.9482 20.34 31.9638C20.3776 31.9794 20.418 31.9874 20.4587 31.9874H24.0567C24.139 31.9874 24.2179 31.9547 24.2761 31.8965C24.3343 31.8383 24.367 31.7594 24.367 31.6771V25.942C24.367 24.2965 24.6697 23.2766 26.1802 23.2766C27.6684 23.2784 27.7797 24.3721 27.7797 26.0403V31.6771C27.7798 31.7179 27.7878 31.7582 27.8034 31.7959C27.819 31.8335 27.8419 31.8677 27.8707 31.8965C27.8995 31.9254 27.9337 31.9482 27.9714 31.9638C28.009 31.9794 28.0494 31.9874 28.0902 31.9874H31.6898C31.7721 31.9874 31.851 31.9547 31.9092 31.8965C31.9674 31.8383 32 31.7594 32.0001 31.6771V25.3184C32 22.6739 31.4779 19.6384 27.4066 19.6384Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_299_2567">
                    <rect
                      width="18"
                      height="18"
                      fill="white"
                      transform="translate(14 14)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Link>
          ) : null}
        </div>
      </div>

      <Dialog open={claimModal} onOpenChange={setClaimModal}>
        <DialogContent className="max-w-4xl !rounded-xs">
          <DialogHeader>
            <DialogTitle className="text-md text-black">
              Suggest an edit
            </DialogTitle>
            <DialogDescription className="text-muted">
              We will contact you if we need any more information
            </DialogDescription>
          </DialogHeader>
          <hr className="border-muted" />
          <Form {...claimForm}>
            <form
              className="space-y-4"
              onSubmit={claimForm.handleSubmit((d) => {
                claimBusiness({ slug, ...d });
                setClaimModal(false);
              })}
            >
              <TextInput
                required
                control={claimForm.control}
                label="Your name"
                name="name"
                placeholder="eg: John D."
              />
              <TextInput
                required
                control={claimForm.control}
                label="Your Email"
                name="email"
                placeholder="eg: johnd@example.com"
              />
              <TextInput
                required
                control={claimForm.control}
                label="Your Phone"
                name="phone"
                placeholder="eg: 018xx xxx xxx"
              />
              <Button className="h-16 max-w-[14rem]">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <LockFunctionalities locked={block} />
    </div>
  );
};

export default Sidebar;
