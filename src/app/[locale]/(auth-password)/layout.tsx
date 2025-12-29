import AuthImage from "@/business/components/AuthImage";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function AuthLayout({ children }: Props) {
  return (
    <main className="flex h-screen min-h-[500px] flex-row-reverse overflow-hidden">
      <div className="lgd:block relative hidden size-full basis-1/2">
        <AuthImage />
      </div>
      <div className="lgd:basis-1/2 relative size-full basis-full">
        <div className="flex h-full w-full basis-full p-3">
          <div className="xs:w-[85%] mx-auto flex h-full w-full flex-col py-5 md:py-10 lg:w-[70%]">
            {children}
            <div className="text-center text-xs opacity-30">
              © 2025 — 2026•AniHive
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
