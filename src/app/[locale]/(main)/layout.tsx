import { setRequestLocale } from "next-intl/server";

import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { MobileMenu } from "@/widgets/mobile-menu";

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
