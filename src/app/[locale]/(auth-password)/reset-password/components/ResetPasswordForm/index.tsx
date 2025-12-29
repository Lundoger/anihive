"use client";

import { useAuthStore } from "@/business/stores/auth";
import { getBrowserClient } from "@/business/utils/supabase/client";
import { Button } from "@/shared/components/Button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/Field";
import { Input } from "@/shared/components/Input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/InputOTP";
import { Spinner } from "@/shared/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { KeyRound, RotateCcwKey } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Translator = ReturnType<typeof useTranslations>;

function createResetPasswordSchema(t: Translator) {
  return z
    .object({
      token: z.string().min(1, { message: t("errors.tokenRequired") }),
      password: z
        .string()
        .min(1, { message: t("errors.passwordRequired") })
        .min(8, { message: t("errors.passwordMin") })
        .regex(/[^\p{L}\p{N}\s]/u, {
          message: t("errors.passwordSpecial"),
        }),
      confirmPassword: z
        .string()
        .min(1, { message: t("errors.confirmPasswordRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("errors.passwordMatch"),
      path: ["confirmPassword"],
    });
}

type ResetPasswordValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;

export function ResetPasswordForm() {
  const t = useTranslations("resetPassword.form");
  const resetPasswordSchema = useMemo(() => createResetPasswordSchema(t), [t]);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const supabase = getBrowserClient();
  const params = useSearchParams();
  const emailFromQuery = params.get("email");

  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  // get email from query or session storage for verify the user acc
  const email = useMemo(() => {
    if (emailFromQuery) return emailFromQuery;
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("pending_verify_email") ?? "";
  }, [emailFromQuery]);

  useEffect(() => {
    if (emailFromQuery) {
      sessionStorage.setItem("pending_verify_email", emailFromQuery);
    }
  }, [emailFromQuery]);

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
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: values.token,
        type: "recovery",
      });

      if (error) {
        form.setError("token", { message: error.message });
        toast.error(error.message);
        return;
      }

      sessionStorage.removeItem("pending_verify_email");

      if (data.session) setSession(data.session);
      setInitialized(true);

      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (updateError) {
        toast.error(updateError.message);
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
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? <Spinner /> : t("reset")}
        </Button>
      </div>
    </form>
  );
}
