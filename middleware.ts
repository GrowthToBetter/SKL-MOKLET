import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest, res: NextResponse, next: NextFetchEvent) {
  const requireAuthToken = ["/","/profile", "/profile/edit","/checklist", "/isiIdentitas", "/isiIdentitas/personalData", "/isiIdentitas/achievement"];
  const pathname = req.nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (requireAuthToken.includes(pathname) && !token) {
    console.log(pathname)
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
