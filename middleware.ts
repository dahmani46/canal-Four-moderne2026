import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken, type Role } from "@/lib/auth";

const ROUTE_ROLES: { prefix: string; role: Role }[] = [
  { prefix: "/admin-general", role: "admin_general" },
  { prefix: "/admin", role: "admin_patisserie" },
  { prefix: "/jury", role: "jury" },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const match = ROUTE_ROLES.find((r) => pathname.startsWith(r.prefix));
  if (!match) return NextResponse.next();
  if (pathname.startsWith(`${match.prefix}/login`)) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session || session.role !== match.role) {
    const loginUrl = new URL(`${match.prefix}/login`, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin-general/:path*", "/jury/:path*"],
};
