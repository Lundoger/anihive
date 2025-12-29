import { AppLink } from "@/shared/components/Link";
import Logo from "@/shared/components/Logo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginForm } from "./components/LoginForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("login");
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
      <LoginForm />
      <div className="flex flex-col items-center gap-2 text-center">
        <AppLink href="/registration" variant="default">
          {t("register")}
        </AppLink>
        <AppLink href="/forgot-password" variant="default">
          {t("forgotPassword")}
        </AppLink>
      </div>
      <p className="mx-auto text-center text-xs opacity-30">{t("cookies")}</p>
    </div>
  );
}
