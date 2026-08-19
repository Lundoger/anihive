import { getTranslations } from "next-intl/server";

import { AuthPageShell } from "@/shared/ui/AuthPageShell";
import { AppLink } from "@/shared/ui/Link";

import { LoginForm } from "./LoginForm";

export async function LoginPage() {
  const t = await getTranslations("login");

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
          <AppLink href="/registration" variant="default">
            {t("register")}
          </AppLink>
          <AppLink href="/forgot-password" variant="default">
            {t("forgotPassword")}
          </AppLink>
        </>
      }
      note={t("cookies")}
    >
      <LoginForm />
    </AuthPageShell>
  );
}
