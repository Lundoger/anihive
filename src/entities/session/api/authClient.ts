import { getBrowserClient } from "@/shared/api/supabase/client";

type OtpParams = {
  email: string;
  token: string;
};

/**
 * Auth calls that have to run on the browser client, as opposed to the server
 * actions in `./index.ts`. The OTP ones in particular must stay here: they
 * refresh the session in place, so `useSessionSync` picks the new one up from
 * `onAuthStateChange` and nothing has to write to the store by hand.
 *
 * All of them mirror the server actions' shape — `{ error: string | null }` —
 * so callers never touch a Supabase error object.
 */

export async function requestPasswordReset(email: string) {
  const { error } = await getBrowserClient().auth.resetPasswordForEmail(email);
  return { error: error?.message ?? null };
}

export async function resendSignUpCode(email: string) {
  const { error } = await getBrowserClient().auth.resend({
    type: "signup",
    email,
  });
  return { error: error?.message ?? null };
}

export async function confirmSignUp({ email, token }: OtpParams) {
  const { error } = await getBrowserClient().auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  return { error: error?.message ?? null };
}

export async function confirmPasswordRecovery({ email, token }: OtpParams) {
  const { error } = await getBrowserClient().auth.verifyOtp({
    email,
    token,
    type: "recovery",
  });
  return { error: error?.message ?? null };
}

export async function updatePassword(password: string) {
  const { error } = await getBrowserClient().auth.updateUser({ password });
  return { error: error?.message ?? null };
}

/** Sends a confirmation code to the address the user wants to move to. */
export async function requestEmailChange(email: string) {
  const { error } = await getBrowserClient().auth.updateUser({ email });
  return { error: error?.message ?? null };
}

export async function confirmEmailChange({ email, token }: OtpParams) {
  const { error } = await getBrowserClient().auth.verifyOtp({
    email,
    token,
    type: "email_change",
  });
  return { error: error?.message ?? null };
}

/**
 * Proves the user still knows their current password before a sensitive
 * change. Succeeds by re-issuing the same session, so nothing else moves.
 */
export async function reauthenticate({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { error } = await getBrowserClient().auth.signInWithPassword({
    email,
    password,
  });
  return { error: error?.message ?? null };
}
