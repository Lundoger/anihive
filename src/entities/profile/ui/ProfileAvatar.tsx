"use client";

import { useMemo } from "react";

import { cn } from "@/shared/lib/classnames";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/Avatar";

import { buildAvatarUrl } from "../lib/avatarUrl";
import { useProfileStore } from "../model/store";

type ProfileAvatarProps = {
  /** Last-resort initial, used when the profile has neither picture nor username. */
  fallback?: string;
  alt?: string;
  className?: string;
};

export function ProfileAvatar({
  fallback = "U",
  alt = "avatar",
  className,
}: ProfileAvatarProps) {
  const profile = useProfileStore((s) => s.profile);

  const src = useMemo(() => {
    return buildAvatarUrl(profile?.avatar, profile?.avatar_updated_at);
  }, [profile?.avatar, profile?.avatar_updated_at]);

  const initial = (profile?.username?.charAt(0) || fallback).toUpperCase();

  return (
    <Avatar className={cn("size-10 rounded-lg", className)}>
      <AvatarImage
        src={src || undefined}
        alt={alt}
        className="rounded-lg object-cover"
      />
      {!src && (
        <AvatarFallback className="rounded-lg uppercase" delayMs={0}>
          {initial}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
