import type { ReactNode } from "react";

import { LangSwitch } from "@/widgets/LangSwitch";
import RandomAnimePic from "@/widgets/RandomAnimePic";

type Props = {
  children: ReactNode;
};

export default async function AuthLayout({ children }: Props) {
  return (
    <main className="flex h-screen min-h-[750px] overflow-hidden">
      <div className="lgd:block relative hidden size-full basis-1/2">
        <RandomAnimePic />
      </div>
      <div className="lgd:basis-1/2 relative size-full basis-full">
        <div className="relative flex h-full w-full basis-full px-3 pt-10 pb-3">
          <div className="xs:w-[85%] mx-auto flex h-full w-full flex-col py-5 md:py-10 lg:w-[70%]">
            {children}
            <div className="text-center text-xs opacity-30">
              © 2025 — 2026•AniHive
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <LangSwitch />
          </div>
        </div>
      </div>
    </main>
  );
}
