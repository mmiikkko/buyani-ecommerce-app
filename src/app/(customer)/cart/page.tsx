import { getServerSession } from "@/server/session";
import { unauthorized } from "next/navigation";
import { getCartItems } from "@/lib/queries/cart";
import { CartClient } from "./cart-client";

export default async function Cart() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  const cartItems = await getCartItems(user.id);

  return (
    <main className="relative min-h-screen">
      <CartClient initialItems={cartItems} userId={user.id} />
    </main>
  );
}
