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

  const fetchProfile = async (userId: string) => {
    const myReq = ++reqId.current;

    setProfileError(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, avatar")
      .eq("id", userId)
      .maybeSingle<Profile>();

    if (myReq !== reqId.current) return;

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
  };

  useEffect(() => {
    void (async () => {
      const userId = session?.user?.id ?? null;

      if (!userId) {
        lastUserIdRef.current = null;
        reqId.current++;
        setProfile(null);
        setProfileError(null);
        return;
      }

      const profile = useAuthStore.getState().profile;
      const hasProfileForUser = profile?.id === userId;
      const isSameUser = lastUserIdRef.current === userId;

      if (isSameUser && hasProfileForUser) return;

      lastUserIdRef.current = userId;
      await fetchProfile(userId);
    })();
  }, [session, setProfile, setProfileError]);

  useEffect(() => {
    let alive = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;

      setSession(data.session ?? null);
      if (alive) setInitialized(true);
    };

    bootstrap();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!alive) return;

        setSession(session ?? null);
        if (alive) setInitialized(true);
      },
    );

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, setSession, setProfile, setProfileError, setInitialized]);

  return children;
}
