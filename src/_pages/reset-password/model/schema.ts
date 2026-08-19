import { z } from "zod";

import type { Translator } from "@/shared/types/i18n";

export function createResetPasswordSchema(t: Translator) {
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

export type ResetPasswordValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
