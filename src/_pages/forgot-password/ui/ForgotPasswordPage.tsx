import { getTranslations } from "next-intl/server";

import { AuthPageShell } from "@/shared/ui/AuthPageShell";
import { AppLink } from "@/shared/ui/Link";

import { ForgotPasswordForm } from "./ForgotPasswordForm";

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
