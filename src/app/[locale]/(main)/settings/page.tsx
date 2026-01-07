import { setRequestLocale } from "next-intl/server";
import SettingTabs from "./components/SettingTabs";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="py-6">
      <div className="custom-container">
        <SettingTabs />
      </div>
    </section>
  );
}
