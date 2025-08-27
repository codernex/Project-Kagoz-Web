import type { Metadata } from "next";
// import "../../app/globals.css";
// import "../../styles/globals.css";
import "@/styles/globals.css";
// import "./style.css";
import { ResetProvider } from "./_components/methodContext";
export const metadata: Metadata = {
  title: "KAGOZ",
  description: "A Next.js application for KAGOZ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`antialiased inter-font`}

      >
       <ResetProvider>
        {children}
       </ResetProvider>
      </body>
    // </html>
  );
}
