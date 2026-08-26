import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/shared/api/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const oauthError = request.nextUrl.searchParams.get("error");
  const next = request.nextUrl.searchParams.get("next")?.startsWith("/")
    ? request.nextUrl.searchParams.get("next")
    : null;

  if (oauthError || !code) {
    return NextResponse.redirect(new URL("/login?error=true", request.url));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login?error=true", request.url));
  }

  return NextResponse.redirect(new URL(next ?? "/", request.url));
}
