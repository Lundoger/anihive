"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/Select";
import { Spinner } from "@/shared/components/Spinner";

type Locale = (typeof routing.locales)[number];

export function LangSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const requestLocale = useLocale();
  const locale: Locale = routing.locales.includes(requestLocale as Locale)
    ? (requestLocale as Locale)
    : routing.defaultLocale;

  const handleValueChange = (nextLocale: string) => {
    if (!routing.locales.includes(nextLocale as Locale)) return;
    if (nextLocale === locale) return;

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale as Locale });
    });
  };

  return (
    <Select value={locale} onValueChange={handleValueChange}>
      <SelectTrigger
        className="w-[70px] uppercase transition-opacity duration-100 ease-linear"
        aria-busy={isPending}
        disabled={isPending}
      >
        {isPending ? (
          <Spinner className="size-4 opacity-70" />
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent position="popper" side="bottom" align="end">
        {routing.locales.map((l) => (
          <SelectItem key={l} value={l} className="uppercase">
            {l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
