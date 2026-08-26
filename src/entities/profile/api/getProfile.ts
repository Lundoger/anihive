import { getBrowserClient } from "@/shared/api/supabase/client";

import type { Profile } from "../model/types";
import { PROFILE_COLUMNS } from "./columns";

export async function getProfile(
  userId: string,
): Promise<{ profile: Profile | null; error: string | null }> {
  try {
    const { data, error } = await getBrowserClient()
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", userId)
      .maybeSingle<Profile>();

    if (error) return { profile: null, error: error.message };

    return { profile: data ?? null, error: null };
  } catch (err) {
    return {
      profile: null,
      error: err instanceof Error ? err.message : "Failed to load profile",
    };
  }
}
