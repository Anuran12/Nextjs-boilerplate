import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get("error");

  // Log the error server-side
  console.error("NextAuth Error:", {
    error,
    url: request.url,
    userAgent: request.headers.get("user-agent"),
    timestamp: new Date().toISOString(),
  });

  // Redirect to login page with the error parameter
  const redirectUrl = new URL("/login", request.url);
  if (error) {
    redirectUrl.searchParams.set("authError", error);
  }

  return NextResponse.redirect(redirectUrl);
}
