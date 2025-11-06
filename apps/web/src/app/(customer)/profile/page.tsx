"use server";

import { getServerSession } from "@/server/session";
import { unauthorized } from "next/navigation";

export default async function Profile() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  return (
    <main className="relative min-h-screen ">
      <h1>User Profile Page</h1>
    </main>
  );
}
