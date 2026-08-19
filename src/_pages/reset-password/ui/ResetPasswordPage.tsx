import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AuthPageShell } from "@/shared/ui/AuthPageShell";
import { AppLink } from "@/shared/ui/Link";

import { ResetPasswordForm } from "./ResetPasswordForm";

export async function ResetPasswordPage() {
  const t = await getTranslations("resetPassword");

  return (
    <AuthPageShell
      title={t("title")}
      description={
        <>
          {t("description")}
          <br />
          {t("subDescription")}
        </>
      }
      links={
        <>
          <AppLink href="/forgot-password" variant="default">
            {t("forgotPassword")}
          </AppLink>
          <AppLink href="/login" variant="default">
            {t("login")}
          </AppLink>
        </>
      }
      note={t("cookies")}
    >
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthPageShell>
  );
}
