import Link from "next/link";

export default function FooterTwo() {
  return (
    <div className="space-y-md">
      <h2 className="text-md font-bold">About</h2>
      <div className="space-y-[2rem] flex flex-col">
        <Link rel="nofollow" href={"/about-us"}>
          About
        </Link>
        <Link rel="nofollow" href={"/blog"}>
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
