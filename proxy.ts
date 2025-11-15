import { verify } from "app/api/v1/session/jwt";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATH = "/admin";
const LOGIN_PATH = "/login";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  try {
    const protectedRoutes = [ADMIN_PATH];
    if (!token) {
      if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        throw new Error("No access token");
      } else {
        return NextResponse.next();
      }
    }

    await verify(token);

    if (pathname === LOGIN_PATH) {
      const url = new URL(ADMIN_PATH, request.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    try {
      const refreshToken = request.cookies.get("refresh_token")?.value;
      if (refreshToken && (await verify(refreshToken))) {
        const refreshTokenResponse = await fetch("http://localhost:3000/api/v1/session/refresh", {
          method: "POST",
          headers: {
            Cookie: `refresh_token=${refreshToken}`,
          },
        });
        if (!refreshTokenResponse.ok) throw new Error("Invalid refresh token");

        const response = NextResponse.next();
        const cookies = refreshTokenResponse.headers.get("Set-Cookie");
        if (cookies) {
          response.headers.set("Set-Cookie", cookies);
          await verify(
            cookies
              .split(";")
              .find((c) => c.trim().startsWith("access_token="))
              ?.split("=")[1] || "",
          );
          return response;
        }
      }
      throw new Error("No refresh token");
    } catch (error) {
      console.error(error);
      const url = new URL(LOGIN_PATH, request.url);
      const response = NextResponse.redirect(url);
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/login"],
};
