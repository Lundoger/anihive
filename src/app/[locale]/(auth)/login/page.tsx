import Logo from "@/shared/components/Logo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
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
            Enter your email and password to login to your account.
            <br />
            You can also login with your social accounts
          </p>
        </div>
      </div>
      <LoginForm />
      <div className="flex flex-col items-center gap-2 text-center">
        <Link
          href="/registration"
          className="desc basic-transition hover:text-primary-accent-light"
        >
          Don&apos;t have an account? Register
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
