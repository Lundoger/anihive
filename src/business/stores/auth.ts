import { getBrowserClient } from "@/business/utils/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { create } from "zustand";

type AuthState = {
  initialized: boolean;
  session: Session | null;
  user: User | null;

  setAuth: (session: Session | null) => void;
  setInitialized: (v: boolean) => void;
  signOut: () => Promise<{ error: string | null }>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  initialized: false,
  session: null,
  user: null,

  setAuth: (session) => set({ session, user: session?.user ?? null }),
  setInitialized: (v) => set({ initialized: v }),
  signOut: async () => {
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign out failed", { description: error.message });
      return { error: error.message };
    }
    set({ session: null, user: null });
    toast.success("Signed out successfully");
    return { error: null };
  },
}));
