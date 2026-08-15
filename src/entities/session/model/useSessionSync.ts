"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect } from "react";

import { getBrowserClient } from "@/shared/api/supabase/client";

import { useSessionStore } from "./store";

/**
 * Makes the session store follow Supabase auth for the lifetime of the app.
 *
 * The initial read and every later auth event go through the same handler, so it
 * does not matter whether the client emits INITIAL_SESSION on subscribe —
 * applying the same session twice is a no-op either way.
 */
export function useSessionSync() {
  useEffect(() => {
    const supabase = getBrowserClient();
    let alive = true;

    const apply = (session: Session | null) => {
      if (!alive) return;
      useSessionStore.getState().setSession(session);
    };

    void supabase.auth.getSession().then(
      ({ data }) => apply(data.session ?? null),
      // A failed read still answers the question: there is no session.
      () => apply(null),
    );

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      apply(session ?? null),
    );

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);
}
