import dynamic from "next/dynamic";
import Link from "next/link";
import FooterTwo from "../widget/footer-2";
import FooterFour from "../widget/footer-4";
const FooterOne = dynamic(() => import('../widget/footer-1'))

const Footer = () => {
  return (
    <footer className="bg-[#190C2B]">
      <div className="container py-[7rem]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-[6rem] gap-x-8 text-white items-start">
          <FooterOne />
          <FooterTwo />
          <FooterFour />
        </div>
      </div>
      <div className=" bg-[#130921]">
        <div className="py-12 container flex-col items-center flex lg:flex-row lg:justify-between gap-8 ">
          <p className="text-xs md:text-sm text-white text-center">
            &copy; 2024-{new Date().getFullYear()} KAGOZ LTD. KAGOZ, and related marks are registered
            trademarks of KAGOZ.
          </p>
          <div className="flex gap-4 text-white ">
            <Link className="hover:underline" rel="nofollow" href={"/privacy-policy"}>
              Privacy Policy
            </Link>
            <Link className="hover:underline" rel="nofollow" href={"/tos"}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
