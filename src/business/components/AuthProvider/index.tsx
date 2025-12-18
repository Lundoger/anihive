"use client";

import { useAuthStore } from "@/business/stores/auth";
import { getBrowserClient } from "@/business/utils/supabase/client";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = getBrowserClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      const { data } = await supabase.auth.getSession();
      setAuth(data.session ?? null);
      setInitialized(true);

      const { data: sub } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          console.log("event", _event);
          console.log("session", session);
          setAuth(session ?? null);
        },
      );

      unsubscribe = () => sub.subscription.unsubscribe();
    })();

    return () => unsubscribe?.();
  }, [supabase, setAuth, setInitialized]);

  return children;
}
