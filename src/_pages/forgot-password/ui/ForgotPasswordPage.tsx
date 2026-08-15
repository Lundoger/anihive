import { getTranslations } from "next-intl/server";

import { ForgotPasswordForm } from "@/features/ForgotPasswordForm";

import { AuthPageShell } from "@/shared/components/AuthPageShell";
import { AppLink } from "@/shared/components/Link";

export async function ForgotPasswordPage() {
  const t = await getTranslations("forgotPassword");

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
        <AppLink href="/login" variant="default">
          {t("login")}
        </AppLink>
      }
      note={t("cookies")}
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
