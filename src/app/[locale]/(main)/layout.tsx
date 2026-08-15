import { setRequestLocale } from "next-intl/server";

import Footer from "@/widgets/Footer";
import Header from "@/widgets/Header";
import MobileMenu from "@/widgets/MobileMenu";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MainLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <MobileMenu />
      <main className="mt-[72px]">{children}</main>
      <Footer />
    </>
  );
}
