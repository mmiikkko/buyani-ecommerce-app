import Navbar from "./_components/nav/customer-navbar";
import { Footer } from "./_components/footer";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-20 pb-10">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}
