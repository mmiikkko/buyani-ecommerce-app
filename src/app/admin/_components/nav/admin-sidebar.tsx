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
import { cn } from "@/lib/utils";
import { PremiumLoader } from "@/components/shared/premium-loader";

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
  CalendarSync,
  Wallet,
  Layout,
  ChevronUp,
  User2,
  BarChart3,
  TrendingUp,
} from "lucide-react";

import { authClient } from "@/server/auth-client";
import { toast } from "sonner";
import { usePathname } from "next/navigation";


// Menu items.
const items = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Users", url: "/admin/users", icon: User },
  { title: "Shops", url: "/admin/shops", icon: Store },
  { title: "Products", url: "/admin/products-monitor", icon: Package },
  { title: "Tenants", url: "/admin/tenant-payments", icon: CalendarSync },
  { title: "Revenue Reports", url: "/admin/revenue-reports", icon: BarChart3 },
  { title: "Sales Trend", url: "/admin/sales-trends", icon: TrendingUp },
  { title: "Transactions", url: "/admin/transactions", icon: Wallet },
  { title: "Platform Feedback", url: "/admin/feedback", icon: Layout },
  { title: "Site Settings", url: "/admin/site-settings", icon: Layout },
];

export function AppSidebar() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setAdminName(data.name || data.firstName || "Admin");
        }
      } catch (err) {
        console.error("Failed to fetch admin info:", err);
      }
    };

    fetchAdminInfo();
  }, []);


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, [pathname]);

  const handleNavClick = (url: string) => {
    if (pathname === url) return;
    setLoading(true);
  };

  async function handleSignOut() {
    toast.loading("Signing out...");
    setLoading(true);

    const { error } = await authClient.signOut();
    toast.dismiss();

    if (error) {
      setLoading(false);
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Signed out successfully");
      router.push("/sign-in");
    }
  }

  return (
    <>
      {/* FULL PAGE OVERLAY SPINNER */}
      {loading && <PremiumLoader text="Switching pages..." />}

      <Sidebar
        variant="floating"
        className="fixed top-0 left-0 h-screen flex flex-col justify-between"
      >
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
                      href="/admin/account_settings"
                      onClick={() => setLoading(true)}
                      className="flex items-center gap-2 hover:text-green-500"
                    >
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
    </>
  );
}
