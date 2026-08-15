import { create } from "zustand";

import { serverSignOut } from "../api";
import type { SessionState } from "./types";

export const useSessionStore = create<SessionState>((set) => ({
  status: "loading",

  session: null,
  user: null,

  setSession: (session) =>
    set({
      status: "ready",
      session,
      user: session?.user ?? null,
    }),

  // Sign-out runs as a server action, so the browser client never emits
  // SIGNED_OUT and the session has to be dropped here by hand. Dropping it is
  // enough to clear the profile too: useProfileSync sees a null user id.
  signOut: async () => {
    const { error } = await serverSignOut();

    if (error) return { error };

    set({ status: "ready", session: null, user: null });

    return { error: null };
  },
}));

/** Read by the App layer to drive useProfileSync. */
export const useSessionUserId = () =>
  useSessionStore((s) => s.user?.id ?? null);
