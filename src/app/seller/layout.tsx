import Navbar from "@/app/seller/_components/nav/seller-navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/seller/_components/nav/seller-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";
import { getServerSession } from "@/server/session";
import { USER_ROLES } from "@/server/schema/auth-schema";
import { unauthorized, redirect } from "next/navigation";
import { db } from "@/server/drizzle";
import { shop } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";

export default async function SellerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  // Redirect unauthenticated users to login
  if (!user) {
    redirect("/sign-in?redirect=/seller");
  }

  // Check if user has seller role or is admin (admins retain seller access)
  if (
    !user.role.includes(USER_ROLES.SELLER) &&
    !user.role.includes(USER_ROLES.ADMIN)
  ) {
    unauthorized();
  }

  // Block access if the seller's shop is suspended
  const [shopRow] = await db
    .select({ status: shop.status })
    .from(shop)
    .where(eq(shop.sellerId, user.id))
    .limit(1);

  if (shopRow?.status === "suspended") {
    unauthorized();
  }

  return (
    <SidebarProvider defaultOpen={false} >
      <div className="flex min-h-screen overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Navbar */}
            <Navbar>
              <div className="flex items-center mr-3">
                <SidebarTrigger />
              </div>
              
            </Navbar>
        
            
          {/* Main Page Content */}
          <main className="flex-1 min-w-screen overflow-hidden px-6 py-6 bg-[#EBFEEC]">
            {/* Sidebar trigger at top (optional) */}
            
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
