import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { DashboardSideBar, HeaderBar } from "../components/sidebar/dashboard-side-bar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Archivus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* <SidebarProvider>
            <NavigationBar />
            <SidebarInset>
              <HeaderBar/>
              {children}
            </SidebarInset>
          </SidebarProvider> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
