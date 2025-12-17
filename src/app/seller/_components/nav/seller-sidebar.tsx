"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Home,
  ShoppingCart,
  Store,
  Package,
  Inbox,
  ChevronUp,
  User2,
<<<<<<< HEAD
  CalendarSync,
=======
  CalendarSync
>>>>>>> 6a90052e4d9e52256d7fd2190bb9a9d59ca13308
} from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { ca } from "zod/v4/locales";

export function AppSidebar() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  
  // Menu items.
  const items = [
    { title: t("home"), url: "/seller", icon: Home },
    { title: t("orders"), url: "/seller/orders", icon: ShoppingCart },
    { title: t("pos"), url: "/seller/POS", icon: Store },
    { title: t("products"), url: "/seller/products", icon: Package },
    { title: t("inbox"), url: "/seller/inbox", icon: Inbox },
<<<<<<< HEAD
    { title: "Monthly Dues", url: "/seller/monthly-dues", icon: CalendarSync },
=======
    { title: "monthly-dues", url: "/seller/inbox", icon: CalendarSync },
>>>>>>> 6a90052e4d9e52256d7fd2190bb9a9d59ca13308
  ];
  
  // Avoid SSR/client mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, [pathname]);

  if (!mounted) return null;
  
  return (
    <>
      {/* FULL PAGE OVERLAY SPINNER */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Spinner className="size-5" />
        </div>
      )}

      <Sidebar variant="floating" className="fixed top-0 left-0 h-screen flex flex-col justify-between">
        <SidebarContent className="flex-1 overflow-y-auto mt-18">
          <SidebarGroup>
            <SidebarGroupLabel>BUYANI</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        onClick={() => setLoading(true)}
                        className="flex items-center gap-2 hover:text-green-500"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t ">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {t("username")}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  sideOffset={8}
                  className="w-[--radix-popper-anchor-width] z-9999"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href={"/seller/account_settings"}
                      onClick={() => setLoading(true)}
                      className="flex items-center gap-2 hover:text-green-500"
                    >
                      {t("account")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t("sign-out")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
