import { z } from "zod";

import type { Translator } from "@/shared/types/i18n";

export function createLoginSchema(t: Translator) {
  return z.object({
    email: z
      .string()
      .min(1, { message: t("errors.emailRequired") })
      .email({ message: t("errors.emailInvalid") }),
    password: z.string().min(1, { message: t("errors.passwordRequired") }),
  });
}

export type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>;
