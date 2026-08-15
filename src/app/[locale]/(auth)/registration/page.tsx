import { setRequestLocale } from "next-intl/server";

import { RegistrationPage } from "@/_pages/registration";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Registration({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegistrationPage />;
}
