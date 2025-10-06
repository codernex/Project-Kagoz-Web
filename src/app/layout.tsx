
import { AuthModal } from "@/components/shared/auth";
import { AuthProvider } from "@/context/AuthContext";
import ReduxWrapper from "@/redux/ReduxWrapper";
import "@/styles/globals.css";
import { type Metadata } from "next";
import { CookiesProvider } from 'next-client-cookies/server';
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import GlobalErrorHandler from "@/components/global-error-handler";
import DOMManipulationFix from "@/components/dom-manipulation-fix";

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
      <head>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T8G3CJKC');`,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ReduxWrapper>
          <CookiesProvider>
            <AuthProvider>
              <GlobalErrorHandler />
              <DOMManipulationFix />
              <Toaster toastOptions={{
                className:"text-[18px]"
              }} richColors position="bottom-right" duration={4000} />
              {children}
              <AuthModal />
            </AuthProvider>
          </CookiesProvider>
        </ReduxWrapper>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T8G3CJKC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
      </body>
    </html>
  );
}
