import { setRequestLocale } from "next-intl/server";

import { ForgotPasswordPage } from "@/_pages/forgot-password";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ForgotPassword({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ForgotPasswordPage />;
}
