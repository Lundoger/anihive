import type { SupabaseClient } from "@supabase/supabase-js";

export function buildAvatarUrl(
  supabase: SupabaseClient,
  avatarPath: string | null | undefined,
  avatarUpdatedAt?: string | null,
) {
  if (!avatarPath) return "";

  const { data } = supabase.storage.from("avatars").getPublicUrl(avatarPath);
  const v = avatarUpdatedAt ? new Date(avatarUpdatedAt).getTime() : 0;

  return v ? `${data.publicUrl}?v=${v}` : data.publicUrl;
}
