import { getSessionUser } from "app/api/v1/session/authentication";
import { verify } from "app/api/v1/session/jwt";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATH = "/admin";
const LOGIN_PATH = "/login";

function isLoginPath(pathname: string) {
  return pathname === LOGIN_PATH;
}

function redirectToLogin(request: NextRequest) {
  const url = new URL(LOGIN_PATH, request.url);
  const response = NextResponse.redirect(url);
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}

function redirectToAdmin(request: NextRequest) {
  const url = new URL(ADMIN_PATH, request.url);
  return NextResponse.redirect(url);
}

function isProtectedRoute(pathname: string) {
  const protectedRoutes = [ADMIN_PATH];
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export async function tryRefreshToken(request: NextRequest): Promise<NextResponse | null> {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) return null;

  await verify(refreshToken);

  const refreshUrl = new URL("/api/v1/session/refresh", request.url);
  const refreshResponse = await fetch(refreshUrl.toString(), {
    method: "POST",
    headers: {
      Cookie: `refresh_token=${refreshToken}`,
    },
  });

  if (!refreshResponse.ok) throw new Error("Failed to refresh token");

  const response = NextResponse.next();
  const setCookie = refreshResponse.headers.get("set-cookie");
  if (setCookie) {
    response.headers.append("set-cookie", setCookie);
  } else {
    throw new Error("No set-cookie header in refresh response");
  }

  return response;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname) && !isLoginPath(pathname)) return NextResponse.next();
  try {
    const payload = await getSessionUser(request);
    if (isLoginPath(pathname)) return redirectToAdmin(request);

    const res = NextResponse.next();
    res.headers.set("x-user_id", String(payload.id));
    res.headers.set("x-user_role", payload.role);
    return res;
  } catch (error) {
    if (isLoginPath(pathname)) return NextResponse.next();
    try {
      const refreshed = await tryRefreshToken(request);
      if (refreshed) {
        return refreshed;
      }
      throw new Error("Failed to refresh token");
    } catch (error) {
      console.log("Redirecting to login due to error:", error);
    }
    return redirectToLogin(request);
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/login"],
};
