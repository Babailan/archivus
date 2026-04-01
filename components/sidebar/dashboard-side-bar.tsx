import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Book, LibraryBig, School } from "lucide-react";
import Link from "next/link";
import { AvatarDashboard } from "./avatar-dashboard";

export async function DashboardSideBar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Registrar</SidebarGroupLabel>
          <SidebarMenu>
            <Link href={"/subjects"}>
              <SidebarMenuButton>
                <Book /> Subjects
              </SidebarMenuButton>
            </Link>
          </SidebarMenu>
          <SidebarMenu>
            <Link href={"/curriculum"}>
              <SidebarMenuButton>
                <LibraryBig /> Curriculum
              </SidebarMenuButton>
            </Link>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Students</SidebarGroupLabel>
          <SidebarMenuButton>
            <School />
            Classroom
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
export function HeaderBar() {
  return (
    <div className="px-5 py-5 border-b-2 flex justify-between">
      <div>
        <SidebarTrigger />
      </div>
      <div>
        <AvatarDashboard />
      </div>
    </div>
  );
}
