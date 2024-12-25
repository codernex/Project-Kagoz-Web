import { Metadata } from "next";
import BusinessDashboardLayout from "./dashboard-layout";

export const meta: Metadata = {
  robots: {
    index: false,
    follow: false
  },
}

export default function Layout() {
  return (
    <div>
      <BusinessDashboardLayout />
    </div>
  )
}