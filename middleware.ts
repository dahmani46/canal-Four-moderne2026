import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken, type Role } from "@/lib/auth";

const ROUTE_ROLES: { prefix: string; roles: Role[] }[] = [
  { prefix: "/admin-general", roles: ["admin_general"] },
  // admin_general garde un accès de consultation sur /admin (participants,
  // classement) pour sa vue d'ensemble ; les actions de mutation restent
  // vérifiées côté API pour le rôle admin_patisserie uniquement.
  { prefix: "/admin", roles: ["admin_patisserie", "admin_general"] },
  { prefix: "/jury", roles: ["jury"] },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const match = ROUTE_ROLES.find((r) => pathname.startsWith(r.prefix));
  if (!match) return NextResponse.next();
  if (pathname.startsWith(`${match.prefix}/login`)) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session || !match.roles.includes(session.role)) {
    const loginUrl = new URL(`${match.prefix}/login`, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin-general/:path*", "/jury/:path*"],
};
