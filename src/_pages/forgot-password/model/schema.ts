import { z } from "zod";

import type { Translator } from "@/shared/types/i18n";

export function createForgotPasswordSchema(t: Translator) {
  return z.object({
    email: z
      .string()
      .min(1, { message: t("errors.emailRequired") })
      .email({ message: t("errors.emailInvalid") }),
  });
}

export type ForgotPasswordValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
