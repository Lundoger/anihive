import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AuthPageShell } from "@/shared/ui/AuthPageShell";
import { AppLink } from "@/shared/ui/Link";

import { VerifyEmailForm } from "./VerifyEmailForm";

export async function VerifyEmailPage() {
  const t = await getTranslations("verifyEmail");

  return (
    <AuthPageShell
      title={t("title")}
      description={
        <>
          {t("description")}
          <br />
          {t("socialDescription")}
        </>
      }
      links={
        <>
          <AppLink href="/login" variant="default">
            {t("login")}
          </AppLink>
          <AppLink href="/forgot-password" variant="default">
            {t("forgotPassword")}
          </AppLink>
        </>
      }
      note={t("cookies")}
    >
      <Suspense fallback={null}>
        <VerifyEmailForm />
      </Suspense>
    </AuthPageShell>
  );
}
