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
import { Book, LibraryBig, School, User } from "lucide-react";
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar suppressHydrationWarning>
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
