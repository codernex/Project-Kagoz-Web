import { Metadata } from "next";
import BusinessDashboardLayout from "./dashboard-layout";

export const meta: Metadata = {
  robots: {
    index: false,
    follow: false
  },
}

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div>
      <BusinessDashboardLayout>
        {children}
      </BusinessDashboardLayout>
    </div>
  )
}