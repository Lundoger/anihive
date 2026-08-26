"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { NAVIGATION_MOBILE_MENU_ITEMS } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/classnames";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shared/ui/NavigationMenu";

export function MobileMenu() {
  const pathname = usePathname();
  const t = useTranslations("main.header.navigation");

  return (
    <nav className="bg-background fixed inset-x-0 bottom-0 z-50 pr-(--removed-body-scroll-bar-size,0px) backdrop-blur-sm md:hidden">
      <NavigationMenu
        viewport={false}
        className="w-full max-w-none justify-start [&>div]:w-full"
      >
        <NavigationMenuList className="xs:gap-x-3 grid w-full basis-full grid-cols-5 items-center gap-x-1 gap-y-2 self-center">
          {NAVIGATION_MOBILE_MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <NavigationMenuItem key={item.title} className="w-full">
                <NavigationMenuLink
                  className={cn(
                    "group relative inline-flex w-full items-center justify-center p-2 text-sm font-medium",
                    "before:bg-primary before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:scale-x-0 before:transition-transform",
                    "hover:[&>svg]:text-primary",
                    "focus:text-primary focus:outline-hidden",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "hover:[&>svg]:text-primary hover:text-primary",
                    "data-active:[&>svg]:text-primary data-active:text-primary data-active:before:scale-x-100 data-[state=open]:before:scale-x-100 data-active:hover:[&>svg]:scale-115",
                  )}
                  asChild
                  active={isActive}
                >
                  <Link
                    href={item.href}
                    className="xs:pb-3 inline-flex w-full items-center justify-center gap-2 p-4"
                  >
                    <Icon
                      className="basic-transition size-6 duration-100"
                      aria-hidden="true"
                    />
                    <span className="xs:block hidden text-xs leading-none font-normal">
                      {t(item.title)}
                    </span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
