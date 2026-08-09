import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  console.log("=== PROXY TRIGGERED ===", request.nextUrl.pathname);
  const res = intlMiddleware(request);
  console.log("=== PROXY RESPONSE ===", res?.status, res?.headers?.get("x-middleware-rewrite"));
  return res;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

