"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { authClient } from "@/server/auth-client";
import { toast } from "sonner";

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
    url: "/admin/site-settings",
    icon: Layout,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const [adminName, setAdminName] = useState<string>("Admin");

  useEffect(() => {
    // Fetch admin user info
    const fetchAdminInfo = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setAdminName(data.name || data.firstName || "Admin");
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };

    fetchAdminInfo();
  }, []);

  const handleSignOut = async () => {
    toast.loading("Signing out...");

    const { error } = await authClient.signOut();

    toast.dismiss();

    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Signed out successfully");
      router.push("/sign-in");
    }
  };

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
                  <User2 /> {adminName}
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
                    href={"/admin/account_settings"}
                    className="flex items-center gap-2 hover:text-green-500">
                        Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={handleSignOut}
                >
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
