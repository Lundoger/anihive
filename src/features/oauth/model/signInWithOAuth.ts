import type { Provider } from "@supabase/supabase-js";
import { toast } from "sonner";

import { getBrowserClient } from "@/shared/api/supabase/client";

export const oauthSignIn = async (provider: Provider, next?: string) => {
  const supabase = getBrowserClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${next}`,
    },
  });

  if (error) {
    toast.error(error.message);
    return;
  }

  return;
};
