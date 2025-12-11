"use client";

import { NAVIGATION_MENU_ITEMS } from "@/business/constants/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shared/components/NavigationMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navigation() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className="hidden flex-wrap gap-x-3 gap-y-2 md:flex">
        {NAVIGATION_MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink
                className={cn(
                  "group relative inline-flex w-max items-center justify-center p-2 text-sm font-medium",
                  "before:bg-primary-accent-light before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:scale-x-0 before:transition-transform",
                  "hover:text-primary-accent-light hover:bg-transparent hover:before:scale-x-100",
                  "focus:text-primary-accent-light focus:outline-hidden focus:before:scale-x-100",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "data-active:before:scale-x-100 data-[state=open]:before:scale-x-100",
                )}
                asChild
                active={isActive}
              >
                <Link href={item.href}>{item.title}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navigation;
