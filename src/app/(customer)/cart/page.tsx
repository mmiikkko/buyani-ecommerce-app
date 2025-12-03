"use server";

import { getServerSession } from "@/server/session";
import { unauthorized } from "next/navigation";

export default async function Cart() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  return (
    <main className="relative min-h-screen mt-35 py-8 px-5">
      <h1>Cart Page</h1>
    </main>
  );
}
