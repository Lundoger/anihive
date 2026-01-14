"use client";

import { useAuthStore } from "@/business/stores/auth";
import { buildAvatarUrl } from "@/business/utils/avatar";
import { getBrowserClient } from "@/business/utils/supabase/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/Avatar";
import { Button } from "@/shared/components/Button";
import { Field, FieldError } from "@/shared/components/Field";
import { Skeleton } from "@/shared/components/Skeleton";
import { Spinner } from "@/shared/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import SettingsBlock from "../SettingsBlock";

type Translator = ReturnType<typeof useTranslations>;

function createAvatarSchema(t: Translator) {
  const maxSizeBytes = 5 * 1024 * 1024;
  return z.object({
    file: z
      .instanceof(File, { message: t("form.errors.required") })
      .refine((f) => f.type.startsWith("image/"), {
        message: t("form.errors.type"),
      })
      .refine((f) => f.size <= maxSizeBytes, {
        message: t("form.errors.size"),
      }),
  });
}

type AvatarValues = z.infer<ReturnType<typeof createAvatarSchema>>;

export default function AvatarSettingsBlock() {
  const t = useTranslations("settings.tabs.content.account.avatar");
  const schema = useMemo(() => createAvatarSchema(t), [t]);
  const [isPending, startTransition] = useTransition();

  const { userId, email, username, avatarPath, avatarUpdatedAt, initialized } =
    useAuthStore(
      useShallow((s) => ({
        userId: s.user?.id ?? null,
        email: s.user?.email ?? null,
        username: s.profile?.username ?? null,
        avatarPath: s.profile?.avatar ?? null,
        avatarUpdatedAt: s.profile?.avatar_updated_at ?? null,
        initialized: s.initialized,
      })),
    );
  const setProfile = useAuthStore((s) => s.setProfile);
  const supabase = getBrowserClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<AvatarValues>({
    resolver: zodResolver(schema),
    defaultValues: { file: undefined as never },
    mode: "onChange",
  });

  const file = form.watch("file");
  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const currentAvatarUrl = useMemo(() => {
    return buildAvatarUrl(supabase, avatarPath, avatarUpdatedAt);
  }, [avatarPath, avatarUpdatedAt]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const fallbackLetter = useMemo(() => {
    return (username ?? email ?? "U").charAt(0).toUpperCase();
  }, [username, email]);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function clearSelectedFile() {
    form.resetField("file");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function deleteAvatar() {
    if (!userId) {
      toast.error("Not authenticated");
      return;
    }

    if (!avatarPath) return;

    startTransition(async () => {
      try {
        const { error: removeError } = await supabase.storage
          .from("avatars")
          .remove([avatarPath]);

        if (removeError) {
          toast.error(removeError.message);
          return;
        }

        const { data: updatedProfile, error: profileError } = await supabase
          .from("profiles")
          .update({ avatar: null })
          .eq("id", userId)
          .select("*")
          .single();

        if (profileError) {
          toast.error(profileError.message);
          return;
        }

        clearSelectedFile();
        setProfile(updatedProfile);
        toast.success(t("form.toast.successRemove"));
      } catch (e: any) {
        toast.error(e?.message ?? t("form.toast.failedRemove"));
      }
    });
  }

  async function onSubmit(values: AvatarValues) {
    if (!userId) {
      toast.error("Not authenticated");
      return;
    }

    try {
      const file = values.file;
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";

      await supabase.storage
        .from("avatars")
        .remove([
          `${userId}/avatar.png`,
          `${userId}/avatar.jpg`,
          `${userId}/avatar.jpeg`,
          `${userId}/avatar.webp`,
        ]);

      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }

      const now = new Date().toISOString();
      const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .update({ avatar: path, avatar_updated_at: now })
        .eq("id", userId)
        .select("*")
        .single();

      if (profileError) {
        toast.error(profileError.message);
        return;
      }

      setProfile(updatedProfile);

      toast.success(t("form.toast.successUpdate"));
      clearSelectedFile();
    } catch (e: any) {
      toast.error(e?.message ?? t("form.toast.uploadFailed"));
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <SettingsBlock
      title={t("title")}
      description={t("description")}
      contentClassName="gap-5"
    >
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Controller
          name="file"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.currentTarget.files?.[0];
                  if (f) field.onChange(f);
                }}
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {initialized && !isPending ? (
                  <Avatar className="size-24 rounded-2xl">
                    <AvatarImage
                      src={previewUrl || currentAvatarUrl || undefined}
                      alt={`${username ?? email ?? "user"} avatar`}
                      className="rounded-2xl object-cover"
                    />
                    {Boolean(!previewUrl && !currentAvatarUrl) && (
                      <AvatarFallback className="rounded-2xl text-2xl font-semibold uppercase">
                        {fallbackLetter}
                      </AvatarFallback>
                    )}
                  </Avatar>
                ) : (
                  <Skeleton className="size-24 rounded-2xl" />
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="h-12 w-full rounded-xl text-sm sm:w-fit"
                    onClick={openFilePicker}
                    ripple
                  >
                    {t("form.pick")}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="h-12 w-full rounded-xl text-sm sm:w-fit"
                    onClick={deleteAvatar}
                    disabled={!avatarPath}
                    ripple
                  >
                    {t("form.remove")}
                  </Button>
                </div>
              </div>

              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="relative h-12 w-full min-w-[220px] rounded-xl text-sm sm:w-fit"
            disabled={isSubmitting || !file}
            ripple
            aria-busy={isSubmitting || isPending}
          >
            {isSubmitting ? <Spinner /> : t("form.submit")}
          </Button>
        </div>
      </form>
    </SettingsBlock>
  );
}
