import { AppLink } from "@/shared/components/Link";
import Logo from "@/shared/components/Logo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RegistrationForm } from "./components/RegistrationForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RegistrationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("registration");
  return (
    <div className="flex basis-full flex-col justify-center gap-6">
      <div className="flex flex-col items-center gap-6">
        <Logo size="lg" variant="transparent" />
        <div className="flex flex-col items-center gap-3">
          <h1 className="title">{t("title")}</h1>
          <p className="text-center text-sm opacity-50">
            {t("description")}
            <br />
            {t("socialDescription")}
          </p>
        </div>
      </div>
      <RegistrationForm />
      <div className="flex flex-col items-center gap-2 text-center">
        <AppLink href="/login" variant="default">
          {t("register")}
        </AppLink>
      </div>
      <p className="mx-auto text-center text-xs opacity-30">{t("cookies")}</p>
    </div>
  );
}
