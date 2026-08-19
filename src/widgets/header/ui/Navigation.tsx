"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { NAVIGATION_MENU_ITEMS } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/classnames";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shared/ui/NavigationMenu";

export function Navigation() {
  const pathname = usePathname();
  const t = useTranslations("main.header.navigation");

  return (
    <NavigationMenu className="max-w-none grow basis-auto justify-start">
      <NavigationMenuList className="hidden flex-wrap gap-x-3 gap-y-2 md:flex">
        {NAVIGATION_MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink
                className={cn(
                  "group basic-transition relative inline-flex w-max items-center justify-center rounded-none p-2 text-sm font-medium duration-200",
                  "before:bg-primary-accent-light before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:scale-x-0 before:transition-transform",
                  "hover:text-primary-accent-light hover:bg-transparent hover:before:scale-x-100",
                  "focus:text-primary-accent-light focus:outline-hidden focus:before:scale-x-100",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "data-active:text-primary-accent-light data-active:hover:bg-primary-accent-light data-active:before:scale-x-100 data-active:hover:text-white data-[state=open]:before:scale-x-100",
                )}
                asChild
                active={isActive}
              >
                <Link href={item.href}>{t(item.title)}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
