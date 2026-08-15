export type Profile = {
  id: string;
  username: string;
  created_at: string;
  avatar: string | null;
  avatar_updated_at: string | null;
};

/**
 * `idle` — nobody is signed in, so there is nothing to load.
 * `ready` — the row was read; `profile` may still be null if it does not exist.
 * `error` — the read failed and every automatic retry was used up.
 */
export type ProfileStatus = "idle" | "loading" | "ready" | "error";

export type ProfileState = {
  status: ProfileStatus;
  profile: Profile | null;
  error: string | null;
  /** Bumped by `retry()` to ask useProfileSync for a fresh read. */
  retryToken: number;

  setLoading: () => void;
  setProfile: (profile: Profile | null) => void;
  setError: (error: string) => void;
  clear: () => void;
  retry: () => void;
};
