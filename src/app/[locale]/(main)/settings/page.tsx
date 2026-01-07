import { setRequestLocale } from "next-intl/server";
import SettingTabs from "./components/SettingTabs";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="py-6" aria-labelledby="settings-title">
      <div className="custom-container">
        <h1 className="sr-only" id="settings-title">
          Account and Site Settings
        </h1>
        <SettingTabs />
      </div>
    </section>
  );
}
