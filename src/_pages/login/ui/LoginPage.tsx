import { AuthShell } from "@/widgets/auth-shell";

import { LoginForm } from "./LoginForm";

export async function LoginPage() {
  return (
    <AuthShell page="login">
      <LoginForm />
    </AuthShell>
  );
}
