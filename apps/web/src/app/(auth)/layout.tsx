import { getServerSession } from "@/server/auth-utils";

import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (user) {
    //
  }

  return children;
}
