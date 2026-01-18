import Footer from "@/business/components/Footer";
import Header from "@/business/components/Header";
import MobileMenu from "@/business/components/MobileMenu";
import { setRequestLocale } from "next-intl/server";

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
