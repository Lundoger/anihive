"use client";

import { useEffect } from "react";

import { getProfile } from "../api/getProfile";
import { useProfileStore } from "./store";

/** A cold Supabase connection fails often enough to be worth one silent retry. */
const AUTO_RETRY_ATTEMPTS = 1;
const AUTO_RETRY_DELAY_MS = 2000;

/**
 * Keeps the profile store pointed at whichever user is signed in.
 *
 * `userId` arrives as an argument instead of being read from the session store:
 * profile and session are sibling slices and may not import each other, so the
 * App layer reads the id and hands it down. See app/providers/AuthProvider.
 */
export function useProfileSync(userId: string | null) {
  const retryToken = useProfileStore((s) => s.retryToken);

  useEffect(() => {
    const { setLoading, setProfile, setError, clear } =
      useProfileStore.getState();

    if (!userId) {
      clear();
      return;
    }

    // Cleanup runs before the next run of this effect, so a superseded fetch
    // marks itself dead right here — no request counter needed.
    let alive = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const load = async (attempt: number) => {
      setLoading();

      const { profile, error } = await getProfile(userId);
      if (!alive) return;

      if (error) {
        if (attempt < AUTO_RETRY_ATTEMPTS) {
          retryTimer = setTimeout(() => {
            if (alive) void load(attempt + 1);
          }, AUTO_RETRY_DELAY_MS);
          return;
        }

        setError(error);
        return;
      }

      setProfile(profile);
    };

    void load(0);

    return () => {
      alive = false;
      clearTimeout(retryTimer);
    };
  }, [userId, retryToken]);
}
