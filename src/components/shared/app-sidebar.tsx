"use client"

import * as React from "react";
import {
  BookOpen,
  CircleHelp,
  Combine,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Users
} from "lucide-react";
import { usePathname } from "next/navigation";
import { NavMain } from "@/components/shared/nav-main";
import { NavProjects } from "@/components/shared/nav-projects";
import { NavSecondary } from "@/components/shared/nav-secondary";
import { NavUser } from "@/components/shared/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";

type UserData = {
  name: string;
  email: string;
  avatar: string;
};

function getNavItems(t: ReturnType<typeof useTranslations>) {
  return [
    {
      title: t("dashboard"),
      url: "/admin/dashboard",
      icon: BookOpen,
      isActive: true
    },
    {
      title: t("users_management.title"),
      url: "/admin/users",
      icon: Users,
      isActive: true,
      items: [
        { title: t("users_management.list"), url: "/admin/users" }
      ],
    },
    {
      title: t("cards_management.title"),
      url: "/admin/cards",
      icon: Combine,
      items: [
        { title: t("cards_management.list"), url: "/admin/cards" }
      ],
    }
  ];
}

function getNavSecondary(t: ReturnType<typeof useTranslations>) {
  return [
    { title: t("support"), url: "#", icon: LifeBuoy },
    { title: t("feednack"), url: "#", icon: Send },
    { title: t("faq"), url: "#", icon: CircleHelp },
  ];
}


const projects = [
  { name: "Design Engineering", url: "#", icon: Frame },
  { name: "Sales & Marketing", url: "#", icon: PieChart },
  { name: "Travel", url: "#", icon: Map },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<UserData>({
    name: "",
    email: "",
    avatar: "/avatars/default.jpg", // Imagen por defecto si no hay avatar
  });

  const pathname = usePathname();

  const t = useTranslations("Admin.Sidebar");
  const rawNavMain = getNavItems(t);
  const navSecondary = getNavSecondary(t);

  // 🔥 Marca dinámicamente como activo según pathname
  const navMain = rawNavMain.map((item) => {
    const isMainActive =
      pathname === item.url ||
      pathname.startsWith(item.url + "/") ||
      item.items?.some((sub) => pathname === sub.url || pathname.startsWith(sub.url + "/"));

    const itemsWithIsActive = item.items?.map((sub) => ({
      ...sub,
      isActive:
        pathname === sub.url || pathname.startsWith(sub.url + "/"),
    }));

    return {
      ...item,
      isActive: isMainActive,
      items: itemsWithIsActive,
    };
  });

  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.name || "Usuario",
          email: parsedUser.email || "",
          avatar: parsedUser.avatar || "/avatars/default.jpg",
        });
      }
    } catch (error) {
      console.error("Error cargando usuario desde localStorage", error);
    }
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Rage Multiverse Admin</span>
                  <span className="truncate text-xs">MaxShDev</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavProjects projects={projects} /> */}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}