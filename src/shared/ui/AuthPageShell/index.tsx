import type { ReactNode } from "react";

import Logo from "@/shared/ui/Logo";

interface AuthPageShellProps {
  title: string;
  description: ReactNode;
  links: ReactNode;
  note: string;
  children: ReactNode;
}

export function AuthPageShell({
  title,
  description,
  links,
  note,
  children,
}: AuthPageShellProps) {
  return (
    <div className="flex basis-full flex-col justify-center gap-6">
      <div className="flex flex-col items-center gap-6">
        <Logo size="lg" variant="transparent" />
        <div className="flex flex-col items-center gap-3">
          <h1 className="title text-center">{title}</h1>
          <p className="text-center text-sm opacity-50">{description}</p>
        </div>
      </div>
      {children}
      <div className="flex flex-col items-center gap-2 text-center">
        {links}
      </div>
      <p className="mx-auto text-center text-xs opacity-30">{note}</p>
    </div>
  );
}
