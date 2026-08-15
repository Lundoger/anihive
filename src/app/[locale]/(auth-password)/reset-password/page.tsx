import { setRequestLocale } from "next-intl/server";

import { ResetPasswordPage } from "@/_pages/reset-password";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ResetPassword({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ResetPasswordPage />;
}
