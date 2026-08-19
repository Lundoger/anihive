"use client";

import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  confirmSignUp,
  pendingVerifyEmail,
  resendSignUpCode,
  usePendingVerifyEmail,
} from "@/entities/session";

import { Button } from "@/shared/ui/Button";
import { Field, FieldError, FieldGroup } from "@/shared/ui/Field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/ui/InputOTP";
import { Spinner } from "@/shared/ui/Spinner";

import {
  type VerifyEmailValues,
  createVerifyEmailSchema,
} from "../model/schema";

export function VerifyEmailForm() {
  const t = useTranslations("verifyEmail.form");
  const verifyEmailSchema = useMemo(() => createVerifyEmailSchema(t), [t]);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const params = useSearchParams();
  const emailFromQuery = params?.get("email");

  const email = usePendingVerifyEmail(emailFromQuery);

  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = (values: VerifyEmailValues) => {
    if (!email) {
      toast.error(t("errors.missingEmail"));
      return;
    }

    startTransition(async () => {
      // Runs on the browser client, so useSessionSync picks the new session up
      // from onAuthStateChange — no manual store write needed here.
      const { error } = await confirmSignUp({ email, token: values.token });

      if (error) {
        form.setError("token", { message: error });
        toast.error(error);
        return;
      }

      pendingVerifyEmail.clear();

      toast.success(t("toast.verifySuccessful"));
      router.replace("/");
      router.refresh();
    });
  };

  const handleResendCode = () => {
    if (!email) {
      toast.error(t("errors.missingEmail"));
      return;
    }
    startTransition(async () => {
      const { error } = await resendSignUpCode(email);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success(t("toast.resendSuccessful"));
    });
  };

  return (
    <form
      id="verify-email-form"
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
              {/* <FieldLabel>{t("token")}</FieldLabel> */}
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
      </FieldGroup>

      <div className="flex w-full max-w-[400px] flex-col gap-3">
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? <Spinner /> : t("verify")}
        </Button>
        <Button
          type="button"
          className="w-full"
          size="lg"
          variant="secondary"
          disabled={isPending}
          onClick={handleResendCode}
        >
          {isPending ? <Spinner /> : t("resend")}
        </Button>
      </div>
    </form>
  );
}
