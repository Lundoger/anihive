import { getTranslations } from "next-intl/server";

import { FOOTER_NAVIGATION_MENU_ITEMS } from "@/shared/config/navigation";
import { AppLink } from "@/shared/ui/Link";
import Logo from "@/shared/ui/Logo";

export async function Footer() {
  const t = await getTranslations("main.footer");

  return (
    <footer className="xs:mb-[72px] mb-[56px] py-3 md:mb-0 md:px-4 md:py-8">
      <div className="custom-container flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-x-5 gap-y-3 py-3 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="pointer-events-none flex items-center gap-1 select-none">
              <Logo
                size="default"
                className="size-14 p-0"
                variant="transparent"
              />
              <p className="text-3xl font-bold">
                Ani<span className="text-primary">Hive</span>
              </p>
            </div>
            <p className="max-w-[550px] opacity-50">{t("description")}</p>
            {/* <div className="flex items-center gap-2">
						</div> */}
          </div>
          <div className="flex flex-col gap-5 md:col-span-3 md:flex-row md:justify-around">
            {FOOTER_NAVIGATION_MENU_ITEMS.map((section) => (
              <div key={section.id} className="flex flex-col gap-3">
                <h4 className="text-lg font-bold">{t(section.titleKey)}</h4>
                <ul className="flex flex-col gap-2">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <AppLink href={link.href}>{t(link.titleKey)}</AppLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-white/20" />
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 py-3">
          <div className="flex flex-col gap-2">
            <p className="text-sm opacity-50">{t("copyright")}</p>
          </div>
          <p className="text-sm opacity-50">{t("poweredBy")}</p>
        </div>
      </div>
    </footer>
  );
}
