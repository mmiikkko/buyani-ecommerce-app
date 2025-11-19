import { getServerSession } from "@/server/session";
import { unauthorized } from "next/navigation";
import { ReactNode } from "react";
import { USER_ROLES } from "@/server/schema/auth-schema";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (user && !user.role.includes(USER_ROLES.ADMIN)) {
    unauthorized();
  }

  return (
    <div className="flex">
      <main className="flex-1">{children}</main>
    </div>
  );
}
