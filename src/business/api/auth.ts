"use server";
// import { revalidatePath } from "next/cache";
import { getBrowserClient } from "@/business/utils/supabase/client";
import { createClient } from "@/business/utils/supabase/server";

type SignParams = {
  email: string;
  password: string;
};

export const signUp = async ({ email, password }: SignParams) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
};

export const serverSignIn = async ({ email, password }: SignParams) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }
  return { error: null };
};

export const serverSignOut = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return { error: null };
};
