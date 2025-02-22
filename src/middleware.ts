import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  const publicRoutes = ["/api/clerk-webhook", "/", "/auth/login"];

  if (publicRoutes.some((route) => req.nextUrl.pathname.match(route))) {
    return NextResponse.next(); // Allow access
  }

  const authObject = getAuth(req); // ✅ Ensure Clerk's `getAuth` is used

  if (!authObject || !authObject.userId) {
    return NextResponse.redirect(new URL("/auth/login", req.url)); // Redirect to login if unauthenticated
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // ✅ Ensures middleware runs for non-static routes
    "/api/:path*",
  ],
};
