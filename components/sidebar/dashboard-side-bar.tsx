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
  FileText,
  GalleryVerticalEnd,
  LayoutDashboard,
  LibraryBig,
  Settings,
  User,
  Users,
  Wallet,
} from "lucide-react";
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
import { getPendingRollbackCount, getPendingEnrollmentRollbackCount } from "@/services/rollback.service";
import { Button } from "../ui/button";

export async function DashboardSideBar() {
  const pendingCount = await getPendingEnrollmentCount();
  const pendingRollbackCount = await getPendingRollbackCount();
  const pendingEnrollmentRollbackCount = await getPendingEnrollmentRollbackCount();
  const session = await getServerSession(authOption);
  const isAdmin = session?.user?.roles?.includes("admin");
  const isRegistrar = session?.user?.roles?.includes("registrar");
  const isCashier = session?.user?.roles?.includes("cashier");

  return (
    <Sidebar variant="floating">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <div className="flex gap-2 items-center">
            <Button size="icon">
              <GalleryVerticalEnd />
            </Button>
            <span className="font-medium">Archivus Inc.</span>
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            <SidebarMenuButton
              href="/dashboard"
              pathname="/dashboard"
              icon={<LayoutDashboard />}
              title="Dashboard"
            />
          </SidebarMenu>
        </SidebarGroup>
        {(isAdmin || isRegistrar) && (
          <SidebarGroup>
            <SidebarGroupLabel>Academic Affairs</SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              <SidebarMenuButton
                href="/subjects"
                pathname="/subjects"
                icon={<Book />}
                title="Subjects"
              />
              <SidebarMenuButton
                href="/curriculum"
                pathname="/curriculum"
                icon={<LibraryBig />}
                title="Curriculum"
              />
              <SidebarMenuButton
                href="/users"
                pathname="/users"
                icon={<Users />}
                title="Users"
              />
            </SidebarMenu>
          </SidebarGroup>
        )}
        {(isAdmin || isRegistrar) && (
          <SidebarGroup>
            <SidebarGroupLabel>Registrar Office</SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              <SidebarMenuButton
                href="/student-verification"
                pathname="/student-verification"
                icon={<ClipboardList />}
                title="Student Verification"
                count={pendingCount}
              />
              <SidebarMenuButton
                href="/students"
                pathname="/students"
                icon={<Users />}
                title="Official Students"
              />
              <SidebarMenuButton
                href="/enrollments"
                pathname="/enrollments"
                icon={<LibraryBig />}
                title="Enrollments"
              />
              <SidebarMenuButton
                href="/enrollment-rollback-requests"
                pathname="/enrollment-rollback-requests"
                icon={<ClipboardList />}
                title="Enrollment Rollback"
                count={pendingEnrollmentRollbackCount}
              />
              <SidebarMenuButton
                href="/enrollment-settings"
                pathname="/enrollment-settings"
                icon={<Settings />}
                title="Enrollment Settings"
              />
              <SidebarMenuButton
                href="/documents"
                pathname="/documents"
                icon={<FileText />}
                title="Documents"
              />
            </SidebarMenu>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Finance</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {(isAdmin || isCashier) && (
              <SidebarMenuButton
                href="/payments"
                pathname="/payments"
                icon={<Wallet />}
                title="Payments"
              />
            )}
            {isAdmin && (
              <SidebarMenuButton
                href="/rollback-requests"
                pathname="/rollback-requests"
                icon={<Wallet />}
                title="Rollback Requests"
                count={pendingRollbackCount}
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
                <AvatarBadge className={getBadgeColor(session?.user?.roles)} />
              </Avatar>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-1">
                <span>{session?.user?.name}</span>
              </DropdownMenuLabel>
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