import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  API_ROUTE_PREFIX,
  AUTH_ROUTES,
  LOGIN_REDIRECT_ROUTE,
  LOGIN_ROUTE,
  PUBLIC_ROUTES,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  console.log("Middleware invoked on route: ", req.nextUrl.pathname);
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = req.nextUrl.pathname.startsWith(API_ROUTE_PREFIX);
  const isAuthRoute = AUTH_ROUTES.includes(req.nextUrl.pathname);
  const isPublicRoute =
    PUBLIC_ROUTES.includes(req.nextUrl.pathname) ||
    isApiAuthRoute ||
    isAuthRoute;
  console.log("MIDDLEWARE", {
    isLoggedIn,
    isApiAuthRoute,
    isAuthRoute,
    isPublicRoute,
  });

  if (isAuthRoute && isLoggedIn) {
    console.log("Redirecting to login redirect");
    return Response.redirect(new URL(LOGIN_REDIRECT_ROUTE, req.nextUrl.origin));
  } else if (!isLoggedIn && !isPublicRoute) {
    console.log("Redirecting to login");
    return Response.redirect(new URL(LOGIN_ROUTE, req.nextUrl.origin));
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
