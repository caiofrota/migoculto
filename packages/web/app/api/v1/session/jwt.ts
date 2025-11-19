import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { NextRequest } from "next/server";

type SessionPayload = {
  email: string;
  role: "ADMIN" | "USER";
};

export async function createAccessToken(payload: JWTPayload & SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRES_IN)
    .sign(new TextEncoder().encode(process.env.SESSION_SECRET));
  return token;
}

export async function createRefreshToken(payload: JWTPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRES_IN)
    .sign(new TextEncoder().encode(process.env.SESSION_SECRET));
  return token;
}

export async function verify<T = JWTPayload & SessionPayload>(token: string): Promise<T> {
  return (await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET))).payload as T;
}

export async function getJwtPayloadFromCookies(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) throw new Error("No access token");
  return await verify(token);
}

export async function getJwtPayload(request: NextRequest) {
  try {
    return await getJwtPayloadFromCookies(request);
  } catch {
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!bearerToken) throw new Error("No access token");
    return await verify(bearerToken);
  }
}
