"use client";

import { LogOutIcon, ShieldIcon, UserIcon, Store } from "lucide-react";

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
import { UserAvatar } from "../user-avatar";
import { USER_ROLES } from "@/server/schema/auth-schema";

interface UserDropdownProps {
  user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <UserAvatar name={user.name} image={user.image} className="w-6 h-6" />
          <span className="max-w-48 truncate">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <DropdownMenuItemIcon icon={UserIcon} />
            <span>Profile</span>
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
      <Link href="/seller-center">
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
