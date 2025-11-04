import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "BuyAni",
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

        {/* Main Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
