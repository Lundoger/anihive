"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  reauthenticate,
  updatePassword,
  useSessionStore,
} from "@/entities/session";

import type { Translator } from "@/shared/types/i18n";
import { Button } from "@/shared/ui/Button";
import { Field, FieldError, FieldGroup } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { Spinner } from "@/shared/ui/Spinner";

import SettingsBlock from "../SettingsBlock";

function createPasswordSchema(t: Translator) {
  return z
    .object({
      password: z
        .string()
        .min(1, { message: t("form.errors.passwordRequired") }),
      newPassword: z
        .string()
        .min(1, { message: t("form.errors.newPasswordRequired") })
        .min(8, { message: t("form.errors.newPasswordMin") })
        .regex(/[^\p{L}\p{N}\s]/u, {
          message: t("form.errors.newPasswordSpecial"),
        }),
      confirmNewPassword: z
        .string()
        .min(1, { message: t("form.errors.confirmPasswordRequired") }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("form.errors.passwordMatch"),
      path: ["confirmNewPassword"],
    });
}

type PasswordValues = z.infer<ReturnType<typeof createPasswordSchema>>;

export default function PasswordSettingsBlock() {
  const t = useTranslations("settings.tabs.content.account.password");
  const schema = useMemo(() => createPasswordSchema(t), [t]);

  const user = useSessionStore((s) => s.user);

  const form = useForm<PasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", newPassword: "", confirmNewPassword: "" },
    mode: "onChange",
  });

  async function onSubmit(values: PasswordValues) {
    if (!user?.email) {
      toast.error("Not authenticated");
      return;
    }

    if (values.newPassword === values.password) {
      toast.warning(t("form.toast.noChanges"));
      return;
    }

    const { error: reauthError } = await reauthenticate({
      email: user.email,
      password: values.password,
    });

    if (reauthError) {
      toast.error(t("form.toast.reauthFailed"));
      return;
    }

    const { error: updateError } = await updatePassword(values.newPassword);

    if (updateError) {
      toast.error(updateError);
      return;
    }

    toast.success(t("form.toast.success"));
    form.reset({ password: "", newPassword: "", confirmNewPassword: "" });
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
        className="flex flex-col gap-3 sm:items-start"
      >
        <FieldGroup className="flex-1 gap-4">
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="max-w-[500px] gap-1"
              >
                <div className="relative">
                  <Input
                    {...field}
                    id="settings-password-current"
                    type="password"
                    placeholder={t("form.placeholders.current")}
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
          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="max-w-[500px] gap-1"
              >
                <div className="relative">
                  <Input
                    {...field}
                    id="settings-password-new"
                    type="password"
                    placeholder={t("form.placeholders.new")}
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
          <Controller
            name="confirmNewPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="max-w-[500px] gap-1"
              >
                <div className="relative">
                  <Input
                    {...field}
                    type="password"
                    id="settings-password-confirm-new"
                    placeholder={t("form.placeholders.confirm")}
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

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="min-h-12 w-full min-w-[220px] rounded-xl text-sm sm:w-fit"
            disabled={isSubmitting}
            ripple
          >
            {isSubmitting ? <Spinner /> : t("form.submit")}
          </Button>
        </div>
      </form>
    </SettingsBlock>
  );
}
