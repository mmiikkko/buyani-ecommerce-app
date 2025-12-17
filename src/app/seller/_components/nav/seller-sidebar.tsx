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
} from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  { title: "Home", url: "/seller", icon: Home },
  { title: "Orders", url: "/seller/orders", icon: ShoppingCart },
  { title: "POS", url: "/seller/POS", icon: Store },
  { title: "Products", url: "/seller/products", icon: Package },
  { title: "Inbox", url: "/seller/inbox", icon: Inbox },
];

export function AppSidebar() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
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
                      onClick={() => setLoading(true)}
                      className="flex items-center gap-2 hover:text-green-500"
                    >
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
    </>
  );
}
