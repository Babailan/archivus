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
import { Avatar, AvatarBadge, AvatarFallback } from "../ui/avatar";
import Link from "next/link";

export async function DashboardSideBar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Registrar</SidebarGroupLabel>
          <SidebarMenu>
            <Link href={"/subjects/list"}>
              <SidebarMenuButton>
                <Book /> Subjects
              </SidebarMenuButton>
            </Link>
          </SidebarMenu>
          <SidebarMenu>
            <Link href={"/curriculum/list"}>
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
        <Avatar>
          <AvatarFallback>R</AvatarFallback>
          <AvatarBadge className="bg-green-500"></AvatarBadge>
        </Avatar>
      </div>
    </div>
  );
}
