import { AUTH_PAGES } from "@/business/constants/navigation";
import { updateSession } from "@/business/utils/supabase/proxy";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

function copyCookies(from: NextResponse, to: NextResponse) {
  for (const c of from.cookies.getAll()) {
    to.cookies.set(c as any);
  }
}

export async function proxy(request: NextRequest) {
  let response = handleI18nRouting(request);

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
  const locale = hasLocale ? maybeLocale : routing.defaultLocale;
  // console.log("locale", locale);
  // console.log("hasLocale", hasLocale);
  // console.log("maybeLocale", maybeLocale);
  // console.log("routing.defaultLocale", routing.defaultLocale);
  // console.log("url.pathname", url.pathname);

  const isAuthPage = AUTH_PAGES.includes(pathnameNoLocale);

  if (user && isAuthPage) {
    const redirectRes = NextResponse.redirect(new URL(`/`, request.url));
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
