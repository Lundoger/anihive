"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateUsername, useProfileStore } from "@/entities/profile";
import { useSessionStore } from "@/entities/session";

import type { Translator } from "@/shared/types/i18n";
import { Button } from "@/shared/ui/Button";
import { Field, FieldError, FieldGroup } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { Spinner } from "@/shared/ui/Spinner";

import SettingsBlock from "../SettingsBlock";

function createNicknameSchema(t: Translator) {
  return z.object({
    nickname: z
      .string()
      .min(1, { message: t("nickname.form.errors.required") })
      .min(3, { message: t("nickname.form.errors.min") })
      .max(20, { message: t("nickname.form.errors.max") })
      .regex(/^[A-Za-z0-9_]+$/, { message: t("nickname.form.errors.format") }),
  });
}

type NicknameValues = z.infer<ReturnType<typeof createNicknameSchema>>;

export default function NicknameSettingsBlock() {
  const t = useTranslations("settings.tabs.content.account");
  const schema = useMemo(() => createNicknameSchema(t), [t]);

  const user = useSessionStore((s) => s.user);
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);

  const form = useForm<NicknameValues>({
    resolver: zodResolver(schema),
    defaultValues: { nickname: profile?.username ?? "" },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({ nickname: profile?.username ?? "" });
  }, [profile?.username]);

  async function onSubmit(values: NicknameValues) {
    const next = values.nickname.trim();

    if (!user?.id) {
      toast.error("Not authenticated");
      return;
    }

    if ((profile?.username ?? "") === next) {
      toast.warning(t("nickname.form.toast.noChanges"));
      return;
    }

    const { profile: updated, error } = await updateUsername({
      userId: user.id,
      username: next,
    });

    if (error) {
      toast.error(error);
      return;
    }

    setProfile(updated);
    toast.success(t("nickname.form.toast.success"));
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <SettingsBlock
      title={t("nickname.title")}
      description={t("nickname.description")}
      contentClassName="gap-5"
    >
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <FieldGroup className="flex-1 gap-2">
          <Controller
            name="nickname"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="relative">
                  <Input
                    {...field}
                    id="settings-nickname"
                    placeholder={t("nickname.form.placeholder")}
                    aria-invalid={fieldState.invalid}
                    className="h-12 rounded-xl bg-transparent py-0 text-base font-medium focus-visible:border-white"
                  />
                </div>
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          variant="secondary"
          className="basis-1/6 sm:w-fit"
          disabled={isSubmitting}
          ripple
        >
          {isSubmitting ? <Spinner /> : t("nickname.form.submit")}
        </Button>
      </form>
    </SettingsBlock>
  );
}
