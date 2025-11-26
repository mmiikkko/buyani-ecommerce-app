"use client";
import Link from "next/link";
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
  User,
  Store,
  Package,
  Wallet,
  Layout,
  ChevronUp,
  User2,
} from "lucide-react";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
  },
  {
    title: "Shops",
    url: "/admin/shops",
    icon: Store,
  },
  {
    title: "Products",
    url: "/admin/products-monitor",
    icon: Package,
  },
  {
    title: "Transactions",
    url: "/admin/transactions",
    icon: Wallet,
  },
  {
    title: "Site Settings",
    url: "/admin/site",
    icon: Layout,
  },
];

export function AppSidebar() {
  return (
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
                  <User2 /> Username
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
                    className="flex items-center gap-2 hover:text-green-500">
                        Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
