"use client";

import { useEffect, useMemo } from "react";

import { pendingVerifyEmail } from "../lib/pendingVerifyEmail";

/**
 * Resolves the address an OTP page should confirm: the query parameter wins,
 * otherwise whatever the previous step left behind. A query parameter is also
 * persisted, so a reload without it still knows who is being verified.
 */
export function usePendingVerifyEmail(
  emailFromQuery: string | null | undefined,
) {
  const email = useMemo(() => {
    if (emailFromQuery) return emailFromQuery;
    return pendingVerifyEmail.read();
  }, [emailFromQuery]);

  useEffect(() => {
    if (emailFromQuery) {
      pendingVerifyEmail.save(emailFromQuery);
    }
  }, [emailFromQuery]);

  return email;
}
