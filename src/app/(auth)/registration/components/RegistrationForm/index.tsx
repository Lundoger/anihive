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
import { KeyRound, Mail, RotateCcwKey, UserRound } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const registrationSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[^\p{L}\p{N}\s]/u, {
        message: "Password must include at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegistrationValues = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
  });

  function onSubmit(values: RegistrationValues) {
    startTransition(() => {
      void (async () => {
        const { error } = await signUp(values);
        if (error) {
          toast.error("Registration failed", {
            description: error,
          });
        }
      })();
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
                <FieldLabel htmlFor="registration-email">Email</FieldLabel>
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
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="relative">
                <FieldLabel htmlFor="registration-username">
                  Username
                </FieldLabel>
                <Input
                  {...field}
                  id="registration-username"
                  type="text"
                  autoComplete="username"
                  aria-invalid={fieldState.invalid}
                  prefixIcon={<UserRound />}
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
                  Password
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
                  Confirm Password
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
        {isPending ? <Spinner /> : "Create an account"}
      </Button>
    </form>
  );
}
