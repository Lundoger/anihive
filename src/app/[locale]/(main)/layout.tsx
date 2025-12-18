import Header from "@/business/components/Header";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="mt-[72px]">{children}</main>
    </>
  );
}
