"use client";

import { usePathname } from "@/i18n/navigation";
import { BookOpen, Film, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/classnames";
import { Button } from "@/shared/ui/Button";
import Logo from "@/shared/ui/Logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/Tooltip";

import { NavUser } from "./NavUser";
import { Navigation } from "./Navigation";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const t = useTranslations("main.header.tooltips");

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full pr-(--removed-body-scroll-bar-size,0px)",
        "bg-black/70 backdrop-blur-sm transition-[background-color,backdrop-filter,border-color] duration-300 ease-out",
      )}
    >
      <div className="custom-container flex h-[72px] items-center justify-between gap-x-5">
        <Logo
          className={cn(
            !isHomePage &&
              "border-light-black/80 bg-light-black/80 hover:bg-light-black/80 hover:border-light-black/80 border",
          )}
        />
        <Navigation />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="transparent" ripple>
                  <Film className="size-4.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-medium">{t("randomAnime")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="transparent" ripple>
                  <BookOpen className="size-4.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-medium">{t("randomManga")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="transparent" ripple>
                  <Search className="size-4.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-medium">{t("search")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <NavUser />
        </div>
      </div>
    </header>
  );
}
