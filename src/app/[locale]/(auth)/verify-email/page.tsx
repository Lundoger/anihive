import { setRequestLocale } from "next-intl/server";

import { VerifyEmailPage } from "@/_pages/verify-email";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function VerifyEmail({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <VerifyEmailPage />;
}
