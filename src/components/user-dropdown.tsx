"use client";

import {
  ChevronDown,
  LogOutIcon,
  Settings,
  ShieldIcon,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIcon,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/server/auth-client";
import { User } from "@/server/auth-types";
import { USER_ROLES } from "@/server/schema/auth-schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserAvatar } from "./user-avatar";

interface UserDropdownProps {
  user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [hasSuspendedShop, setHasSuspendedShop] = useState<boolean | null>(null);
  const role = user.role;
  const isAdmin = role === USER_ROLES.ADMIN;
  const isSeller = role === USER_ROLES.SELLER;
  const isSuspendedRole = role === USER_ROLES.SUSPENDED;
  const isSellerOrAdmin = isSeller || isAdmin;
  const canSeeSellerCenter =
    !isSuspendedRole && isSellerOrAdmin && hasSuspendedShop === false;

  useEffect(() => {
    let cancelled = false;

    const checkIsSellerOrAdmin = role === USER_ROLES.SELLER || role === USER_ROLES.ADMIN;

    async function loadShopStatus() {
      // Only check sellers/admins who may own a shop
      if (!user?.id || !checkIsSellerOrAdmin) {
        if (!cancelled) setHasSuspendedShop(false);
        return;
      }

      try {
        const res = await fetch("/api/sellers/shop");
        if (!res.ok) {
          if (!cancelled) setHasSuspendedShop(false);
          return;
        }

        const data = await res.json();
        const suspended = data?.shop?.status === "suspended";
        if (!cancelled) setHasSuspendedShop(Boolean(suspended));
      } catch {
        if (!cancelled) setHasSuspendedShop(false);
      }
    }

    loadShopStatus();
    return () => {
      cancelled = true;
    };
  }, [user?.id, role]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer" variant="outline">
          <UserAvatar name={user.name} image={user.image} className="h-6 w-6" />
          <span className="max-w-48 truncate ">{user.name}</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/settings/profile" className="flex items-center gap-2">
            <DropdownMenuItemIcon icon={Settings} />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        {user.role === USER_ROLES.ADMIN && <AdminItem />}
        {canSeeSellerCenter && <SellerItem />}
        <SignOutItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AdminItem() {
  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <Link href="/admin">
        <DropdownMenuItemIcon icon={ShieldIcon} />
        <span>Admin</span>
      </Link>
    </DropdownMenuItem>
  );
}

function SellerItem() {
  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <Link href="/seller">
        <DropdownMenuItemIcon icon={Store} />
        <span>Seller Center</span>
      </Link>
    </DropdownMenuItem>
  );
}

function SignOutItem() {
  const router = useRouter();

  async function handleSignOut() {
    toast.loading("Signing out...");

    const { error } = await authClient.signOut();

    toast.dismiss();

    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Signed out successfully");
      router.push("/sign-in");
    }
  }

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
      <DropdownMenuItemIcon icon={LogOutIcon} />
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}
