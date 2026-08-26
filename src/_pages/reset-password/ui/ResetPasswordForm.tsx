"use client";

import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { KeyRound, RotateCcwKey } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  confirmPasswordRecovery,
  pendingVerifyEmail,
  updatePassword,
  usePendingVerifyEmail,
} from "@/entities/session";

import { Button } from "@/shared/ui/Button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/ui/InputOTP";
import { Spinner } from "@/shared/ui/Spinner";

import {
  type ResetPasswordValues,
  createResetPasswordSchema,
} from "../model/schema";

export function ResetPasswordForm() {
  const t = useTranslations("resetPassword.form");
  const resetPasswordSchema = useMemo(() => createResetPasswordSchema(t), [t]);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const params = useSearchParams();
  const emailFromQuery = params?.get("email");

  const email = usePendingVerifyEmail(emailFromQuery);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordValues) => {
    if (!email) {
      toast.error(t("errors.missingEmail"));
      return;
    }

    startTransition(async () => {
      // Runs on the browser client, so useSessionSync picks the new session up
      // from onAuthStateChange — no manual store write needed here.
      const { error } = await confirmPasswordRecovery({
        email,
        token: values.token,
      });

      if (error) {
        form.setError("token", { message: error });
        toast.error(error);
        return;
      }

      pendingVerifyEmail.clear();

      const { error: updateError } = await updatePassword(values.password);

      if (updateError) {
        toast.error(updateError);
        return;
      }

      toast.success(t("toast.resetSuccessful"));
      router.replace("/login");
      router.refresh();
    });
  };

  return (
    <form
      id="reset-password-form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center space-y-6"
    >
      <FieldGroup className="gap-4">
        <Controller
          name="token"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex items-center justify-center [&>div]:justify-center"
            >
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
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
                <FieldError
                  className="text-center"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="relative">
                <FieldLabel htmlFor="reset-password-password">
                  {t("newPassword")}
                </FieldLabel>
                <Input
                  {...field}
                  id="reset-password-password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                  prefixIcon={<KeyRound />}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="relative">
                <FieldLabel htmlFor="reset-password-confirm-password">
                  {t("confirmPassword")}
                </FieldLabel>
                <Input
                  {...field}
                  id="reset-password-confirm-password"
                  type="password"
                  autoComplete="confirm-password"
                  aria-invalid={fieldState.invalid}
                  prefixIcon={<RotateCcwKey />}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex w-full max-w-[400px] flex-col gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? <Spinner /> : t("reset")}
        </Button>
      </div>
    </form>
  );
}
