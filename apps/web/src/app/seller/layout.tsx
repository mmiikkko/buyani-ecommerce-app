import Navbar from "@/components/nav/ASNavbar";
import { ReactNode } from "react";

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
