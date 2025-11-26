import Navbar from "@/app/seller/_components/nav/seller-navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/seller/_components/nav/seller-sidebar";
import { ReactNode } from "react";
import { getServerSession } from "@/server/session";
import { USER_ROLES } from "@/server/schema/auth-schema";
import { unauthorized } from "next/navigation";

export default async function SellerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  // block the authentication page if logged in

  if (user) {
    if (!user.role.includes(USER_ROLES.SELLER)) {
      unauthorized();
    }
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
          <main className="flex-1 min-w-screen self-center overflow-hidden self-center p-6 bg-#EBFEEC">
            {/* Sidebar trigger at top (optional) */}
            
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
