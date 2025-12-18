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
import { Skeleton } from "@/shared/components/Skeleton";
import { cn } from "@/shared/utils/utils";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { useRef, useTransition } from "react";

export default function NavUser() {
  const { initialized, signOut, user } = useAuthStore();
  const lastInteraction = useRef<"pointer" | "keyboard">("pointer");
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <>
      {initialized && !isPending ? (
        <>
          {Boolean(user) ? (
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
                      {user?.email?.charAt(0) ?? "U"}
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
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    {user?.email ?? "No email"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>New Team</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleSignOut();
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="rounded-lg p-1">
              <Avatar className="size-10 rounded-lg">
                <AvatarFallback className="rounded-lg uppercase">
                  <UserRound className="size-4" />
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </>
      ) : (
        <Button variant="transparent" className="rounded-lg p-1">
          <Skeleton className="size-10 rounded-lg" />
        </Button>
      )}
    </>
  );
}
