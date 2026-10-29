import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export const proxy = createMiddleware(routing);
export default proxy;

export const config = {
  // Match all request paths except for:
  // - API routes (/api/*)
  // - Next.js internals (_next/*, _vercel/*)
  // - Static files (.ico, .png, .jpg, .svg, etc.)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
