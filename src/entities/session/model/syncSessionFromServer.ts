import { getBrowserClient } from "@/shared/api/supabase/client";

import { useSessionStore } from "./store";

/**
 * Pulls the session the server has just written into the store.
 *
 * Needed after a sign-in that ran as a server action: the cookie changes on the
 * server, so the browser client has no auth event to emit and the store would
 * keep serving the previous session until the next full reload.
 */
export async function syncSessionFromServer() {
  const { data } = await getBrowserClient().auth.getSession();

  useSessionStore.getState().setSession(data.session ?? null);
}
