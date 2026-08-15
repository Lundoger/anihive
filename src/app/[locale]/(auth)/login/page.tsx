import { setRequestLocale } from "next-intl/server";

import { LoginPage } from "@/_pages/login";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Login({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LoginPage />;
}
