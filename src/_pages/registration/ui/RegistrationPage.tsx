import { getTranslations } from "next-intl/server";

import { RegistrationForm } from "@/features/RegistrationForm";

import { AuthPageShell } from "@/shared/components/AuthPageShell";
import { AppLink } from "@/shared/components/Link";

export async function RegistrationPage() {
  const t = await getTranslations("registration");

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
        <AppLink href="/login" variant="default">
          {t("register")}
        </AppLink>
      }
      note={t("cookies")}
    >
      <RegistrationForm />
    </AuthPageShell>
  );
}
