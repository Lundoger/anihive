"use client";

import { useAuthStore } from "@/business/stores/auth";
import { getBrowserClient } from "@/business/utils/supabase/client";
import { Button } from "@/shared/components/Button";
import { Field, FieldError, FieldGroup } from "@/shared/components/Field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/InputOTP";
import { Spinner } from "@/shared/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Translator = ReturnType<typeof useTranslations>;

function createVerifyEmailSchema(t: Translator) {
  return z.object({
    token: z.string().min(1, { message: t("errors.tokenRequired") }),
  });
}

type VerifyEmailValues = z.infer<ReturnType<typeof createVerifyEmailSchema>>;

export function VerigyEmailForm() {
  const t = useTranslations("verifyEmail.form");
  const verifyEmailSchema = useMemo(() => createVerifyEmailSchema(t), [t]);

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
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: values.token,
        type: "email",
      });

      if (error) {
        form.setError("token", { message: error.message });
        toast.error(error.message);
        return;
      }

      sessionStorage.removeItem("pending_verify_email");

      if (data.session) setSession(data.session);
      setInitialized(true);

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
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) {
        toast.error(error.message);
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
