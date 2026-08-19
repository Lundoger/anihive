import { getBrowserClient } from "@/shared/api/supabase/client";

import type { Profile } from "../model/types";
import { PROFILE_COLUMNS } from "./columns";

const BUCKET = "avatars";

/**
 * Every extension a stored avatar can have. Uploading a new one has to sweep
 * all of them, otherwise a png left over from before would keep occupying the
 * slot next to a freshly uploaded jpg.
 */
const AVATAR_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];

type AvatarResult = { profile: Profile | null; error: string | null };

function failed(err: unknown, fallback: string): AvatarResult {
  return {
    profile: null,
    error: err instanceof Error ? err.message : fallback,
  };
}

/** Stores the file and points the profile row at it. */
export async function uploadAvatar({
  userId,
  file,
}: {
  userId: string;
  file: File;
}): Promise<AvatarResult> {
  try {
    const supabase = getBrowserClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${userId}/avatar.${ext}`;

    await supabase.storage
      .from(BUCKET)
      .remove(AVATAR_EXTENSIONS.map((e) => `${userId}/avatar.${e}`));

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) return { profile: null, error: uploadError.message };

    const { data, error } = await supabase
      .from("profiles")
      .update({ avatar: path, avatar_updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select(PROFILE_COLUMNS)
      .single<Profile>();

    if (error) return { profile: null, error: error.message };

    return { profile: data, error: null };
  } catch (err) {
    return failed(err, "Failed to upload avatar");
  }
}

/** Drops the stored file and clears the reference on the profile row. */
export async function removeAvatar({
  userId,
  path,
}: {
  userId: string;
  path: string;
}): Promise<AvatarResult> {
  try {
    const supabase = getBrowserClient();

    const { error: removeError } = await supabase.storage
      .from(BUCKET)
      .remove([path]);

    if (removeError) return { profile: null, error: removeError.message };

    const { data, error } = await supabase
      .from("profiles")
      .update({ avatar: null })
      .eq("id", userId)
      .select(PROFILE_COLUMNS)
      .single<Profile>();

    if (error) return { profile: null, error: error.message };

    return { profile: data, error: null };
  } catch (err) {
    return failed(err, "Failed to remove avatar");
  }
}
