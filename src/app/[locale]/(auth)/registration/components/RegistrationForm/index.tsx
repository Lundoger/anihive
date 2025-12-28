"use client";

import { signUp } from "@/business/api/auth";
import { Button } from "@/shared/components/Button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/Field";
import { Input } from "@/shared/components/Input";
import { Spinner } from "@/shared/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Mail, RotateCcwKey } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Translator = ReturnType<typeof useTranslations>;
function createRegistrationSchema(t: Translator) {
  return z
    .object({
      email: z
        .string()
        .min(1, { message: t("errors.emailRequired") })
        .email({ message: t("errors.emailInvalid") }),
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

type RegistrationValues = z.infer<ReturnType<typeof createRegistrationSchema>>;

export function RegistrationForm() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("registration.form");
  const registrationSchema = useMemo(() => createRegistrationSchema(t), [t]);
  const router = useRouter();
  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: RegistrationValues) {
    startTransition(async () => {
      const { error } = await signUp(values);
      if (error) {
        toast.error(t("toast.registrationFailed"), {
          description: error,
        });
        return;
      }

      toast.success(t("toast.registrationPending"));
      sessionStorage.setItem("pending_verify_email", values.email);
      router.push("/verify-email");
    });
  }

  return (
    <form
      id="registration-form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-3"
    >
      <FieldGroup className="gap-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="relative">
                <FieldLabel htmlFor="registration-email">
                  {t("email")}
                </FieldLabel>
                <Input
                  {...field}
                  id="registration-email"
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

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="relative">
                <FieldLabel htmlFor="registration-password">
                  {t("password")}
                </FieldLabel>
                <Input
                  {...field}
                  id="registration-password"
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
                <FieldLabel htmlFor="registration-confirm-password">
                  {t("confirmPassword")}
                </FieldLabel>
                <Input
                  {...field}
                  id="registration-confirm-password"
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

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? <Spinner /> : t("register")}
      </Button>
    </form>
  );
}
