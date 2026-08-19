import { getTranslations } from "next-intl/server";

import { AuthPageShell } from "@/shared/ui/AuthPageShell";
import { AppLink } from "@/shared/ui/Link";

import { RegistrationForm } from "./RegistrationForm";

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
