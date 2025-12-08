import Navbar from "./_components/nav/customer-navbar";
import { Footer } from "./_components/footer";
import { ChatFab } from "./_components/chat-fab";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="pt-20 pb-10 flex-1">{children}</main>
      <ChatFab />
      <Footer />
      <Toaster />
    </div>
  );
}
