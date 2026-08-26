import { Suspense } from "react";

import { AuthShell } from "@/widgets/auth-shell";

import { ResetPasswordForm } from "./ResetPasswordForm";

export async function ResetPasswordPage() {
  return (
    <AuthShell page="resetPassword">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
