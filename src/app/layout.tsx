import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/app/globals.css";
import icon from "@/assets/logo/favicon.ico";
import { LanguageProvider } from "@/lib/i18n/context";

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
    <html lang="fil">
      <body className={`${roboto.className} antialiased scroll-smooth`}>
        <LanguageProvider>
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
