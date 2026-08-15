import { Globe, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/Tabs";

import AccountSettings from "../AccountSettings";

export default async function SettingTabs() {
  const t = await getTranslations("settings.tabs");

  return (
    <Tabs defaultValue="account" className="gap-5 md:flex-row">
      <TabsList className="lgd:basis-1/4 bg-light-black h-fit w-full basis-full flex-col gap-1 *:data-[slot=tabs-trigger]:w-full md:basis-1/3 md:bg-transparent">
        <TabsTrigger value="account">
          <UserRound className="size-5" />
          <span>{t("triggers.account")}</span>
        </TabsTrigger>
        <TabsTrigger value="site">
          <Globe className="size-5" />
          <span>{t("triggers.site")}</span>
        </TabsTrigger>
      </TabsList>
      <div className="bg-light-black hidden w-px md:block" />
      <TabsContent
        value="account"
        className="lgd:basis-3/4 basis-full md:basis-2/3"
      >
        <AccountSettings />
      </TabsContent>
      <TabsContent
        value="site"
        className="lgd:basis-3/4 basis-full md:basis-2/3"
      >
        {t("content.site")}
      </TabsContent>
    </Tabs>
  );
}
