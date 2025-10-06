import { Metadata } from "next";
import BusinessDashboardLayout from "./_components/layout/dashboard-layout";


export const metadata: Metadata = {
  title: "Kagoz",
    description: "Business Dashboard",
};

export default function Layout({ children }: React.PropsWithChildren) {
  return (
 
      <BusinessDashboardLayout>
        {children}
      </BusinessDashboardLayout>
   
  )
}