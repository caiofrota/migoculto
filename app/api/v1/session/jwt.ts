import { JWTPayload, jwtVerify, SignJWT } from "jose";

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
