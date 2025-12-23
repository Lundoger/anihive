import { serverSignOut } from "@/business/api/auth";
import type { Profile } from "@/business/types/auth";
import type { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { create } from "zustand";

type AuthState = {
  initialized: boolean;

  // Auth
  session: Session | null;
  user: User | null;

  // Profile
  profile: Profile | null;
  profileError: string | null;

  // Actions
  setSession: (session: Session | null) => void;
  setInitialized: (v: boolean) => void;

  setProfile: (p: Profile | null) => void;
  setProfileError: (e: string | null) => void;

  reset: () => void;
  signOut: () => Promise<{ error: string | null }>;
};

export const useAuthStore = create<AuthState>((set) => ({
  initialized: false,

  session: null,
  user: null,

  profile: null,
  profileError: null,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
    }),

  setInitialized: (v) => set({ initialized: v }),

  setProfile: (p) => set({ profile: p }),
  setProfileError: (e) => set({ profileError: e }),

  reset: () =>
    set({
      initialized: false,
      session: null,
      user: null,
      profile: null,
      profileError: null,
    }),

  signOut: async () => {
    const { error } = await serverSignOut();

    if (error) {
      toast.error("Sign out failed", { description: error });
      return { error };
    }

    set({
      session: null,
      user: null,
      profile: null,
      profileError: null,
    });

    toast.success("Signed out successfully");
    return { error: null };
  },
}));
