import React from "react";
import FooterTwo from "../widget/footer-2";
import FooterFour from "../widget/footer-4";
import dynamic from "next/dynamic";
const FooterOne = dynamic(() => import('../widget/footer-1'))

const Footer = () => {
  return (
    <footer className="bg-[#190C2B]">
      <div className="container py-[7rem]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-[6rem] gap-x-8 text-white items-center">
          <FooterOne />
          <FooterTwo />
          <FooterTwo />
          <FooterFour />
        </div>
      </div>
      <div className="py-12 bg-[#130921]">
        <p className="text-xs md:text-sm text-white text-center">
          &copy; 2024-{new Date().getFullYear()} KAGOZ LTD. KAGOZ, and related marks are registered
          trademarks of KAGOZ.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
