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

  const authPages = ["/login", "/registration", "/forgot-password"];

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

  const isAuthPage = authPages.includes(pathnameNoLocale);

  if (user && isAuthPage) {
    const redirectRes = NextResponse.redirect(
      new URL(`/${locale}`, request.url),
      // new URL("/", request.url),
    );
    copyCookies(response, redirectRes);
    return redirectRes;
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|img).*)"],
};
