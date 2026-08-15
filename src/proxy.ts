import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/shared/api/supabase/proxy";
import {
  NON_AUTH_ONLY_PAGES,
  PROTECTED_PAGES,
} from "@/shared/config/routesLists";

import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

function copyCookies(from: NextResponse, to: NextResponse) {
  for (const c of from.cookies.getAll()) {
    to.cookies.set(c as any);
  }
}

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  const { user } = await updateSession(request, response);

  const url = new URL(
    response.headers.get("x-middleware-rewrite") ??
      response.headers.get("location") ??
      request.url,
  );

  const [, maybeLocale, ...rest] = url.pathname.split("/");
  const hasLocale = routing.locales.includes(maybeLocale as any);
  const pathnameNoLocale =
    "/" + (hasLocale ? rest : [maybeLocale, ...rest]).filter(Boolean).join("/");

  const isAuthOnlyPage = NON_AUTH_ONLY_PAGES.includes(pathnameNoLocale);
  const isProtectedPage = PROTECTED_PAGES.includes(pathnameNoLocale);

  // Authenticated users shouldn't access guest-only auth pages.
  if (user && isAuthOnlyPage) {
    const redirectRes = NextResponse.redirect(new URL(`/`, request.url));
    copyCookies(response, redirectRes);
    return redirectRes;
  }

  // Guests shouldn't access protected pages.
  if (!user && isProtectedPage) {
    const redirectRes = NextResponse.redirect(new URL(`/login`, request.url));
    copyCookies(response, redirectRes);
    return redirectRes;
  }

  return response;
}

export const config = {
  // Exclude Next internals + static assets + ".well-known" (e.g. Chrome DevTools automatic workspaces probe)
  matcher: [
    "/((?!\\.well-known)(?!.*\\/\\.well-known)(?!api|_next/static|_next/image|favicon.ico|img).*)",
  ],
};
