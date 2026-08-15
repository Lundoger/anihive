import { setRequestLocale } from "next-intl/server";

import { HomePage } from "@/_pages/home";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomePage />;
}
