import {
  DashboardSideBar,
  HeaderBar,
} from "@/components/sidebar/dashboard-side-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="scheme-dark">
      <DashboardSideBar />
      <SidebarInset className="overflow-hidden">
        <HeaderBar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
