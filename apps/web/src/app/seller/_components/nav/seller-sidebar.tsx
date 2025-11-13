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
  ShoppingCart,
  Store,
  Package,
  Inbox,
  ChevronUp,
  User2,
} from "lucide-react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/seller",
    icon: Home,
  },
  {
    title: "Orders",
    url: "/seller/orders",
    icon: ShoppingCart,
  },
  {
    title: "POS",
    url: "/seller/POS",
    icon: Store,
  },
  {
    title: "Products",
    url: "/seller/products",
    icon: Package,
  },
  {
    title: "Inbox",
    url: "/seller/inbox",
    icon: Inbox,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="fixed top-0 left-0 h-screen flex flex-col justify-between">
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
                <DropdownMenuItem>
                  <span>Account</span>
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
