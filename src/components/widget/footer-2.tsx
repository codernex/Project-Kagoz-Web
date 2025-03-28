import Link from "next/link";

export default function FooterTwo() {
  return (
    <div className="space-y-md col-span-1">
      <h2 className="text-md font-bold">Quick Links</h2>
      <div className="space-y-[2rem] flex flex-col">
        <Link rel="nofollow" href={"/about-us"}>
          About
        </Link>
        <Link rel="nofollow" href={"/contact-us"}>
          Contact Us
        </Link>
        <Link rel="nofollow" href={"/blogs"}>
          Press
        </Link>
        <Link rel="nofollow" href={"/privacy-policy"}>
          Privacy Policy
        </Link>
        <Link rel="nofollow" href={"/tos"}>
          Terms of Service
        </Link>
        <Link rel="nofollow" href={"/ads-policy"}>
          Ad Policy
        </Link>
      </div>
    </div>
  );
}
