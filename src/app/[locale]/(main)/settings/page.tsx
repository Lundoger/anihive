import { setRequestLocale } from "next-intl/server";

import { SettingsPage } from "@/_pages/settings";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Settings({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SettingsPage />;
}
