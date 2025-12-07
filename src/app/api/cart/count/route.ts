import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/server/session';
import { getCartItems } from '@/lib/queries/cart';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.id) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const cartItems = await getCartItems(user.id);
    // Count the number of unique products in the cart, not the total quantity
    const count = cartItems.length;

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}

