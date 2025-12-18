import Logo from "@/shared/components/Logo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
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
            Enter your email, username and password to create an account.
            <br />
            You can also create an account with your social accounts
          </p>
        </div>
      </div>
      <RegistrationForm />
      <div className="flex flex-col items-center gap-2 text-center">
        <Link
          href="/login"
          className="desc basic-transition hover:text-primary-accent-light"
        >
          Already have an account? Login
        </Link>
        {/* <Link
          href="/forgot-password"
          className="desc basic-transition hover:text-primary-accent-light"
        >
          Reset password
        </Link> */}
      </div>
      <p className="mx-auto text-center text-xs opacity-30">
        We use cookies to make the site more comfortable for you. By continuing
        to view, you agree to the use of cookies
      </p>
    </div>
  );
}
