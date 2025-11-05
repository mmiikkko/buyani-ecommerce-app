import Navbar from "@/components/nav/Navbar";
import { Footer } from "@/app/(customer)/_components/footer";
import { ReactNode } from "react";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
