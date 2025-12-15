import Header from "@/business/components/Header";
import { createClient } from "@/business/utils/supabase/server";

type Props = {
  children: React.ReactNode;
};

export default async function MainLayout({ children }: Props) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  return (
    <>
      <Header />
      <main className="mt-[72px]">{children}</main>
    </>
  );
}
