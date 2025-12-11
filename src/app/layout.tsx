import Header from "@/business/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AniHive",
  description:
    "AniHive is a place where you can find and share your favorite anime",
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="wrapper">
          <Header />
          <main className="mt-[72px]">{children}</main>
        </div>
      </body>
    </html>
  );
}
