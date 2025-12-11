import { createClient } from "@/business/utils/supabase/server";
import { Button } from "@/shared/components/Button";
import Logo from "@/shared/components/Logo";
import Link from "next/link";
import Navigation from "./components/Navigation";

export default async function Header() {
  const supabase = await createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="custom-container flex h-[72px] items-center justify-between gap-4">
        <Logo />
        <Navigation />
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline">
            <Link href="/signup">Signup</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
