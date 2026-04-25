import type { Metadata } from "next";
import { Geist, Inter, Outfit, EB_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/session-provider";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Archivus",
    default: "Archivus",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", outfit.variable, garamond.variable)}
      suppressHydrationWarning
    >
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <Toaster richColors position="top-center" />
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
