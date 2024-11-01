import Image from "next/image";
import Link from "next/link";

export default function FooterTwo() {
  return (
    <div className="space-y-md">
      <h2 className="text-md font-bold">About</h2>
      <div className="space-y-[2rem] flex flex-col">
        <Link rel="nofollow" href={"/"}>
          About
        </Link>
        <Link rel="nofollow" href={"/"}>
          Careers
        </Link>
        <Link rel="nofollow" href={"/"}>
          Press
        </Link>
        <Link rel="nofollow" href={"/"}>
          Terms of Service
        </Link>
        <Link rel="nofollow" href={"/"}>
          Ad Policy
        </Link>
      </div>
    </div>
  );
}
