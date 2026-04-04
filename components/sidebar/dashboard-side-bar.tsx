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
import { Book, LibraryBig, School, Settings, User } from "lucide-react";
import Link from "next/link";
import { AvatarFallback, AvatarBadge, Avatar } from "../ui/avatar";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
} from "../ui/dropdown-menu";
import { DropdownMenuItemLogOut } from "./drop-drown-menu-avatar";

export function DashboardSideBar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarGroupLabel>Registrar</SidebarGroupLabel>
            <SidebarMenuButton asChild pathname="/subjects">
              <Link href={"/subjects"}>
                <Book /> Subjects
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton asChild pathname="/curriculum">
              <Link href={"/curriculum"}>
                <LibraryBig /> Curriculum
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Students</SidebarGroupLabel>
          <SidebarMenuButton>
            <School />
            Classroom
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenuButton asChild pathname="/enrollment-settings">
            <Link href={"/enrollment-settings"}>
              <Settings /> Enrollment Settings
            </Link>
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>R</AvatarFallback>
              <AvatarBadge className="bg-green-500"></AvatarBadge>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <User /> Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItemLogOut />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
