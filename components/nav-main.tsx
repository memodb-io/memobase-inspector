"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";

import {
  BookText,
  ArrowUpRight,
  Play,
  Github,
  PenTool,
  LayoutDashboard,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function NavMain() {
  const pathname = usePathname();
  const t = useTranslations("navigation");

  const items = [
    {
      title: t("github"),
      url: "https://github.com/memodb-io/memobase",
      icon: Github,
    },
    {
      title: t("docs"),
      url: "https://docs.memobase.io/",
      icon: BookText,
    },
    {
      title: t("dashboard"),
      url: "https://app.memobase.io/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t("playground"),
      url: "https://app.memobase.io/playground",
      icon: Play,
    },
    {
      title: t("configTool"),
      url: "https://app.memobase.io/playground/config-tool",
      icon: PenTool,
    },
  ];

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title} className="group/item">
          <SidebarMenuButton asChild isActive={pathname === item.url}>
            <Link href={item.url} target="_blank">
              <item.icon />
              <span>{item.title}</span>
              {pathname !== item.url && (
                <ArrowUpRight className="invisible ml-auto h-4 w-4 shrink-0 opacity-50 group-hover/item:visible" />
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
