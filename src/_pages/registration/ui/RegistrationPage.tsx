import { AuthShell } from "@/widgets/auth-shell";

import { RegistrationForm } from "./RegistrationForm";

export async function RegistrationPage() {
  return (
    <AuthShell page="registration">
      <RegistrationForm />
    </AuthShell>
  );
}
