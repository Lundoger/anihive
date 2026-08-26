import type { Provider } from "@supabase/supabase-js";
import type { ComponentType } from "react";

import { DiscordIcon } from "../ui/icons/DiscordIcon";
import { GoogleIcon } from "../ui/icons/GoogleIcon";

type OAuthProvider = {
  id: Provider;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

export const OAUTH_PROVIDERS: readonly OAuthProvider[] = [
  { id: "google", label: "Google", Icon: GoogleIcon },
  { id: "discord", label: "Discord", Icon: DiscordIcon },
];
