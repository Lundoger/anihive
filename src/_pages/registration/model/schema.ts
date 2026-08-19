import { z } from "zod";

import type { Translator } from "@/shared/types/i18n";

export function createRegistrationSchema(t: Translator) {
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

export type RegistrationValues = z.infer<
  ReturnType<typeof createRegistrationSchema>
>;
