import { getBrowserClient } from "@/shared/api/supabase/client";

import type { Profile } from "../model/types";
import { PROFILE_COLUMNS } from "./columns";

export async function updateUsername({
  userId,
  username,
}: {
  userId: string;
  username: string;
}): Promise<{ profile: Profile | null; error: string | null }> {
  try {
    const { data, error } = await getBrowserClient()
      .from("profiles")
      .update({ username })
      .eq("id", userId)
      .select(PROFILE_COLUMNS)
      .single<Profile>();

    if (error) return { profile: null, error: error.message };

    return { profile: data, error: null };
  } catch (err) {
    return {
      profile: null,
      error: err instanceof Error ? err.message : "Failed to update username",
    };
  }
}
