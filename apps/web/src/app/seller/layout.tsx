import Navbar from "@/components/nav/ASNavbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/Sidebar";
import { ReactNode } from "react";

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        <div className="fixed mt-18 ml-2">
              <SidebarTrigger/>
          </div>
        {/* Main Page Content */}
        <main className="flex-1 min-w-screen self-center overflow-hidden self-center p-6 bg-#EBFEEC">
          {/* Sidebar trigger at top (optional) */}
          
          {children}
        </main>
      </div>
    </div>
  </SidebarProvider>
  )
}
