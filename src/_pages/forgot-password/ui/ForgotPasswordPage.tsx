import { AuthShell } from "@/widgets/auth-shell";

import { ForgotPasswordForm } from "./ForgotPasswordForm";

export async function ForgotPasswordPage() {
  return (
    <AuthShell page="forgotPassword">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
