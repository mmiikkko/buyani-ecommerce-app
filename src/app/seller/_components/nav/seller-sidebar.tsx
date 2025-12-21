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
  CalendarSync,
} from "lucide-react";

import { PremiumLoader } from "@/components/shared/premium-loader";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

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
    { title: t("monthly-dues") || "Monthly Dues", url: "/seller/monthly-dues", icon: CalendarSync },
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

  const handleNavClick = (url: string) => {
    if (pathname === url) return;
    setLoading(true);
  };

  if (!mounted) return null;

  return (
    <>
      {/* FULL PAGE OVERLAY SPINNER */}
      {loading && <PremiumLoader text="Switching pages..." />}

      <Sidebar variant="floating" className="fixed top-0 left-0 h-screen flex flex-col justify-between">
        <SidebarContent className="flex-1 overflow-y-auto mt-18">
          <SidebarGroup>
            <SidebarGroupLabel>BUYANI</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.url}
                          onClick={() => handleNavClick(item.url)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                            isActive
                              ? "bg-emerald-50 text-emerald-700 font-semibold shadow-sm border border-emerald-100/50"
                              : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50"
                          )}
                        >
                          <item.icon className={cn(
                            "w-4 h-4 transition-colors",
                            isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"
                          )} />
                          <span>{item.title}</span>
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse-subtle" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
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
