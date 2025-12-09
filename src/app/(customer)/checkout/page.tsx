import { getServerSession } from "@/server/session";
import { unauthorized } from "next/navigation";
import { getCartItems } from "@/lib/queries/cart";
import { CheckoutClient } from "./checkout-client";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  // Handle both promise and plain object forms of searchParams
  const resolvedParams =
    typeof (searchParams as any)?.then === "function"
      ? await (searchParams as Promise<SearchParams>)
      : (searchParams as SearchParams | undefined) ?? {};
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    unauthorized();
  }

  // Parse selected item IDs from query (?items=id1,id2)
  const rawItems = resolvedParams.items;
  const itemsParam = Array.isArray(rawItems) ? rawItems[0] : rawItems;
  const selectedIds =
    typeof itemsParam === "string"
      ? itemsParam
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [];

  const cartItems = await getCartItems(user.id);
  const checkoutItems =
    selectedIds.length > 0
      ? cartItems.filter((item) => selectedIds.includes(item.id))
      : cartItems;

  if (checkoutItems.length === 0) {
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
      <CheckoutClient cartItems={checkoutItems} userId={user.id} user={user} />
    </main>
  );
}

