"use client";

import { useAuthStore } from "@/business/stores/auth";
import { getBrowserClient } from "@/business/utils/supabase/client";
import { Button } from "@/shared/components/Button";
import { Field, FieldError, FieldGroup } from "@/shared/components/Field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/shared/components/InputOTP";
import { Spinner } from "@/shared/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
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
  const supabase = getBrowserClient();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      token: "",
    },
  });

  function onSubmit(values: VerifyEmailValues) {
    console.log("values", values);
    startTransition(async () => {
      toast.success(t("toast.verifySuccessful"));

      router.replace("/");
      router.refresh();
    });
  }

  return (
    <form
      id="verify-email-form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-3"
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
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? <Spinner /> : t("verify")}
      </Button>
    </form>
  );
}
