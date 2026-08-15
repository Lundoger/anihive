import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { VerifyEmailForm } from "@/features/VerifyEmailForm";

import { AuthPageShell } from "@/shared/components/AuthPageShell";
import { AppLink } from "@/shared/components/Link";

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
