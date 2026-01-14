"use client";

import { LangSwitch } from "@/business/components/LangSwitch";
import { usePathname } from "@/i18n/navigation";
import Logo from "@/shared/components/Logo";
import { cn } from "@/shared/utils/utils";
import NavUser from "./components/NavUser";
import Navigation from "./components/Navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-black pr-(--removed-body-scroll-bar-size,0px) backdrop-blur-sm">
      <div className="custom-container flex h-[72px] items-center justify-between gap-x-5">
        <Logo
          className={cn(
            !isHomePage &&
              "border-light-black/80 bg-light-black/80 hover:bg-light-black/80 hover:border-light-black/80 border",
          )}
        />
        <Navigation />
        <div className="flex items-center gap-4">
          <NavUser />
        </div>
      </div>
    </header>
  );
}
