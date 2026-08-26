"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import {
  buildAvatarUrl,
  removeAvatar,
  uploadAvatar,
  useProfileStore,
} from "@/entities/profile";
import { useSessionStore } from "@/entities/session";

import type { Translator } from "@/shared/types/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { Field, FieldError } from "@/shared/ui/Field";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Spinner } from "@/shared/ui/Spinner";

import SettingsBlock from "../SettingsBlock";

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

  const { userId, email } = useSessionStore(
    useShallow((s) => ({
      userId: s.user?.id ?? null,
      email: s.user?.email ?? null,
    })),
  );
  const { username, avatarPath, avatarUpdatedAt, profileStatus } =
    useProfileStore(
      useShallow((s) => ({
        username: s.profile?.username ?? null,
        avatarPath: s.profile?.avatar ?? null,
        avatarUpdatedAt: s.profile?.avatar_updated_at ?? null,
        profileStatus: s.status,
      })),
    );
  const setProfile = useProfileStore((s) => s.setProfile);
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
    return buildAvatarUrl(avatarPath, avatarUpdatedAt);
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
      const { profile, error } = await removeAvatar({
        userId,
        path: avatarPath,
      });

      if (error) {
        toast.error(error);
        return;
      }

      clearSelectedFile();
      setProfile(profile);
      toast.success(t("form.toast.successRemove"));
    });
  }

  async function onSubmit(values: AvatarValues) {
    if (!userId) {
      toast.error("Not authenticated");
      return;
    }

    const { profile, error } = await uploadAvatar({
      userId,
      file: values.file,
    });

    if (error) {
      toast.error(error);
      return;
    }

    setProfile(profile);
    toast.success(t("form.toast.successUpdate"));
    clearSelectedFile();
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
                {profileStatus === "idle" ||
                profileStatus === "loading" ||
                isPending ? (
                  <Skeleton className="size-24 rounded-2xl" />
                ) : (
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
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-fit"
                    onClick={openFilePicker}
                    ripple
                  >
                    {t("form.pick")}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-fit"
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
            className="relative w-full min-w-[220px] sm:w-fit"
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
