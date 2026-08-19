import type { useTranslations } from "next-intl";

/** A scoped next-intl translator, as handed to schema builders. */
export type Translator = ReturnType<typeof useTranslations>;
