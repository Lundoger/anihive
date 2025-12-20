import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ua", "en"],
  localePrefix: "never",
  defaultLocale: "ua",
});
