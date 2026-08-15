import SettingTabs from "./SettingTabs";

export function SettingsPage() {
  return (
    <section className="mt-[72px] py-6" aria-labelledby="settings-title">
      <div className="custom-container">
        <h1 className="sr-only" id="settings-title">
          Account and Site Settings
        </h1>
        <SettingTabs />
      </div>
    </section>
  );
}
