import {
  DashboardSideBar,
  HeaderBar,
} from "@/components/sidebar/dashboard-side-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authOption } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOption)
  if(!session) {
    redirect("/login")
  }
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
