
import { AuthModal } from "@/components/shared/auth";
import { AuthProvider } from "@/context/AuthContext";
import ReduxWrapper from "@/redux/ReduxWrapper";
import "@/styles/globals.css";
import { type Metadata } from "next";
import { CookiesProvider } from 'next-client-cookies/server';
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "KAGOZ",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxWrapper>
          <CookiesProvider>
            <AuthProvider>
              <Toaster richColors position="bottom-right" duration={3000} />
              {children}
              <AuthModal />
            </AuthProvider>
          </CookiesProvider>
        </ReduxWrapper>
      </body>
    </html>
  );
}
