import { Metadata } from "next";
import BusinessDashboardLayout from "./_components/layout/dashboard-layout";
import DashboardErrorBoundary from "@/components/dashboard-error-boundary";


export const metadata: Metadata = {
  title: "Kagoz",
    description: "Business Dashboard",
};

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <DashboardErrorBoundary>
      <BusinessDashboardLayout>
        {children}
      </BusinessDashboardLayout>
    </DashboardErrorBoundary>
  )
}