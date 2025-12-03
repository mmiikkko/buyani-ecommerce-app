import { getServerSession } from "@/server/session";
import { unauthorized } from "next/navigation";
import { getCartItems } from "@/lib/queries/cart";
import { CheckoutClient } from "./checkout-client";

export default async function CheckoutPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    unauthorized();
  }

  const cartItems = await getCartItems(user.id);

  if (cartItems.length === 0) {
    return (
      <main className="relative min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-600 mb-6">
              Add some items to checkout!
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-50">
      <CheckoutClient cartItems={cartItems} userId={user.id} user={user} />
    </main>
  );
}

