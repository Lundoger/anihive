import { getBrowserClient } from "@/shared/api/supabase/client";

import type { Profile } from "../model/types";
import { PROFILE_COLUMNS } from "./columns";

/**
 * Reads one profile row.
 *
 * A missing row is not a failure: it comes back as `{ profile: null, error: null }`
 * so callers can tell "this user has no profile yet" apart from "the read broke".
 */
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
