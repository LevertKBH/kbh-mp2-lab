import type { auth } from "@/lib/auth";
import { betterFetch } from "@better-fetch/fetch";
import { type NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  );

  if (!session && request.nextUrl.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!session && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard/entries", request.url));
  }

  if (session && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard/entries", request.url));
  }

  if (
    session &&
    request.nextUrl.pathname === "/dashboard/users" &&
    session.user.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard/entries", request.url));
  }

  if (
    session &&
    request.nextUrl.pathname === "/dashboard/audit" &&
    session.user.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard/entries", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/"],
};
