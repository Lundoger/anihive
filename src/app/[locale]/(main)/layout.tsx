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
      <main className="xs:my-[72px] mt-[72px] mb-[56px]">{children}</main>
    </>
  );
}
