"use client";

import { useAuthStore } from "@/business/stores/auth";
import type { Profile } from "@/business/types/auth";
import { getBrowserClient } from "@/business/utils/supabase/client";
import { useEffect, useRef } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = getBrowserClient();

  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const setProfile = useAuthStore((s) => s.setProfile);
  const setProfileError = useAuthStore((s) => s.setProfileError);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  const reqId = useRef(0);
  const lastUserIdRef = useRef<string | null>(null);
  const bootstrappedRef = useRef(false);

  const fetchProfile = async (userId: string): Promise<boolean> => {
    const myReq = ++reqId.current;

    setProfileError(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, avatar, avatar_updated_at")
      .eq("id", userId)
      .maybeSingle<Profile>();

    if (myReq !== reqId.current) return false;

    if (error) {
      setProfile(null);
      setProfileError(error.message);
      return true;
    }

    if (!data) {
      setProfile(null);
      return true;
    }

    setProfile(data);
    return true;
  };

  useEffect(() => {
    void (async () => {
      // Don't mark the app "initialized" until we have attempted to load the profile
      // at least once after bootstrapping the auth session.
      if (!bootstrappedRef.current) return;

      const userId = session?.user?.id ?? null;

      if (!userId) {
        lastUserIdRef.current = null;
        reqId.current++;
        setProfile(null);
        setProfileError(null);
        setInitialized(true);
        return;
      }

      const profile = useAuthStore.getState().profile;
      const hasProfileForUser = profile?.id === userId;
      const isSameUser = lastUserIdRef.current === userId;

      if (isSameUser && hasProfileForUser) {
        setInitialized(true);
        return;
      }

      setInitialized(false);
      lastUserIdRef.current = userId;
      const applied = await fetchProfile(userId);
      // Only flip initialized back to true if this request wasn't superseded.
      if (applied) setInitialized(true);
    })();
  }, [session, setInitialized, setProfile, setProfileError]);

  useEffect(() => {
    let alive = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;

      const nextSession = data.session ?? null;
      bootstrappedRef.current = true;
      setSession(nextSession);

      // If the user is not authenticated, `setSession(null)` may not trigger a rerender
      // (e.g. initial store state is already null). Ensure we still mark the app initialized.
      if (!nextSession?.user?.id) {
        lastUserIdRef.current = null;
        reqId.current++;
        setProfile(null);
        setProfileError(null);
        setInitialized(true);
      }
    };

    bootstrap();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!alive) return;

        bootstrappedRef.current = true;
        const nextSession = session ?? null;
        setSession(nextSession);

        // Same edge case as bootstrap: keep guests initialized even if session stays null.
        if (!nextSession?.user?.id) {
          lastUserIdRef.current = null;
          reqId.current++;
          setProfile(null);
          setProfileError(null);
          setInitialized(true);
        }
      },
    );

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, setInitialized, setProfile, setProfileError, setSession]);

  return children;
}
