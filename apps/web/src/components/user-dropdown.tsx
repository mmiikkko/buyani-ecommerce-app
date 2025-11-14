"use client";

import {
  LogOutIcon,
  ShieldIcon,
  Settings,
  Store,
  ChevronDown,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

import { authClient } from "@/server/auth-client";
import { toast } from "sonner";
import { User } from "@/server/auth-types";
import { UserAvatar } from "./user-avatar";
import { USER_ROLES } from "@/server/schema/auth-schema";

interface UserDropdownProps {
  user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
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
        <DropdownMenuItem asChild>
          <Link href="/settings/profile" className="flex items-center gap-2">
            <DropdownMenuItemIcon icon={Settings} />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        {user.role.includes(USER_ROLES.ADMIN) && <AdminItem />}
        {user.role.includes(USER_ROLES.SELLER) && <SellerItem />}
        <SignOutItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AdminItem() {
  return (
    <DropdownMenuItem asChild>
      <Link href="/admin">
        <DropdownMenuItemIcon icon={ShieldIcon} />
        <span>Admin</span>
      </Link>
    </DropdownMenuItem>
  );
}

function SellerItem() {
  return (
    <DropdownMenuItem asChild>
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
    <DropdownMenuItem onClick={handleSignOut}>
      <DropdownMenuItemIcon icon={LogOutIcon} />
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}
