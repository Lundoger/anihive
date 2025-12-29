"use client";

import { getBrowserClient } from "@/business/utils/supabase/client";
import { Button } from "@/shared/components/Button";
import { Field, FieldError, FieldLabel } from "@/shared/components/Field";
import { Input } from "@/shared/components/Input";
import { Spinner } from "@/shared/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Translator = ReturnType<typeof useTranslations>;

function createForgotPasswordSchema(t: Translator) {
  return z.object({
    email: z
      .string()
      .min(1, { message: t("errors.emailRequired") })
      .email({ message: t("errors.emailInvalid") }),
  });
}

type ForgotPasswordValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

export function ForgorPasswordForm() {
  const t = useTranslations("forgotPassword.form");
  const forgotPasswordSchema = useMemo(
    () => createForgotPasswordSchema(t),
    [t],
  );
  const supabase = getBrowserClient();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgotPasswordValues) {
    startTransition(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email);
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(t("toast.emailSent"));

      sessionStorage.setItem("pending_verify_email", values.email);
      router.push("/reset-password");
    });
  }

  return (
    <form
      id="forgot-password-form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-3"
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="relative">
              <FieldLabel htmlFor="forgot-password-email">
                {t("email")}
              </FieldLabel>
              <Input
                {...field}
                id="forgot-password-email"
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                prefixIcon={<Mail />}
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? <Spinner /> : t("send")}
      </Button>
    </form>
  );
}
