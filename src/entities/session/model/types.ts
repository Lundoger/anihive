import type { Session, User } from "@supabase/supabase-js";

/** `loading` until the first session read resolves, `ready` from then on. */
export type SessionStatus = "loading" | "ready";

export type SessionState = {
  status: SessionStatus;
  session: Session | null;
  user: User | null;

  setSession: (session: Session | null) => void;
  signOut: () => Promise<{ error: string | null }>;
};
