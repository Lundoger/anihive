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
          setAuth(session ?? null);
          setInitialized(true);
        },
      );

      unsubscribe = () => sub.subscription.unsubscribe();
    })();

    return () => unsubscribe?.();
  }, [supabase, setAuth, setInitialized]);

  return children;
}
