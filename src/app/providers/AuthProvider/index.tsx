"use client";

import { useProfileSync } from "@/entities/profile";
import { useSessionSync, useSessionUserId } from "@/entities/session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const userId = useSessionUserId();

  useSessionSync();
  useProfileSync(userId);

  return children;
}
