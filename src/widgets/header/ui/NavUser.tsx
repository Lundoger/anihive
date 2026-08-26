"use client";

import { usePathname } from "@/i18n/navigation";
import { Key, LogOut, RotateCcw, Settings, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { useLogout } from "@/features/logout";

import { ProfileAvatar, useProfileStore } from "@/entities/profile";
import { useSessionStore } from "@/entities/session";

import { cn } from "@/shared/lib/classnames";
import { Avatar, AvatarFallback } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/DropdownMenu";
import { AppLink } from "@/shared/ui/Link";
import { Skeleton } from "@/shared/ui/Skeleton";

export function NavUser() {
  const t = useTranslations("main.header.navUser");

  const sessionStatus = useSessionStore((s) => s.status);
  const user = useSessionStore((s) => s.user);

  const profile = useProfileStore((s) => s.profile);
  const profileStatus = useProfileStore((s) => s.status);
  const retryProfile = useProfileStore((s) => s.retry);

  const { logout, isPending } = useLogout();

  const lastInteraction = useRef<"pointer" | "keyboard">("pointer");
  const pathname = usePathname();
  const isSettingsPage =
    pathname === "/settings" || pathname.startsWith("/settings/");

  // The session answers "is anyone here", the profile answers "who". Only the
  // second one can fail on its own, which is why it gets a retry affordance
  // rather than a spinner that never ends.
  const isSessionPending = sessionStatus === "loading" || isPending;
  const isProfilePending =
    profileStatus === "idle" || profileStatus === "loading";

  const avatar = {
    fallback: user?.email?.charAt(0),
    alt: `${user?.email ?? "user"} avatar`,
  };

  return (
    <>
      {isSessionPending ? (
        <Button
          variant="ghost"
          size="bare"
          className="rounded-lg p-1 hover:bg-transparent"
        >
          <Skeleton className="size-10 rounded-lg" />
        </Button>
      ) : !user ? (
        <AppLink href="/login" variant="transparent" className="rounded-lg p-1">
          <Avatar className="size-10 rounded-lg">
            <AvatarFallback className="rounded-lg uppercase">
              <UserRound className="size-4" />
            </AvatarFallback>
          </Avatar>
        </AppLink>
      ) : profileStatus === "error" ? (
        <Button
          variant="ghost"
          size="bare"
          className="rounded-lg p-1 hover:bg-transparent"
          onClick={retryProfile}
          title={t("retryProfile")}
          aria-label={t("retryProfile")}
        >
          <Avatar className="size-10 rounded-lg">
            <AvatarFallback className="rounded-lg uppercase">
              <RotateCcw className="size-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      ) : isProfilePending ? (
        <Button
          variant="ghost"
          size="bare"
          className="rounded-lg p-1 hover:bg-transparent"
        >
          <Skeleton className="size-10 rounded-lg" />
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="h-fit w-fit"
            onPointerDownCapture={() => {
              lastInteraction.current = "pointer";
            }}
            onKeyDownCapture={() => {
              lastInteraction.current = "keyboard";
            }}
          >
            <Button
              variant="ghost"
              size="bare"
              className="relative rounded-lg p-1"
            >
              <ProfileAvatar {...avatar} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            onKeyDownCapture={() => {
              lastInteraction.current = "keyboard";
            }}
            onCloseAutoFocus={(e) => {
              if (lastInteraction.current === "pointer") {
                e.preventDefault();
              }
            }}
          >
            <DropdownMenuItem className="basic-transition hover:bg-transparent!">
              <div className="flex w-full items-center gap-2 overflow-hidden">
                <ProfileAvatar {...avatar} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  {profile?.username && (
                    <p className="truncate text-sm font-medium text-white">
                      {profile?.username}
                    </p>
                  )}
                  <span className="block truncate text-xs font-light opacity-70">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="flex flex-col gap-1 py-1">
              <DropdownMenuItem
                className={cn(
                  "basic-transition capitalize",
                  isSettingsPage &&
                    "bg-primary/15 text-primary pointer-events-none",
                )}
                aria-current={isSettingsPage ? "page" : undefined}
                asChild
              >
                <AppLink href="/settings" variant="transparent">
                  <div className="flex items-center gap-2">
                    <Settings
                      className={cn("size-4", isSettingsPage && "text-primary")}
                    />
                    {t("settings")}
                  </div>
                </AppLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="basic-transition capitalize" asChild>
                <AppLink href="/forgot-password" variant="transparent">
                  <div className="flex items-center gap-2">
                    <Key className="size-4" />
                    {t("resetPassword")}
                  </div>
                </AppLink>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                className="basic-transition capitalize"
                onSelect={() => {
                  logout();
                }}
              >
                <div className="flex items-center gap-2">
                  <LogOut className="text-destructive size-4" />
                  {t("logout")}
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
