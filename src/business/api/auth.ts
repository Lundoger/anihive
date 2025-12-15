"use server";
// import { revalidatePath } from "next/cache";
import { createClient } from "@/business/utils/supabase/server";

type SignInParams = {
  email: string;
  password: string;
};
type SignUpParams = SignInParams & {
  username: string;
};

export const signUp = async ({ email, password, username }: SignUpParams) => {
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

export const signIn = async ({ email, password }: SignInParams) => {
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

export const signOut = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return { error: null };
};
