"use client";

import { useAuthStore } from "@/business/stores/auth";
import { getBrowserClient } from "@/business/utils/supabase/client";
import { Button } from "@/shared/components/Button";
import { Field, FieldError, FieldGroup } from "@/shared/components/Field";
import { Input } from "@/shared/components/Input";
import { Spinner } from "@/shared/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SettingsBlock from "../SettingsBlock";

type Translator = ReturnType<typeof useTranslations>;

function createAvatarSchema(t: Translator) {
  return z.object({
    avatar: z.string().min(1, { message: t("avatar.form.errors.required") }),
  });
}

type AvatarValues = z.infer<ReturnType<typeof createAvatarSchema>>;

export default function AvatarSettingsBlock() {
  const t = useTranslations("settings.tabs.content.account.avatar");
  const schema = useMemo(() => createAvatarSchema(t), [t]);

  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const setProfile = useAuthStore((s) => s.setProfile);

  const supabase = getBrowserClient();

  const form = useForm<AvatarValues>({
    resolver: zodResolver(schema),
    defaultValues: { avatar: profile?.avatar ?? "" },
    mode: "onChange",
  });

  // useEffect(() => {
  //   form.reset({ avatar: profile?.avatar ?? "" });
  // }, [profile?.username]);

  async function onSubmit(values: AvatarValues) {}

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
            name="avatar"
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
          className="min-h-12 basis-1/6 rounded-xl text-sm sm:w-fit"
          disabled={isSubmitting}
          ripple
        >
          {isSubmitting ? <Spinner /> : t("nickname.form.submit")}
        </Button>
      </form>
    </SettingsBlock>
  );
}
