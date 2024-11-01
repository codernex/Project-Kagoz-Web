import MobileBusinessSidebar from "./_components/mobile-sidebar";
import { Sidebar } from "./_components/sidebar";

export default async function BusinessDashboardLayout({
  children,
}: React.PropsWithChildren) {
  // if (!session || session.user.role !== 'user') {
  //     return redirect('/')
  // }

  return (
    <div>
      <MobileBusinessSidebar />
      <div className="container py-10 lg:flex lg:gap-md">
        <Sidebar />
        <main className="w-full px-">{children}</main>
      </div>
    </div>
  );
}
