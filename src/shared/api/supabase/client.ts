import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = () =>
  createBrowserClient(supabaseUrl!, supabaseKey!);

let browserClient: SupabaseClient | null = null;

/**
 * Singleton Supabase client for the browser.
 * Use this for long-lived subscriptions (e.g. auth state).
 */
export const getBrowserClient = (): SupabaseClient => {
  if (browserClient) return browserClient;
  browserClient = createClient();
  return browserClient;
};
