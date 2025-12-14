"use client";

import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

export const useAuthStore = create<any>()((set) => ({
  status: "loading",
  session: null,
  user: null,
}));
