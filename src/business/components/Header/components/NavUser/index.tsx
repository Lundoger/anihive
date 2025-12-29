"use client";

import { useAuthStore } from "@/business/stores/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/Avatar";
import { Button } from "@/shared/components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/DropdownMenu";
import { AppLink } from "@/shared/components/Link";
import { Skeleton } from "@/shared/components/Skeleton";
import { cn } from "@/shared/utils/utils";
import { Key, LogOut, Settings, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

export default function NavUser() {
  const t = useTranslations("");
  const { initialized, signOut, user, profile } = useAuthStore();

  const lastInteraction = useRef<"pointer" | "keyboard">("pointer");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      const { error } = await signOut();
      if (error) {
        toast.error(error);
        return;
      }
      router.replace("/login");
      router.refresh();
    });
  };

  return (
    <>
      {initialized && !isPending ? (
        <>
          {Boolean(user) && Boolean(profile) ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className={cn(
                  "h-fit w-fit",
                  !initialized && "pointer-events-none",
                )}
                onPointerDownCapture={() => {
                  lastInteraction.current = "pointer";
                }}
                onKeyDownCapture={() => {
                  lastInteraction.current = "keyboard";
                }}
              >
                <Button
                  variant="transparent"
                  className="relative rounded-lg p-1"
                >
                  <Avatar className="size-10 rounded-lg">
                    <AvatarImage
                      src="https://shikimori.one/uploads/poster/characters/141354/main-253fd5d4beb3245037a0e70757e9932f.webp"
                      alt={`${user?.email ?? "user"} avatar`}
                      className="rounded-lg object-cover"
                    />
                    <AvatarFallback className="rounded-lg uppercase">
                      {user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
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
                    <Avatar className="size-10 rounded-lg">
                      <AvatarImage
                        src={profile?.avatar ?? ""}
                        alt={profile?.username ?? "user avatar"}
                      />
                      <AvatarFallback className="rounded-lg uppercase">
                        {user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
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
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="basic-transition capitalize"
                    onSelect={(e) => {
                      e.preventDefault();
                      router.push("/forgot-password");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="size-4" />
                      settings
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="basic-transition capitalize"
                    onSelect={(e) => {
                      e.preventDefault();
                      router.push("/forgot-password");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Key className="size-4" />
                      reset password
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    className="basic-transition capitalize"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleSignOut();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="text-destructive size-4" />
                      Log out
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : Boolean(user) && !Boolean(profile) ? (
            <Button
              variant="transparent"
              className="rounded-lg p-1 hover:bg-transparent"
            >
              <Skeleton className="size-10 rounded-lg" />
            </Button>
          ) : (
            <AppLink
              href="/login"
              variant="transparent"
              className="rounded-lg p-1"
            >
              <Avatar className="size-10 rounded-lg">
                <AvatarFallback className="rounded-lg uppercase">
                  <UserRound className="size-4" />
                </AvatarFallback>
              </Avatar>
            </AppLink>
          )}
        </>
      ) : (
        <Button
          variant="transparent"
          className="rounded-lg p-1 hover:bg-transparent"
        >
          <Skeleton className="size-10 rounded-lg" />
        </Button>
      )}
    </>
  );
}
