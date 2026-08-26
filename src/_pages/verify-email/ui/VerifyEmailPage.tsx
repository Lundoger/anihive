import { Suspense } from "react";

import { AuthShell } from "@/widgets/auth-shell";

import { VerifyEmailForm } from "./VerifyEmailForm";

export async function VerifyEmailPage() {
  return (
    <AuthShell page="verifyEmail">
      <Suspense fallback={null}>
        <VerifyEmailForm />
      </Suspense>
    </AuthShell>
  );
}
