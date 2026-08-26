import { getBrowserClient } from "@/shared/api/supabase/client";

export function buildAvatarUrl(
  avatarPath: string | null | undefined,
  avatarUpdatedAt?: string | null,
) {
  if (!avatarPath) return "";

  const { data } = getBrowserClient()
    .storage.from("avatars")
    .getPublicUrl(avatarPath);

  const v = avatarUpdatedAt ? new Date(avatarUpdatedAt).getTime() : 0;

  return v ? `${data.publicUrl}?v=${v}` : data.publicUrl;
}
