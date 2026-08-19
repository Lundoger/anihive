import { z } from "zod";

import type { Translator } from "@/shared/types/i18n";

export function createVerifyEmailSchema(t: Translator) {
  return z.object({
    token: z.string().min(1, { message: t("errors.tokenRequired") }),
  });
}

export type VerifyEmailValues = z.infer<
  ReturnType<typeof createVerifyEmailSchema>
>;
