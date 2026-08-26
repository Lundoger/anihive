"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/Button";

import { OAUTH_PROVIDERS } from "../model/providers";
import { oauthSignIn } from "../model/signInWithOAuth";

export const OAuthButtons = () => {
  const t = useTranslations("auth");

  return (
    <div className="flex items-center justify-center gap-2">
      {OAUTH_PROVIDERS.map(({ id, label, Icon }) => (
        <Button
          key={id}
          variant="secondary"
          size="icon-lg"
          aria-label={t("signInWith", { provider: label })}
          onClick={() => oauthSignIn(id)}
        >
          <Icon className="size-5" />
        </Button>
      ))}
    </div>
  );
};
