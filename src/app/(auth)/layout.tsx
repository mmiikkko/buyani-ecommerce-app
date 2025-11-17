import { getServerSession } from "@/server/session";
import { notFound, redirect, unauthorized } from "next/navigation";
import { ReactNode } from "react";
import { USER_ROLES } from "@/server/schema/auth-schema";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  // block the authentication page if logged in

  if (user) {
    if (user.role.includes(USER_ROLES.ADMIN)) {
      redirect("/admin");
    } else if (user.role.includes(USER_ROLES.SELLER)) {
      redirect("/seller");
    } else if (user.role.includes(USER_ROLES.CUSTOMER)) {
      redirect("/");
    }
  }

  return children;
}
