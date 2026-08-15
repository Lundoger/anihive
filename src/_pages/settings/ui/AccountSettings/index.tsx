import { getTranslations } from "next-intl/server";
import { memo } from "react";

import AvatarSettingsBlock from "./AvatarSettingsBlock";
import EmailSettingsBlock from "./EmailSettingsBlock";
import NicknameSettingsBlock from "./NicknameSettingsBlock";
import PasswordSettingsBlock from "./PasswordSettingsBlock";

const SectionDescription = memo(
  function SectionDescription({ text }: { text: string }) {
    const parts = text
      .split(".")
      .map((s) => s.trim())
      .filter(Boolean);

    if (parts.length <= 1) {
      const normalized = text.trim();
      return (
        <p className="text-gray text-base font-medium">
          {normalized.endsWith(".") ? normalized : `${normalized}.`}
        </p>
      );
    }

    return (
      <>
        {parts.map((part, idx) => (
          <p key={`${idx}-${part}`} className="text-gray text-base font-medium">
            {part}.
          </p>
        ))}
      </>
    );
  },
  (prev, next) => prev.text === next.text,
);

export default async function AccountSettings() {
  const t = await getTranslations("settings.tabs.content.account");
  return (
    <div className="flex max-w-[800px] flex-col gap-8 md:gap-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-0.5 pl-4 leading-1">
          <h2 className="text-xl font-bold">{t("profileTitle")}</h2>
          <SectionDescription text={t("profileDescription")} />
        </div>
        <div className="flex flex-col gap-4">
          <NicknameSettingsBlock />
          <AvatarSettingsBlock />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-0.5 pl-4 leading-0">
          <h2 className="text-xl font-bold">{t("accountTitle")}</h2>
          <SectionDescription text={t("accountDescription")} />
        </div>
        <div className="flex flex-col gap-4">
          <EmailSettingsBlock />
          <PasswordSettingsBlock />
        </div>
      </div>
    </div>
  );
}
