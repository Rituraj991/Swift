import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default async function middleware(req) {
  const { userId } = await auth();

  if (!userId) {
    // User is not authenticated, redirect to sign-in page
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // User is authenticated, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile", "/settings"], // Protect specific routes
};
