import Navbar from "./_components/nav/customer-navbar";
import { Footer } from "./_components/footer";
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
