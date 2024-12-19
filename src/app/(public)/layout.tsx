import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { VerifyOtp } from "@/components/shared/otp-input";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <VerifyOtp />
    </>
  );
}
