"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangSwitch } from "@/components/lang-switch";
import { ProjectSwitch } from "@/components/project-switch";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex-1 flex items-center gap-2 px-3">
            <SidebarTrigger />
            <div className="flex-1" />
            <ThemeToggle />
            <LangSwitch />
            <ProjectSwitch />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
