import type { Metadata } from "next";
import "@/styles/globals.css";
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
        <main>{children}</main>
      </body>
    </html>
  );
}
