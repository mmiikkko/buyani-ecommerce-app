import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/nav/Navbar";
import icon from "@/assets/logo/favicon.ico";

export const metadata: Metadata = {
  title: "BuyAni",
  icons: {
    icon: icon.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Add Navbar here */}
        <Navbar />

        {/* Main Page Content -> margin top 10 for navbar fixed space*/}
        <main className="mt-12">{children}</main>
      </body>
    </html>
  );
}
