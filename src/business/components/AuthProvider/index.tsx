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

  const fetchProfile = async (
    userId: string,
    requestId: number,
  ): Promise<void> => {
    setProfileError(null);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar, avatar_updated_at")
        .eq("id", userId)
        .maybeSingle<Profile>();

      if (requestId !== reqId.current) return;

      if (error) {
        setProfile(null);
        setProfileError(error.message);
        return;
      }

      if (!data) {
        setProfile(null);
        return;
      }

      setProfile(data);
    } catch (err) {
      if (requestId !== reqId.current) return;
      setProfile(null);
      setProfileError(err instanceof Error ? err.message : "Failed to load profile");
    }
  };

  useEffect(() => {
    void (async () => {
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
      const myReq = ++reqId.current;

      try {
        await fetchProfile(userId, myReq);
      } finally {
        // Always mark initialized when this run is still current (not superseded).
        if (myReq === reqId.current) {
          setInitialized(true);
        }
      }
    })();
  }, [session, setInitialized, setProfile, setProfileError]);

  useEffect(() => {
    let alive = true;

    const bootstrap = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!alive) return;

        const nextSession = data.session ?? null;
        bootstrappedRef.current = true;
        setSession(nextSession);

        if (!nextSession?.user?.id) {
          lastUserIdRef.current = null;
          reqId.current++;
          setProfile(null);
          setProfileError(null);
          setInitialized(true);
        }
      } catch {
        if (!alive) return;
        bootstrappedRef.current = true;
        setSession(null);
        setProfile(null);
        setProfileError(null);
        setInitialized(true);
      }
    };

    bootstrap();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!alive) return;
        try {
          bootstrappedRef.current = true;
          const nextSession = session ?? null;
          setSession(nextSession);

          if (!nextSession?.user?.id) {
            lastUserIdRef.current = null;
            reqId.current++;
            setProfile(null);
            setProfileError(null);
            setInitialized(true);
          }
        } catch {
          if (!alive) return;
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
