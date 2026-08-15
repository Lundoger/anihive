import { create } from "zustand";

import type { ProfileState } from "./types";

export const useProfileStore = create<ProfileState>((set) => ({
  status: "idle",
  profile: null,
  error: null,
  retryToken: 0,

  setLoading: () => set({ status: "loading", error: null }),
  setProfile: (profile) => set({ status: "ready", profile, error: null }),
  setError: (error) => set({ status: "error", profile: null, error }),
  clear: () => set({ status: "idle", profile: null, error: null }),

  retry: () => set((s) => ({ retryToken: s.retryToken + 1 })),
}));
