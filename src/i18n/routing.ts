import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ua"],
  localePrefix: "never",
  defaultLocale: "ua",
});
