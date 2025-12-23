"use client";

import { serverSignIn } from "@/business/api/auth";
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
import { Spinner } from "@/shared/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Translator = ReturnType<typeof useTranslations>;

function createLoginSchema(t: Translator) {
  return z.object({
    email: z
      .string()
      .min(1, { message: t("errors.emailRequired") })
      .email({ message: t("errors.emailInvalid") }),
    password: z.string().min(1, { message: t("errors.passwordRequired") }),
  });
}

type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function LoginForm() {
  const t = useTranslations("login.form");
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);
  const supabase = getBrowserClient();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginValues) {
    startTransition(async () => {
      const { error } = await serverSignIn(values);
      if (error) {
        toast.error(t("toast.loginFailed"), {
          description: error,
        });
        return;
      }

      toast.success(t("toast.loginSuccessful"));

      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setInitialized(true);

      router.replace("/");
      router.refresh();
    });
  }

  return (
    <form
      id="login-form"
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
                <FieldLabel htmlFor="login-email">{t("email")}</FieldLabel>
                <Input
                  {...field}
                  id="login-email"
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
                <FieldLabel htmlFor="login-password">
                  {t("password")}
                </FieldLabel>
                <Input
                  {...field}
                  id="login-password"
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
      </FieldGroup>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? <Spinner /> : t("login")}
      </Button>
    </form>
  );
}
