"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useSessionStore } from "@/entities/session";

import { getBrowserClient } from "@/shared/api/supabase/client";
import { Button } from "@/shared/components/Button";
import { Field, FieldError, FieldGroup } from "@/shared/components/Field";
import { Input } from "@/shared/components/Input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/InputOTP";
import { Spinner } from "@/shared/components/Spinner";

import SettingsBlock from "../SettingsBlock";

type Translator = ReturnType<typeof useTranslations>;

function createEmailSchema(t: Translator) {
  return z.object({
    email: z
      .string()
      .min(1, { message: t("form.errors.required") })
      .email({ message: t("form.errors.invalid") }),
    token: z.string().min(1, { message: t("form.errors.tokenRequired") }),
  });
}

type EmailValues = z.infer<ReturnType<typeof createEmailSchema>>;

export default function EmailSettingsBlock() {
  const t = useTranslations("settings.tabs.content.account.email");
  const schema = useMemo(() => createEmailSchema(t), [t]);

  const user = useSessionStore((s) => s.user);
  const supabase = getBrowserClient();

  const [isSendingToken, setIsSendingToken] = useState(false);

  const form = useForm<EmailValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: user?.email ?? "", token: "" },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({ email: user?.email ?? "", token: "" });
  }, [user?.email]);

  async function handleSendToken() {
    const ok = await form.trigger("email");
    if (!ok) return;

    const newEmail = form.getValues("email").trim().toLowerCase();
    if (!user?.id) {
      toast.error("Not authenticated");
      return;
    }
    if (newEmail === (user.email ?? "").toLowerCase()) {
      toast.warning(t("form.toast.sameEmail"));
      return;
    }

    setIsSendingToken(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(t("form.toast.tokenSent"));
      form.setFocus("token");
    } finally {
      setIsSendingToken(false);
    }
  }

  async function onSubmit(values: EmailValues) {
    const newEmail = values.email.trim().toLowerCase();

    const { data, error } = await supabase.auth.verifyOtp({
      email: newEmail,
      token: values.token,
      type: "email_change",
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(t("form.toast.success"));
    form.reset({ email: newEmail, token: "" });
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
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="max-w-[500px] gap-1"
              >
                <div className="relative">
                  <Input
                    {...field}
                    id="settings-email"
                    placeholder={t("form.placeholders.email")}
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
            name="token"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("form.placeholders.token")}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  aria-invalid={fieldState.invalid}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="min-h-12 w-full min-w-[220px] rounded-xl text-sm sm:w-fit"
            disabled={isSendingToken}
            onClick={handleSendToken}
            ripple
          >
            {isSendingToken ? <Spinner /> : t("form.sendToken")}
          </Button>
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
