import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { OAuthButtons } from "@/features/oauth";

import { AppLink } from "@/shared/ui/Link";
import Logo from "@/shared/ui/Logo";

import { AUTH_LINKS, AUTH_PAGES, type AuthPageKey } from "../model/config";

interface AuthShellProps {
  page: AuthPageKey;
  children: ReactNode;
}

export async function AuthShell({ page, children }: AuthShellProps) {
  const { links, oauth } = AUTH_PAGES[page];
  const t = await getTranslations(page);
  const tAuth = await getTranslations("auth");

  return (
    <div className="flex basis-full flex-col justify-center gap-6">
      <div className="flex flex-col items-center gap-6">
        <Logo size="lg" variant="transparent" />
        <div className="flex flex-col items-center gap-3">
          <h1 className="title text-center">{t("title")}</h1>
          <p className="text-center text-sm opacity-50">
            {t("description")}
            <br />
            {t("subDescription")}
          </p>
        </div>
      </div>
      {children}
      <div className="flex flex-col items-center gap-2 text-center">
        {links.map((link) => (
          <AppLink key={link} href={AUTH_LINKS[link]} variant="default">
            {tAuth(`links.${link}`)}
          </AppLink>
        ))}
      </div>
      {oauth && (
        <>
          <div className="flex items-center gap-2">
            <div className="bg-border h-px w-full" />
            <span className="text-muted-foreground font-medium">
              {tAuth("or")}
            </span>
            <div className="bg-border h-px w-full" />
          </div>
          <OAuthButtons />
        </>
      )}
      <p className="mx-auto text-center text-xs opacity-30">
        {tAuth("cookies")}
      </p>
    </div>
  );
}
