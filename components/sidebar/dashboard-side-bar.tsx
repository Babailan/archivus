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
import {
  Book,
  ClipboardList,
  LibraryBig,
  Settings,
  User,
  Users,
  Wallet,
} from "lucide-react";
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
import { Badge } from "../ui/badge";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getPendingEnrollmentCount } from "@/services/enrollment.service";
import { getPendingRollbackCount } from "@/services/rollback.service";

export async function DashboardSideBar() {
  const pendingCount = await getPendingEnrollmentCount();
  const pendingRollbackCount = await getPendingRollbackCount();
  const session = await getServerSession(authOption);
  const isAdmin = session?.user?.roles?.includes("admin");

  return (
    <Sidebar variant="inset">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Academic Affairs</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuButton
              pathname="/subjects"
              render={
                <Link href={"/subjects"}>
                  <Book /> Subjects
                </Link>
              }
            ></SidebarMenuButton>
            <SidebarMenuButton
              pathname="/curriculum"
              render={
                <Link href={"/curriculum"}>
                  <LibraryBig /> Curriculum
                </Link>
              }
            ></SidebarMenuButton>
            <SidebarMenuButton
              pathname="/users"
              render={
                <Link href={"/users"}>
                  <Users /> Users
                </Link>
              }
            />
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Registrar Office</SidebarGroupLabel>
          <SidebarMenuButton
            pathname="/enrollments"
            render={
              <Link href={"/enrollments"} className="relative">
                <ClipboardList /> Enrollments
                {pendingCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {pendingCount}
                  </Badge>
                )}
              </Link>
            }
          />
          <SidebarMenuButton
            pathname="/enrollment-settings"
            render={
              <Link href={"/enrollment-settings"}>
                <Settings /> Enrollment Settings
              </Link>
            }
          />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Finance</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuButton
              pathname="/payments"
              render={
                <Link href={"/payments"}>
                  <Wallet /> Payments
                </Link>
              }
            />
            {isAdmin && (
              <SidebarMenuButton
                pathname="/rollback-requests"
                render={
                  <Link href={"/rollback-requests"} className="relative">
                    <Wallet /> Rollback Requests
                    {pendingRollbackCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {pendingRollbackCount}
                      </Badge>
                    )}
                  </Link>
                }
              />
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

const roleColors: Record<string, string> = {
  admin: "bg-yellow-500",
  cashier: "bg-blue-500",
  registrar: "bg-green-500",
};

function getBadgeColor(roles: string[] | undefined): string {
  if (!roles || roles.length === 0) return "bg-gray-500";
  const firstRole = roles[0];
  return roleColors[firstRole] ?? "bg-gray-500";
}

export async function HeaderBar() {
  const session = await getServerSession(authOption);

  return (
    <div className="px-5 py-5 border-b-2 flex justify-between">
      <div>
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-5">
        {session?.user?.roles?.map((role) => (
          <Badge
            key={role}
            variant="default"
            className={cn(roleColors[role] ?? "bg-gray-500", "uppercase")}
          >
            {role}
          </Badge>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger
            nativeButton={false}
            render={
              <Avatar>
                <AvatarFallback>
                  {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
                <AvatarBadge
                  className={getBadgeColor(session?.user?.roles)}
                ></AvatarBadge>
              </Avatar>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-1">
                <span>{session?.user?.name}</span>
              </DropdownMenuLabel>
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
