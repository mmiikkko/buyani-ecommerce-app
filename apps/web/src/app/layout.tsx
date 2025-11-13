import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import icon from "@/assets/logo/favicon.ico";

export const metadata: Metadata = {
  title: "BuyAni",
  icons: {
    icon: icon.src,
  },
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased scroll-smooth`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
