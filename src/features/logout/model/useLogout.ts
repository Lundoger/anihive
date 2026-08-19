"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import { useSessionStore } from "@/entities/session";

export function useLogout() {
  const t = useTranslations("logout");
  const router = useRouter();
  const signOut = useSessionStore((s) => s.signOut);
  const [isPending, startTransition] = useTransition();

  const logout = () => {
    startTransition(async () => {
      const { error } = await signOut();
      if (error) {
        toast.error(t("toast.failed"), { description: error });
        return;
      }

      toast.success(t("toast.success"));
      router.replace("/login");
      router.refresh();
    });
  };

  return { logout, isPending };
}
